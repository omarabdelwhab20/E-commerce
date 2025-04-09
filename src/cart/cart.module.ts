import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { Product, ProductSchema } from 'src/product/product.schema';
import { Coupon, CouponSchema } from 'src/coupon/coupon.schema';

@Module({
  imports : [MongooseModule.forFeature([
    {name : Cart.name , schema : CartSchema},
    {name : Product.name , schema : ProductSchema},
    {name : Coupon.name , schema : CouponSchema}
  ])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
