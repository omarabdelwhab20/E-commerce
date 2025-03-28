import { IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty({message : "Name is required"})
    @IsString({message : "Name must be string"})
    name : string   


    @IsNotEmpty({message : "Expire date is required"})
    @IsDateString({} , {message : "Date must be  valid date string"})
    expireDate : Date

    @IsNotEmpty({message : "Discount is required"})
    @IsNumber({} , {message : "Discount must be a number"})
    @Min(1, { message: "Discount must be at least 1%" })
    @Max(100, { message: "Discount cannot exceed 100%" })
    discount : number
}
