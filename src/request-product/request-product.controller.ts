import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Roles(["user"])
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRequestProductDto: CreateRequestProductDto , @Req() req) {
    return this.requestProductService.create(createRequestProductDto , req);
  }

  @Roles(["admin"])
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.requestProductService.findAll();
  }

  @Roles(["user"])
  @UseGuards(AuthGuard)
  @Get('user')
  findForUsers( id: string , @Req() req) {
    return this.requestProductService.findForUsers(req);
  }

  @Roles(["user"])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Req() req , @Param('id') id: string, @Body() updateRequestProductDto: UpdateRequestProductDto) {
    return this.requestProductService.update( req, id, updateRequestProductDto);
  }

  @Roles(["user"])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req ,@Param('id') id: string) {
    return this.requestProductService.remove(id , req);
  }
}
