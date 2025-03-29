import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct } from './request-product.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestProductService {

  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestProductModel: Model<RequestProduct>
  ){}

  async create(createRequestProductDto: CreateRequestProductDto, req) {
    const userId = req.user._id;
    if (req.user.role === 'admin') {
      throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
    }
  

    const requestCount = await this.requestProductModel.countDocuments({ 
      user: userId 
    });
  
    if ( requestCount >= 5) {
      throw new HttpException("Maximum number of requesting exceeded", HttpStatus.BAD_REQUEST);
    }
  
    const requestProduct = await this.requestProductModel.create({
      ...createRequestProductDto,
      user: userId,
    })

  
    return {
      status: 201,
      data: requestProduct
    };
  }

  async findAll() {
    const requestProducts = await this.requestProductModel.find().select('-_id title details quantity').populate('user' , ' -_id name email')
    return requestProducts
  }


  async findForUsers(req) {
    const userId = req.user._id;
    if (req.user.role === 'admin') {
      console.log("here")
      throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
      
    }

    const requestProduct = await this.requestProductModel.find({user : userId}).select('-_id title details quantity').populate('user' , ' -_id name email')
      return {
        status: 200,
        data: requestProduct
      }
  }



  async update(req , id : string , updateRequestProductDto: UpdateRequestProductDto) {
    if (req.user._id === 'admin') {
      throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
      
    }
    const requestProduct = await this.requestProductModel.findByIdAndUpdate(id  , updateRequestProductDto , {new : true} )

    return {
      staus : 201,
      data : requestProduct
    }


  }

  async remove( id: string , req) {
    if (req.user._id === 'admin') {
      throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
      
    }

    await this.requestProductModel.findByIdAndDelete(id)
    return {
      status : 200 ,
      message : "Request product deleted successfully"
    }
  }
}
