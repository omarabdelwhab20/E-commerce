import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './supplier.schema';
import { Model } from 'mongoose';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private readonly supplierModel: Model<Supplier>
  ){}


  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierModel.findOne({
      name: createSupplierDto.name
    })
    if (supplier) {
      throw new HttpException("This supplier already exists" , HttpStatus.BAD_REQUEST)
    }

    const newSupplier = await this.supplierModel.create(createSupplierDto)

    return {
      status : 201,
      data : newSupplier
    }
  }

  async findAll() {
    const suppliers = await this.supplierModel.find().select('-_id name website')
    return {
      status : 200,
      data : suppliers
    }
  }



  async findOne(id: string) {
    const supplier = await this.supplierModel.findById(id).select('-_id name website')

    if(!supplier){
      throw new HttpException("Supplier not found" , HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      data : supplier
    }
  }



  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierModel.findByIdAndUpdate(id , updateSupplierDto , {new : true})

    if(!supplier){
      throw new HttpException("Supplier not found" , HttpStatus.NOT_FOUND)
    }

    return {
      status : 200,
      data : supplier
    }

  }

  async remove(id: string) {
    const supplier = await this.supplierModel.findByIdAndDelete(id)

    return{
      status : 200,
      message : "Supplier deleted successfully"
    }
  }
}
