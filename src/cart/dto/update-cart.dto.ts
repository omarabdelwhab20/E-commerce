import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsOptional()
    @IsNumber({},{message : "Quantity must be a number"})
    @Min(1 , {message : "Quantity must be greater than 0"})
    quantity : number
}
