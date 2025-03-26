import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional } from "class-validator";
import { Mongoose } from "mongoose";

@Schema({timestamps : true})
export class Category{
    @Prop({
        required : true,
        type : String,
        unique : true
    })
    name : string

    @Prop({
        type : String,
        required : false
    })
    image : string
}


export const categorySchema = SchemaFactory.createForClass(Category)