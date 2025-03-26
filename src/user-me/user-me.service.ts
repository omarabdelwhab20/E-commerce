import {  HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserMeService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel : Model<User>,

    ){}

    async getMe(payload){
        const user = await this.userModel.findById(payload._id).select('-password -__v -_id -role -active -createdAt -updatedAt')

        if(!user){
            throw new NotFoundException("User not found")
        }

        return {
            status : 200,
            message : "User found",
            data : user
        }
    }


    async updateMe(payload , updateUserDto : UpdateUserDto){
        if(!payload._id){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }
        const user = await this.userModel.findById(payload._id).select('-password -__v -_id')
        if(!user){
            throw new NotFoundException("User not found")
        }



        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }


        const updatedUser = await this.userModel.findByIdAndUpdate(payload._id , updateUserDto , {new : true})

        return {
            status : 200,
            message : "User updated",
            data : updatedUser
        }
    }



    async deleteMe(payload){
        if(!payload._id){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }
        const user = await this.userModel.findById(payload._id).select('-password -__v')
        if(!user){
            throw new NotFoundException("User not found")
        }
        await this.userModel.findByIdAndUpdate(payload._id , {
            active : false,
        })

        return {
            status : 200,
            message : "User deleted",
        }

    }

 

}
