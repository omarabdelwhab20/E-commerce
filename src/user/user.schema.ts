import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps : true})
export class User {
  @Prop({
    required : true,
    type : String,
    min : [3 , "Name must be at least 3 characters"],
    max : [30 , "Name must be at most 30 characters"],
    
  })
  name: string;

  @Prop({
    required : true,
    type : String,
    unique : true,
  })
  email: string;

  @Prop({
    required : true,
    type : String,
    min : [6 , "Password must be at least 6 characters"],
    max : [30 , "Password must be at most 30 characters"],
    
  })
  password: string;


  @Prop({
    type : String,
    required : true,
    default : 'user',
    enum : ['user' , 'admin']
  })
  role : string



  @Prop({
    type : String
  })
  avatar : string


  @Prop({
    type : Number,
  })
  age : number

  @Prop({
    type : String,
    unique : [true , "This phone number is already in use"]
  })
  phoneNumber : string


  @Prop({
    type : String ,
  })
  address : string


  @IsOptional()
  @Prop({
    type : Boolean ,
    enum : ["true" , "false"]
  })
  active : boolean


  @Prop({
    type : String ,
  })
  verificationCode : string


  @Prop({
    type : String ,
    enum : ["male" , "female"]
  })
  gender : string

  





}

export const UserSchema = SchemaFactory.createForClass(User);
