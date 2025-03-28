import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Name must be string"})
    name : string


    @IsOptional()
    @IsUrl({} , {message : "Must be valid url"})
    image : string
}
