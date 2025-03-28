import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Supplier {
    @Prop({
        required: true,
        unique: true,
        type : String,
        trim : true
    })
    name : string

    @Prop({
        required: true,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use a valid URL'],
        unique : true

    })
    website : string

    @Prop({
        type : String,
    })
    contactEmail?: string

    @Prop({
        type : String,
    })
    phone? : string


    


}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);