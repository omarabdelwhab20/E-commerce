import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MAX, MaxLength, maxLength, Min, MinLength } from 'class-validator';
export class CreateReviewDto {@IsOptional()
    @IsString({message : "Review text must be string"})
    @MinLength(10 , {message : "Review message must be at least 10 characters long"})
    @MaxLength(200 , {message : "Review message must be at most 200 characters long"})
    reviewText : string

    @IsNotEmpty({message : "Rating is required"})
    @IsNumber({},{message : "Rating must be a number"})
    @Min(1 , {message : "Rating must be from 1 and 5"})
    @Max(5 , {message : "Rating must be from 1 and 5"})
    rating : number

    @IsMongoId({message : "Product id must be a valid mongo id"})
    productId : string
}
