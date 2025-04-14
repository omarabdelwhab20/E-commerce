import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/product/product.schema";
import { User } from "src/user/user.schema";


export type orderDocument = HydratedDocument<Order>

@Schema({timestamps : true})
export class Order {


    @Prop({
        required: true,
        type : mongoose.Schema.Types.ObjectId,
        ref : User.name
    })
    userId : typeof User

    @Prop({
        required: true,
        type : String
    })
    sessionId : string

    @Prop({
        required: true,
        type :String
    })
    paymentMethodType: string 
        


    @Prop([
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : Product.name,
                required : true
            },
            quantity : {
                type : Number,
                required : true

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

    @Prop({
        required : true ,
        type : Number,
        default : 0
    })
    shippingPrice : number


    @Prop({
        required : true ,
        type : Number,
        default : 0
    })
    totalOrderPrice : number




    @Prop({
        required : false ,
        type : Boolean,
        default : false
    })
    isPaid : boolean



    @Prop({
        required : false ,
        type : Date,
    })
    paidAt : Date


    @Prop({
        type : Boolean,
        default : false,
        required : false
    })
    isDelivered : boolean


    @Prop({
        required : false ,
        type : Date,

    })
    deliveredAt : Date
    


    @Prop({
        required : true ,
        type : [
            {alias : String,
            details : String,
            city : String,
            phone : String,
            postalCode : String
        }
        ],
        default : 0
    })
    shippingAddress : {
        alias : string,
        details : string,
        city : string,
        phone : string,
        postalCode : string,
    }
}

export const OrderSchema = SchemaFactory.createForClass(Order)