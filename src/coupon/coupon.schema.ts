import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps : true})
export class Coupon{
    @Prop({
        type: String,
        required: true,
        trim : true,
        unique : true
    })
    name : string


    @Prop({
        type: Date,
        required: true,
        validate : {
            validator : function(value : Date){
                return value > new Date()
            } , message : "Expiration date must be in the future"
        }
    })
    expireDate : Date


    @Prop({
        type: Number,
        required: true,
        min: [1, 'Discount cannot be less than 1%'],
        max: [100, 'Discount cannot exceed 100%'],
    })
    discount : number
}


export const CouponSchema = SchemaFactory.createForClass(Coupon)