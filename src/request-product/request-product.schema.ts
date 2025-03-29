import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional } from "class-validator";
import mongoose, { HydratedDocument, Mongoose } from "mongoose";
import { User } from "src/user/user.schema";


@Schema({timestamps : true})
export class RequestProduct {

    @Prop({
        type: String,
        required : true
    })
    title : string

    @Prop({
        type : String,
        required : true

    })
    details : string



    @Prop({
        type : Number,
    })
    quantity : number


    @Prop({
        type : mongoose.Schema.ObjectId,
        ref : User.name,
    })
    user : string

}


export const RequestProductSchema = SchemaFactory.createForClass(RequestProduct)