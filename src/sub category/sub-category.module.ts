import { Module } from '@nestjs/common';
import { SubCategoryService } from './sup-category.service';
import {  SubCategoryController } from './sub-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, subCategorySchema } from './sub-category.schema';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: SubCategory.name , schema: subCategorySchema }
  ]) , CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
