import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @Post()
  @Roles(["user"])
  @UseGuards(AuthGuard)
  create(@Body() createReviewDto: CreateReviewDto , @Req() req) {
    return this.reviewService.create(createReviewDto , req);
  }

  @Get(":id")
  findAllReviewsForProduct(@Param('id') productId: string) {
    return this.reviewService.findAll(productId);
  }


  @Patch(':id')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto , @Req() req) {
    return this.reviewService.update(id, updateReviewDto , req);
  }

  @Delete(':id')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string , @Req() req) {
    return this.reviewService.remove(id , req);
  }
}
