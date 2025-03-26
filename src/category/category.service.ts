import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name)
    private categoryModel : Model<Category>
  ){}


  async create(createCategoryDto: CreateCategoryDto) {
    const existedCategory = await this.categoryModel.findOne({name : createCategoryDto.name})
    if(existedCategory) {
      throw new HttpException("Category already exists", HttpStatus.BAD_REQUEST)
    }

    const category = await this.categoryModel.create(createCategoryDto)

    return {
      status : 201,
      data : category
    }
  }

  async findAll(name? : string) {
    if (!name) {
      const allCategories = await this.categoryModel.find();
      return {
          status: 200,
          data: allCategories
      };
    }
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const categories = await this.categoryModel.find({
      name: { $regex: new RegExp(escapedName, 'i') }
    });

  return {
      status: 200,
      data: categories
  };
}

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id)
    if(!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      data : category
    }
  }



  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findById(id)
    if(!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id , updateCategoryDto , {new : true})

    return {
      status : 200,
      data : updatedCategory
    }
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id)
    if(!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }

    await this.categoryModel.findByIdAndDelete(id)
    return {
      status : 200,
      message : "Deleted successfully"
    }
  }





  
}
