import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Coupon } from "src/coupon/coupon.schema";
import { Product } from "src/product/product.schema";
import { User } from "src/user/user.schema";

@Schema()
export class Cart{

    @Prop([
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : Product.name,
                required : true
            },
            quantity : {
                type : Number,
                default : 1
            }
        }
    ])
    cartItems : [
        {
            product : {
                _id : string,
                price : number,
                discountPercentage : number
            },
            quantity : number,
        }
    ]

    @Prop({type : Number})
    totalPrice : number 

    @Prop({type : Number})
    totalPriceAfterDiscount : number 

    @Prop({type : [
        {
            name : {
                type : String,
                required : true
            },
            couponId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : Coupon.name,
            }
        }
    ]})
    coupons : [
        {
            name : string,
            couponId : string,
        }
    ]


    @Prop({
        type : mongoose.Schema.Types.ObjectId,
        ref : User.name,
    })
    userId : string
}



export const CartSchema = SchemaFactory.createForClass(Cart);