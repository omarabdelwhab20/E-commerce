import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Model } from 'mongoose';
import { SubCategory } from './sub-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {

  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel : Model<SubCategory>,
    @InjectModel(Category.name)
    private categoryModel : Model<Category>
  ){}


  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const categoryName = createSubCategoryDto.categoryName.trim();
    const subCategoryName = createSubCategoryDto.name.trim();


    const category = await this.categoryModel.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (!category) {
      throw new HttpException(
        `Category '${categoryName}' not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const existingSubCategories = await this.subCategoryModel.findOne({
      name: { $regex: new RegExp(`^${subCategoryName}$`, 'i') },
      category: category._id
    });

    if(existingSubCategories){
      throw new HttpException('Sub Category already exists', HttpStatus.BAD_REQUEST)
    }


    const subCategory = await this.subCategoryModel.create({
      name: subCategoryName,
      category: category._id,  // Reference
      categoryName: category.name  // Embedded name
  });


    return {
      status : 201,
      data : subCategory
    }
  }

  async findAll(name? : string) {
    if (!name) {
      const allSubCategories = await this.subCategoryModel.find();
      return {
          status: 200,
          data: allSubCategories
      };
    }
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const subCategories = await this.subCategoryModel.find({
      name: { $regex: new RegExp(escapedName, 'i') }
    });

  return {
      status: 200,
      data: subCategories
  };
}

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findById(id).select('-_id -__v')
    if(!subCategory) {
      throw new HttpException("Sub category not found", HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      data : subCategory
    }
  }



  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findById(id)
    if(!subCategory) {
      throw new HttpException("Sub category not found", HttpStatus.NOT_FOUND)
    }

    const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(id , updateSubCategoryDto , {new : true})

    return {
      status : 200,
      data : updatedSubCategory
    }
  }

  async remove(id: string) {
    const subCategory = await this.subCategoryModel.findById(id)
    if(!subCategory) {
      throw new HttpException("Sub Category not found", HttpStatus.NOT_FOUND)
    }

    await this.subCategoryModel.findByIdAndDelete(id)
    return {
      status : 200,
      message : "Deleted successfully"
    }
  }





  
}
