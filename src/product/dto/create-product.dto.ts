import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Name must be a string"})
    @MinLength(5 , {message : "Name must be at least 5 characters long"})
    @MaxLength(100 , {message : "Name must be at most 50 characters long"})
    name : string


    @IsNotEmpty({message : "Description is required"})
    @IsString({message : "Description must be a string"})
    @MinLength(  0 ,{message : "Description must be at least 5 characters long"})
    @MaxLength(250 , {message : "Description must be at most 50 characters long"})
    description : string


    @IsNotEmpty({message : "Quantity is required"})
    @IsNumber({},{message : "Quantity must be a number"})
    @Min(10 , {message : "Quantity must be at least 10"})
    @Max(1000 , {message : "Quantity must be at most 1000"})
    quantity : number


    @IsNotEmpty({message : "Image cover is required"})
    @IsUrl({},{message : "Image cover must be a valid url"})
    imageCover : string

    @IsOptional()
    @IsArray()
    iamges : string[]


    @IsOptional()
    @IsNumber({},{message : "sold must be a number"})

    sold : number


    @IsNotEmpty({message : "Price is required"})
    @IsNumber({},{message : "Price must be a number"})
    @Min(10 , {message : "Price must be at least 10"})
    @Max(100000 , {message : "Price must be at most 10000"})
    price : number


    @IsOptional()
    @IsNumber({},{message : "Discount must be a number"})
    @Min(0 , {message : "Discount must be at least 10"})
    @Max(99 , {message : "Discount must be at most 99 "})
    discountPercentage : number


    @IsNotEmpty({message : "Category name is required"})
    categoryName : string

    

    @IsNotEmpty({message : "Sub Category name is required"})
    subCategoryName : string


    @IsNotEmpty({message : "Brand name is required"})
    brandName : string


    
}
