import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Brand {
    @Prop({
        required : true ,
        type : String
    })
    name : string

    @Prop({
        required : false ,
        type : String
    })
    image : string

}

export const BrandSchema = SchemaFactory.createForClass(Brand)