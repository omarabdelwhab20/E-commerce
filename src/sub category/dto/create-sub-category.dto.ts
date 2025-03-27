import { IsNotEmpty, isNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateSubCategoryDto {
    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Category must be string"})
    name : string

    @IsNotEmpty({message : "Category is required"})
    @IsString({message : "Category must be string"})
    categoryName : string
}
