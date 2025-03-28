import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateSupplierDto {

    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Name must be a string"})
    @MinLength(2 , {message : "Name must be at least 2 characters long"})
    @MaxLength(15 , {message : "Name must be at most 15 characters long"})
    name : string


    @IsNotEmpty({message : "Website is required"})
    @IsUrl({} ,{message : "Website must be a valid URL"})
    website : string


    @IsOptional()
    @IsEmail({},{message : "Contact email must be valid email"})
    contactEmail?: string



    @IsOptional()
    @IsPhoneNumber('EG' , {message : "Phone number must be a valid egyptian phone number"})
    phone : string
}
