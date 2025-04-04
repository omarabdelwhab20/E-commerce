import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "src/product/product.schema";
import { User } from "src/user/user.schema";



@Schema({timestamps : true})
export class Review {
    @Prop({
        type: String,
        required: false
    })
    reviewText : string

    @Prop({
        type: Number,
        required: true
    })
    rating : number


    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required : true ,
        ref: User.name,
    })
    userId : string


    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required : true ,
        ref: Product.name,
    })
    productId : string
}




export const ReviewSchema = SchemaFactory.createForClass(Review);