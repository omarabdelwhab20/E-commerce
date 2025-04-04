import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { ok } from 'assert';
import { Product } from 'src/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,

    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,

    private readonly productService : ProductService
  ){}


  async create(createReviewDto: CreateReviewDto , req) {
    if(req.user.role.toLowerCase() === 'admin') {
      throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
    }

    const existedReview = await this.reviewModel.findOne({
      productId: createReviewDto.productId,
      userId: req.user._id
    })

    if(existedReview){
      throw new HttpException("You have already reviewed this product", HttpStatus.BAD_REQUEST);
    }

    const newReview = await this.reviewModel.create({...createReviewDto , userId: req.user._id})


    const reviews = await this.reviewModel.find({productId: createReviewDto.productId});
    const ratingsQuantity = reviews.length;
    const ratingsSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const ratingsAverage = ratingsSum / ratingsQuantity;

    await this.productModel.findByIdAndUpdate(createReviewDto.productId, {
      ratingsQuantity,
      ratingsAverage: parseFloat(ratingsAverage.toFixed(1)) 
    });

    return {
      status : 201,
      message : "Review created successfully",
      data : newReview
    }
  }

  async findAll(productId : string) {
    const existedProduct = await this.productService.findOne(productId)
    if(!existedProduct){
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }

    const reviews = await this.reviewModel.find({productId}).populate('userId' , ' -_id name' ).select(' -_id rating reviewText')
    return {
      status : 200,
      data : reviews
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto , req) {
    const existedReview = await this.reviewModel.findById(id)
    if(!existedReview){
      throw new HttpException("Review not found", HttpStatus.NOT_FOUND);
    }

    if(existedReview.userId.toString() !== req.user._id.toString()){
      throw new HttpException("You can only update your own reviews", HttpStatus.FORBIDDEN);
    }
    const existedProduct = await this.productService.findOne(existedReview.productId)

    if(!existedProduct){
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(id , updateReviewDto , {new : true})

    const productId = existedReview.productId;
  
    const reviews = await this.reviewModel.find({productId});
    const ratingsQuantity = reviews.length;
    const ratingsSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const ratingsAverage = ratingsSum / ratingsQuantity;

    await this.productModel.findByIdAndUpdate(productId, {
      ratingsQuantity,
      ratingsAverage: parseFloat(ratingsAverage.toFixed(1))
    });

    return {
      status : 200,
      data : updatedReview
    }
  }


  async remove(id: string , req) {
    const existedReview = await this.reviewModel.findById(id)
    if(!existedReview){
      throw new HttpException("Review not found", HttpStatus.NOT_FOUND);
    }

    if(existedReview.userId.toString() !== req.user._id.toString()){
      throw new HttpException("You can only delete your own reviews", HttpStatus.UNAUTHORIZED);
    }
    const existedProduct = await this.productService.findOne(existedReview.productId)

    if(!existedProduct){
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }

    await this.reviewModel.findByIdAndDelete(id)

    const productId = existedReview.productId;
  
    const reviews = await this.reviewModel.find({productId});
    const ratingsQuantity = reviews.length;
    const ratingsSum = reviews.reduce((sum, review) => sum + review.rating, 0);
    const ratingsAverage = ratingsSum / ratingsQuantity;

    await this.productModel.findByIdAndUpdate(productId, {
      ratingsQuantity,
      ratingsAverage: parseFloat(ratingsAverage.toFixed(1))
    });

    return {
      status : 200,
      message : ok
    }
  }
}
