import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';

@Injectable()
export class CartService {

  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,

    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,

    @InjectModel(Coupon.name)
    private readonly couponModel: Model<Coupon>,

  ){}

  async addToCart(productId: string, userId: string) {
    const existedProduct = await this.productModel.findById(productId)
        .select('price discountPercentage quantity');

    if (!existedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (existedProduct.quantity <= 0) {
        throw new NotFoundException("Product is out of stock");
    }

    const singleItemDiscountedPrice  = existedProduct.price * (1- existedProduct.discountPercentage / 100);

    const existedCart = await this.cartModel.findOne({ userId })
        .populate("cartItems.product", "price discountPercentage");

    if (existedCart) {
        let ifProductAlreadyInserted = {
            ifAdded: false,
            productIndex: -1
        };

        let totalPriceBeforeAddingProduct = 0;
        let totalDiscountedPriceBeforeAdding = 0;


        existedCart.cartItems.forEach((item, index) => {
          const itemDiscountPrice = item.product.price * 
          ( 1 - item.product.discountPercentage / 100);

            if (item.product._id.toString() === productId.toString()) {
                ifProductAlreadyInserted = {
                    ifAdded: true,
                    productIndex: index
                };
            }
            totalPriceBeforeAddingProduct += (item.product.price) * item.quantity;
            totalDiscountedPriceBeforeAdding += (itemDiscountPrice) * item.quantity;
        });

        const updatedCartItems = existedCart.cartItems.map(item => ({
            product: item.product._id, 
            quantity: item.quantity
        }));

        if (ifProductAlreadyInserted.ifAdded) {
            updatedCartItems[ifProductAlreadyInserted.productIndex].quantity += 1;
        } else {
            updatedCartItems.push({
                // @ts-ignore
                product: existedProduct._id, 
                quantity: 1
            });
        }

        const newTotalPrice = totalPriceBeforeAddingProduct + existedProduct.price
        const newTotalDiscountedPrice = totalDiscountedPriceBeforeAdding + singleItemDiscountedPrice;

        const updatedCart = await this.cartModel.findOneAndUpdate(
            { userId },
            {
                cartItems: updatedCartItems,
                totalPrice: newTotalPrice,
                totalPriceAfterDiscount : newTotalDiscountedPrice,
                userId
            },
            { new: true }
        ).populate("cartItems.product", "price");

        return {
            status: HttpStatus.OK,
            message: "Product added to cart",
            data: updatedCart
        };
    } else {
        const newCart = await this.cartModel.create({
            cartItems: [{
                product: existedProduct._id, // Store as ObjectId
                quantity: 1
            }],
            totalPrice: existedProduct.price,
            totalPriceAfterDiscount: singleItemDiscountedPrice,
            userId
        });

        const populatedCart = await this.cartModel.findById(newCart._id)
          .populate("cartItems.product", "price discountPercentage ");

        return {
            status: HttpStatus.CREATED,
            message: 'Cart is created with the selected product',
            data: populatedCart
        };
    }
}
  


  async findOne(userId: string) {
    const existedCart = await this.cartModel.findOne({userId})
    .populate("cartItems.product", "price name description discountPercentage ")
    .select(" -_id -__v ");
    if (!existedCart) {
      throw new NotFoundException("Cart is empty")
    }


    return {
      status: HttpStatus.FOUND,
      message : "Cart is found",
      data: existedCart
    }


  }

  /*async update(productId: string, updateCartDto: UpdateCartDto , userId) {
    const cart = await this.cartModel.findOne({userId})
    .populate('cartItems.productId' , 'name price description priceAfterDiscount -_id').lean()


    const product = await this.productModel.findById(productId)

    if(!cart){
      const result = await this.create(productId , userId)
      return result
    }


    const indexProductUpdate = cart.cartItems.findIndex(
      (cartItem) => cartItem.productId.toString() === productId.toString()
    );

    if(indexProductUpdate === -1){
      throw new NotFoundException("Cart is empty")
    }

    if(updateCartDto.quantity > product.quantity){
      throw new NotFoundException("You are ordering more than we have in stock")
    }

    let totalPriceAfterUpdate = 0

    let totalDiscountPriceAfterupdate = 0

    if(updateCartDto.quantity){
      cart.cartItems[indexProductUpdate].quantity = updateCartDto.quantity
      cart.cartItems.map((item) =>{
        totalPriceAfterUpdate += item.quantity * item.productId.price;
        totalDiscountPriceAfterupdate += item.quantity * item.productId.priceAfterDiscount
      })

      cart.totalPrice = totalPriceAfterUpdate - totalDiscountPriceAfterupdate
    }

    

    return {
      stats : 200,
      message : "Cart updated successfully",
      data : cart
    }


  }*/
  

    async removeFromCart(productId: string, userId: string) {
      try {
        // 1. Find cart with populated product data
        const cart = await this.cartModel.findOne({ userId })
          .populate({
            path: 'cartItems.product',
            select: 'price discountPercentage name imageCover',
            model: 'Product'
          });
    
        if (!cart) {
          throw new NotFoundException("Cart not found");
        }
    
        // 2. Filter out any invalid items and find the product to remove
        const validCartItems = cart.cartItems.filter(item => 
          item?.product?._id && item.product.price !== undefined
        );
    
        const itemIndex = validCartItems.findIndex(item => 
          item.product._id.toString() === productId.toString()
        );
    
        if (itemIndex === -1) {
          throw new NotFoundException("Product not found in cart");
        }
    
        // 3. Create updated cart items
        const updatedCartItems = validCartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }));
    
        const itemToUpdate = updatedCartItems[itemIndex];
    
        // 4. Handle quantity decrease or removal
        if (itemToUpdate.quantity > 1) {
          updatedCartItems[itemIndex].quantity -= 1;
        } else {
          updatedCartItems.splice(itemIndex, 1);
        }
    
        // 5. Recalculate totals safely
        const products = await this.productModel.find({
          _id: { $in: updatedCartItems.map(i => i.product) }
        }).select('price discountPercentage');
    
        let totalPrice = 0;
        let totalPriceAfterDiscount = 0;
    
        updatedCartItems.forEach(cartItem => {
          const product = products.find(p => 
            p._id.toString() === cartItem.product.toString()
          );
          if (product) {
            const discountedPrice = product.price * 
              (1 - (product.discountPercentage || 0) / 100);
            totalPrice += product.price * cartItem.quantity;
            totalPriceAfterDiscount += discountedPrice * cartItem.quantity;
          }
        });
    
        // 6. Update cart
        const updatedCart = await this.cartModel.findOneAndUpdate(
          { userId },
          {
            cartItems: updatedCartItems,
            totalPrice,
            totalPriceAfterDiscount
          },
          { new: true }
        ).populate({
          path: 'cartItems.product',
          select: 'price discountPercentage name imageCover',
          model: 'Product'
        });
    
        return {
          status: HttpStatus.OK,
          message: itemToUpdate.quantity > 1 
            ? "Product quantity decreased successfully" 
            : "Product removed from cart successfully",
          data: updatedCart
        };
    
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new HttpException(
          'Failed to update cart', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }


    async applyCoupon(userId: string, couponName: string) {
      const validCoupon = await this.couponModel.findOne({ name : couponName.replace(/\s+/g, '')})
      if(!validCoupon) {
        throw new HttpException('Invalid coupon', HttpStatus.NOT_FOUND);
      }

      const existedCart = await this.cartModel.findOne({userId})

      if(!existedCart){
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND)
      }

      const isExpired = new Date(validCoupon.expireDate) > new Date()
      if(!isExpired) {
        throw new HttpException('Coupon has expired', HttpStatus.BAD_REQUEST);
      }

      const ifCouponAlreadyUsed = existedCart.coupons.findIndex(item =>{
        item.name === couponName
      })

      if(ifCouponAlreadyUsed !== -1) {
        throw new HttpException('Coupon already used', HttpStatus.BAD_REQUEST)
      }

      existedCart.coupons.push({ name: validCoupon.name, couponId: validCoupon._id.toString() });

      const basePrice = existedCart.totalPriceAfterDiscount ?? existedCart.totalPrice;
      const couponDiscountAmount = basePrice * (validCoupon.discount / 100);
      existedCart.totalPriceAfterDiscount = basePrice - couponDiscountAmount;
      await existedCart.save()

      return{
        status : HttpStatus.OK,
        message : 'Coupon applied successfully',
        cart : existedCart
      }



    }


  
    
    
}
