import { IsNotEmpty, isNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message : "Name is required"})
    name : string

    @IsOptional()
    @IsString({message : "Image must be string"})
    @IsUrl({} , {message : "Url must be valid"})
    image : string
}
