import {  HttpException, HttpStatus, Injectable  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel :Model<User>
  ){}


  async create(createUserDto: CreateUserDto ) {
    const {email , password} = createUserDto

    const existedUser = await this.userModel.findOne({email})

    if(existedUser){
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await this.userModel.create({
      ...createUserDto, 
      password : hashedPassword,
      rol : createUserDto.role ?? "user",
      active : true
    });

    return {created : true};
  }

  async findAll(query) {
    const {page = 1 ,limit = 2} = query
    const skip = (page - 1) * limit;

    if(Number.isNaN(Number(+page))){
      throw new HttpException('Invalid page', HttpStatus.BAD_REQUEST);
    }

    if(Number.isNaN(Number(+limit))){
      throw new HttpException('Invalid limit', HttpStatus.BAD_REQUEST);
    }

    const total = await this.userModel.countDocuments()

    const users = await this.userModel.find({} , {name : 1 , email : 1 , role : 1 , avatar : 1 , active : 1 , gender : 1 ,  _id : 0})
    .limit(limit)
    .skip(skip)



    const totalPages = Math.ceil(total / limit)

    return {
      users , 
      pagination : {
        page : parseInt(page),
        limit : parseInt(limit),
        total ,
        totalPages,
        hasNextPage : page < totalPages
      }
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById({_id : id}).select('-password -__v -_id')
    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.exitstedUser(id)

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userModel.findByIdAndUpdate(id , updateUserDto , {new : true} )

    return {
      status : 200,
      message : "User updated successfully",
    }
  }

  async remove(id: string) {
    this.exitstedUser(id)
    await this.userModel.findByIdAndDelete(id)
    return {
      status : HttpStatus.OK,
      message : "User deleted successfully"
    }
  }


  async exitstedUser(id : string){
    const exitsedUser = await this.userModel.findById(id)
    if(!exitsedUser){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
