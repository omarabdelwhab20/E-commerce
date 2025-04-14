import { HttpStatus, Injectable, NotFoundException, Session } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Product } from 'src/product/product.schema';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,

    @InjectModel(Product.name)
    private readonly productModel: Model<Product>

  ){}

  async createSession(createOrderDto: CreateOrderDto , userId , dataAfterPayment : {success_url :string , cancel_url : string}) {
    console.log('Stripe Key:',process.env.STRIPE_SECRET_KEY);
    const exitedCart = await this.cartModel.findOne({userId})
    .populate("cartItems.product userId")

    if(!exitedCart){
      throw new NotFoundException("Cart is empty")
    }

    const orderTotalPrice = exitedCart.totalPriceAfterDiscount > 0
      ?exitedCart.totalPriceAfterDiscount
      :exitedCart.totalPrice

    let orderDate = {
      userId: userId,
      cart: exitedCart.cartItems,
      totalPrice: orderTotalPrice + 40,
      shippingAdress : createOrderDto

    }

    const line_items = exitedCart.cartItems.map(({product , quantity})=>{
      const priceBeforeDiscount = product.price
      const discountPercentage = product.discountPercentage || 0
      const discountedPrice = priceBeforeDiscount * (1- discountPercentage / 100)


      return {
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(discountedPrice * 100),
          product_data : {
            // @ts-ignore
            name : product.name,
            // @ts-ignore
            description : product.description,
            // @ts-ignore
          images : [product.imageCover , ...(product?.images || [])],
          }
        },
        quantity,
      }
      
    })


    const session = await stripe.checkout.sessions.create({
      
      line_items ,
      mode : 'payment',
      success_url : dataAfterPayment.success_url,
      cancel_url : dataAfterPayment.cancel_url,
      client_reference_id : userId.toString(),
      // @ts-ignore
      customer_email : exitedCart.userId.email,
      metadata: {
        alias: createOrderDto.shippingAddress?.alias || '',
        details: createOrderDto.shippingAddress?.details || '',
        city: createOrderDto.shippingAddress?.city || '',
        phone: createOrderDto.shippingAddress?.phone || '',
        postalCode: createOrderDto.shippingAddress?.postalCode || '',
      }
    });

    return {
      status : HttpStatus.OK,
      message : "Order created successfully",
      data : {
        url : session.url,
        success_url : session.success_url,
        cancel_url : session.cancel_url,
        expires_at : new Date(session.expires_at * 1000),
        sessionId : session.id,
        orderTotalPrice : session.amount_total + 40,
        shippingAddress : session.metadata
      }
    }
  }

  async handleWebhookRequest(payload : any , sig :any, endpointSecret : string){
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }catch(err){
      console.log('Webhook error',err);
      return;
    }

    console.log(event)

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        console.log("checkout session completed")
        try{
          const userId = checkoutSessionCompleted.client_reference_id
          const shippingAddress = checkoutSessionCompleted.metadata

          const paymentMethodType = checkoutSessionCompleted.payment_method_types?.[0];

          const exitedCart = await this.cartModel.findOne({userId})
          .populate('cartItems.product');

          if(!exitedCart){
            throw new NotFoundException("Cart is empty")
          }

          const cartItems = exitedCart.cartItems.map((item) =>({
            product: item.product,
            // @ts-ignore
            name : item.product.name,
            quantity: item.quantity,
            price: item.product.price * (1- (item.product.discountPercentage || 0)/100)
            
          }))

          const shippingMetaData = checkoutSessionCompleted.metadata

          await this.orderModel.create({
            userId,
            sessionId : checkoutSessionCompleted.id,
            paymentMethodType,
            totalOrderPrice : (checkoutSessionCompleted.amount_total / 100) + 40,
            shippingPrice : 40,
            isPaid : true,
            shippingAddress : {
              alias : shippingMetaData.alias,
              details : shippingMetaData.details,
              city : shippingAddress.city,
              phone : shippingMetaData.phone,
              postalCode : shippingMetaData.postalCode
            },
            cartItems: cartItems
          })

          for(const item of exitedCart.cartItems){
            const productId = item.product._id
            const quantity = item.quantity

            await this.productModel.findByIdAndUpdate(productId , {
              $inc: {
                quantity: -quantity,
                sold : quantity
              }
            })
            await this.cartModel.findByIdAndDelete(exitedCart._id)
            await exitedCart.save()
          }
        }
        catch(err){
          console.error("Error handling checkout session completed:", err)
        }
      }
      
    
    
  }
  

  async findAllForUser(userId : string) {
    const exitedUser = await this.orderModel.findOne({userId})
    if(!exitedUser){
      throw new NotFoundException("User not found")
    }

    return {
      status : HttpStatus.FOUND,
      message : "Orders found successfully",
      data : exitedUser
    }
  }



  async findAllForAdmin(){
    const orders = await this.orderModel.find().select('-_id __v cartItems totalOrderPrice')
    .populate({
      path : 'userId',
      select : ' -_id name email'
    })

    if(!orders){
      throw new NotFoundException("Orders not found")
    }

    return {
      status : HttpStatus.FOUND,
      message : "Orders found successfully",
      data : orders
    }
  }


  async findOneForAdmin(userId : string){
    const exitedUser = await this.orderModel.findOne({userId})
    if(!exitedUser){
      throw new NotFoundException("User not found")
    }

    const exitedOrder = await this.orderModel.find({userId}).select('-_id cartItems totalOrderPrice shippingAddress')
    .populate({
      path : 'userId',
      select : ' -_id name email'
    })
    if(!exitedOrder){
      throw new NotFoundException("This user has no orders")
    }

    return {
      status : HttpStatus.FOUND,
      message : "Order found successfully",
      data : exitedOrder
    }
  }



  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
