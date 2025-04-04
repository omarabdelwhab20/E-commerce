import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub category/sub-category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema }
  ]) , CategoryModule , SubCategoryModule , BrandModule ],
  controllers: [ProductController],
  providers: [ProductService],
  exports : [ProductService , MongooseModule]
})
export class ProductModule {}
