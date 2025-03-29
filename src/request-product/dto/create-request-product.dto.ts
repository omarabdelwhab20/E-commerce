import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateRequestProductDto {

    @IsNotEmpty({message : "Title is required"})
    @IsString({message : "Title must be string"})
    @MinLength(2 , {message : "Title must be at least 2 characters "})
    @MaxLength(20 , {message : "Title must be at most 15 characters "})
    title : string

    @IsNotEmpty({message : "Details is required"})
    @IsString({message : "Details must be string"})
    @MinLength(5 , {message : "Details must be at least 2 characters "})
    @MaxLength(100 , {message : "Details must be at most 15 characters "})
    details : string


    @IsNotEmpty({message : "Quantity is required"})
    @IsNumber({},{message : "Quantity must be number"})
    @Max(20 , {message : "Quantity must be at most 10 "})
    @Min(5 , {message : "Quantity must be at least 5 "})
    quantity : number





}
