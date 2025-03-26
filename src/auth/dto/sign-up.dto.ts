import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length , MaxLength, Min, MinLength } from "class-validator"

export class SignUpDto {
    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Name must be string"})
    @MinLength(3 , {message : "Name must be at least 3 characters"})
    @MaxLength(30 , {message : "Name must be at most 30 characters"})
    name : string

    @IsNotEmpty({message : "Email is required"})
    @IsEmail({} , {message : "Not valid email"})
    email : string

    @IsNotEmpty({message : "Password must be string"})
    @MinLength(6 , {message : "Password must be at least 6 characters"})
    @MaxLength(15 , {message : "Password must be at most 15 characters"})
    password :string

    @IsUrl({} ,{message : "Avatar must be a valid url"})
    @IsOptional()
    avatar? : string


    @IsNotEmpty({message : "Age is required "})
    @IsNumber({} , {message : "Age must be a number"})
    @Min(18 , {message : "Age must be at least 18"})
    age : number


    @IsNotEmpty({message : "Phone number is required"})
    @IsPhoneNumber('EG' , {message : "Not valid phone number"})
    phoneNumber : number

    @IsOptional()
    @IsString({message : "Address must be string"})
    address : string

    @IsOptional()
    @IsString({message : "Verification code must be string"})
    @Length(6,6, {message : "Verification code must be of 6 characters"})
    verificationCode : string


    @IsNotEmpty({message : "Gender is required"})
    @IsEnum(["male" , "female"] , {message : "Gender must be male or female"})
    gender : string
}
