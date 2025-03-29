import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestProduct, RequestProductSchema } from './request-product.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name : RequestProduct.name , schema : RequestProductSchema}
  ])],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
