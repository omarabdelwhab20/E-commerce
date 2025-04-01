import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub category/sub-category.schema';
import { Brand } from 'src/brand/brand.schema';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<Category>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<Category>,
  ){}

  async create(createProductDto: CreateProductDto) {

    const productCategory = await this.categoryModel.findOne({
      name: {$regex : new RegExp(`^${createProductDto.categoryName}$` , `i`)}
    })

    const productSubCategory = await this.subCategoryModel.findOne({
      name: {$regex : new RegExp(`^${createProductDto.subCategoryName}$` , `i`)}
    })

    const productBrand = await this.brandModel.findOne({
      name: {$regex : new RegExp(`^${createProductDto.brandName}$` , `i`)}
    })

    if (!productCategory) {
      throw new HttpException(
        `Category '${createProductDto.categoryName}' not found`, 
        HttpStatus.NOT_FOUND
      );
    }
    if (!productSubCategory) {
      throw new HttpException(
        `Sub Category '${createProductDto.subCategoryName}' not found`, 
        HttpStatus.NOT_FOUND
      );
    }
    if (!productBrand) {
      throw new HttpException(
        `Brand '${createProductDto.brandName}' not found`, 
        HttpStatus.NOT_FOUND
      );
    }

    const product = await this.productModel.findOne({
      name: {$regex : new RegExp(`^${createProductDto.name}$` , `i`)}
    })


    if(product){
      throw new HttpException('Product already exists' , HttpStatus.FOUND)
    }

    const newProduct =await this.productModel.create({
      ...createProductDto,
      categoryName : createProductDto.categoryName,
      categoryId : productCategory._id,

      subCategoryName : createProductDto.subCategoryName,
      subCategoryId : productSubCategory._id,


      brandName : createProductDto.brandName, 
      brandId : productBrand._id
    });


    return {
      status : HttpStatus.CREATED,
      data : newProduct
    }

  }

  async findAll(query) {
    let requestQuery = {...query};
    const removeQuery=['page' ,'limit' , 'keyword' , 'category']
    removeQuery.forEach(singleQuery => delete requestQuery[singleQuery])


    requestQuery = JSON.parse(
      JSON.stringify(requestQuery).replace(
        /\b(gte|gt|lte|lt)\b/g,
        match => `$${match}`
      ),
    )

    let findData = {...requestQuery}

    if (query.keyword) {
      findData.$or = [
        { name: { $regex: query.keyword, $options: 'i' } }, // 'i' for case-insensitive
        { description: { $regex: query.keyword, $options: 'i' } }
      ];
    }

    if (query.category) {
      findData.categoryName = { 
        $regex: new RegExp(`^${query.category}$`, 'i') 
      };
    }

    const {page = 1 , limit = 30} = query
    const skip = (page - 1) * limit
    const products = await this.productModel.find(findData).select('-_id  name description quantity imageCover images price priceAfterDiscount categoryName subCategoryName brandName')
    .limit(limit)
    .skip(skip)
    .lean()
    return {
      status : 200,
      length : products.length,
      data : products,
    }
  }

  async findOne(id: string) {
    const existedProduct = await this.productModel.findById(id).select('-_id  name description quantity imageCover images price priceAfterDiscount categoryName subCategoryName brandName').lean()
    if(!existedProduct){
      throw new HttpException('Product not found' , HttpStatus.NOT_FOUND)
    }

    return{
      status : 200,
      data : existedProduct
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id , updateProductDto , {new : true})
    if(!updatedProduct){
      throw new HttpException('Product not found' , HttpStatus.NOT_FOUND)
    }

    return {
      status : HttpStatus.OK ,
      data : updatedProduct
    }
  }

  async remove(id: string) {
    const updatedProduct = await this.productModel.findByIdAndDelete(id)
    if(!updatedProduct){
      throw new HttpException('Product not found' , HttpStatus.NOT_FOUND)
    }

    return {
      status : HttpStatus.OK ,
      message : "Product deleted successfully"
 
    }
  }
}
