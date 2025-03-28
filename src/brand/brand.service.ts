import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Model } from 'mongoose';
import { Brand } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel : Model<Brand>
  ){}
  async create(createBrandDto: CreateBrandDto) {
    const isExisted = await this.brandModel.findOne({name : createBrandDto.name})

    if(isExisted) {
      throw new HttpException("Brand already exists" , HttpStatus.BAD_REQUEST)
    }

    const brand = await this.brandModel.create(createBrandDto)

    return {
      status : 200,
      message : "Brand created successfully",
      data : brand
    }
  }

  async findAll() {
    const brands = await this.brandModel.find().select('-_id name')
    
    return{
      status : 200,
      data : brands
    }
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).select('-_id name')
    if(!brand) {
      throw new HttpException("Brand not found" , HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      data : brand
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById(id).select('name')
    if(!brand) {
      throw new HttpException("Brand not found" , HttpStatus.NOT_FOUND)
    }
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id , updateBrandDto , {new : true})

    return {
      status : 200,
      message : "Brand updated successfully",
      data : updatedBrand
    }
  }

  async remove(id: string) {
    const brand = await this.brandModel.findById(id).select('name')
    if(!brand) {
      throw new HttpException("Brand not found" , HttpStatus.NOT_FOUND)
    }

    await this.brandModel.findByIdAndDelete(id)

    return {
      status : 200 ,
      message : "Brand deleted successfully"
    }
  }
}
