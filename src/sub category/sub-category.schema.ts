import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Category } from "src/category/category.schema";

@Schema({timestamps : true})
export class SubCategory {
    @Prop({
        required : true,
        type : String,
        unique : true
    })
    name : string


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
    category: mongoose.Types.ObjectId;

    @Prop({ type: String })
    categoryName: string;
}


export const subCategorySchema = SchemaFactory.createForClass(SubCategory)