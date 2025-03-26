import { IsEmail, isEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class SignInDto{
    @IsNotEmpty({message : "Email is required"})
    @IsEmail({} , {message : "Not valid email"})
    email : string
    
    @IsNotEmpty({message : "Password must be string"})
    @MinLength(6 , {message : "Password must be at least 6 characters"})
    @MaxLength(15 , {message : "Password must be at most 15 characters"})
    password : string
}