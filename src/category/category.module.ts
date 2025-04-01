import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from './category.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Category.name , schema: categorySchema }
  ])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports : [MongooseModule ]
})
export class CategoryModule {}
