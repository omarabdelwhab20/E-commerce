import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { Product, ProductSchema } from 'src/product/product.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name : Order.name , schema : OrderSchema},
    {name : Cart.name , schema : CartSchema},
    {name : Product.name , schema : ProductSchema}
  ])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
