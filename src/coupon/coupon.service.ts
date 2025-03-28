import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<Coupon>    
  ){}


  async create(createCouponDto: CreateCouponDto) {
    const {name ,expireDate , discount} = createCouponDto
    const existedCoupon = await this.couponModel.findOne({
      name : {$regex : new RegExp(`^${name}$`, 'i')}
    })

    if(existedCoupon){
      throw new HttpException('Coupon already exists' , HttpStatus.BAD_REQUEST)
    }

    if(expireDate <= new Date()){
      throw new HttpException('coupon expire date should be in the future' , HttpStatus.BAD_REQUEST)
    }

    if(discount <=0 || discount >= 100 ){
      throw new HttpException('discount should be between 1 and 99' , HttpStatus.BAD_REQUEST)
    }

    const newCoupon = await this.couponModel.create({
      name ,
      expireDate ,
      discount,

    })
    return {
      status : 201,
      data : newCoupon
    }
  }

  async findAll() {
    const coupons = await this.couponModel.find().select('name expireDate discount')
    return {
      status : 200,
      data : coupons
    }
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id)
    if(!coupon){
      throw new HttpException('Coupon not found' , HttpStatus.NOT_FOUND)
    }
    return {
      status : 200 ,
      data : coupon
    }
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const {name ,expireDate , discount} = updateCouponDto
    const existedCoupon = await this.couponModel.findOne({
      name : {$regex : new RegExp(`^${name}$`, 'i')}
    })

    if(!existedCoupon){
      throw new HttpException('Coupon not found' , HttpStatus.NOT_FOUND)
    }

    if(expireDate === new Date() || expireDate < new Date()){
      throw new HttpException('coupon expire date should be in the future' , HttpStatus.BAD_REQUEST)
    }

    if(discount <=0 || discount >= 100 ){
      throw new HttpException('discount should be between 1 and 99' , HttpStatus.BAD_REQUEST)
    }

    const updatedCoupon = await this.couponModel.findByIdAndUpdate(id , updateCouponDto , {new : true})
    return {
      status : 200 ,
      data : updatedCoupon
    }

  }

  async remove(id: string) {
    const existedCoupon = await this.couponModel.findByIdAndDelete(id)
    if(!existedCoupon){
      throw new HttpException('Coupon not found' , HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      message : "Coupon deleted successfully"
    }
  }
}
