import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Brand } from "src/brand/brand.schema";
import { Category } from "src/category/category.schema";
import { SubCategory } from "src/sub category/sub-category.schema";


@Schema({timestamps : true , toJSON :{virtuals : true} , toObject : {virtuals : true}})
export class Product{

    @Prop({
        required: true,
        type : String
    })
    name : string


    @Prop({
        required: true,
        type : String
    })
    description : string


    @Prop({
        required: true,
        type : Number,
        default : 10
    })
    quantity : number


    @Prop({
        required: true,
        type : String
    })
    imageCover : string


    @Prop({
        type : Array,
        required : false
    })
    images : string[]



    @Prop({
        type : Number,
        required : false,
        default : 0
    })
    sold : number


    @Prop({
        type : Number,
        required : true,
        max : 100000
    })
    price : number


    @Prop({
        type : Number,
        required : false
    })
    priceAfterDiscount : number

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Category.name,
    })
    categoryId : string

    @Prop({
        type : String,
    })
    categoryName : string


   
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: SubCategory.name,
    })
    subCategoryId : string

    @Prop({
        type : String,
    })
    subCategoryName : string



    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: SubCategory.name,
    })
    brandId : string

    @Prop({
        ref: Brand.name,
    })
    brandName : string

    

    @Prop({
        type : Number,
        required : false,
        default : 0
    })
    ratingsAverage : number


    @Prop({
        type : Number,
        required : false,
        default : 0
    })
    ratingsQuantity : number

}


export const ProductSchema = SchemaFactory.createForClass(Product)


ProductSchema.virtual('categoryDetails' , {
    ref : 'Category',
    localField : 'categoryId',
    foreignField : '_id',
    justOne : true
})

ProductSchema.virtual('subCategoryDetails', {
    ref : 'SubCategory',
    localField : 'subCategoryId',
    foreignField : '_id',
    justOne : true
})


ProductSchema.virtual('brandDetails' , {
    ref : 'Brand',
    localField : 'brandId',
    foreignField : '_id',
    justOne : true
})

