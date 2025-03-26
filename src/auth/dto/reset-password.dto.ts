import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty({message : "Email is required"})
    @IsEmail({} , {message : "Not valid email"})
    email : string

    @IsNotEmpty({message : "Code is required"})
    code : string
}