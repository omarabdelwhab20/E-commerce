import { IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    shippingAddress : {
        alias : string,
        details : string,
        city : string,
        phone : string,
        postalCode : string,
    }
}
