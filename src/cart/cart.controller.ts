import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(":productId")
  @Roles(["user"])
  @UseGuards(AuthGuard)
  create(@Param("productId") productId : string , @Req() req) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }

    const userId = req.user._id
    return this.cartService.addToCart(productId , userId);
  }

  @Get()
  @Roles(["user"])
  @UseGuards(AuthGuard)
  findOne(@Req() req ) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }

    const userId = req.user._id

    return this.cartService.findOne(userId);
  }



  @Post("/coupon/:couponName")
  @Roles(["user"])
  @UseGuards(AuthGuard)
  applyCoupon(@Param("couponName") couponName : string , @Req() req ) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }

    const userId = req.user._id

    return this.cartService.applyCoupon(userId , couponName);
  }

  /*@Patch(':productId')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  update(@Param('productId') id: string, @Body() updateCartDto: UpdateCartDto , @Req() req) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }
    const userId = req.user._id

    return this.cartService.update(id, updateCartDto , userId);
  }*/

  @Delete(':productId')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  remove(@Param('productId') productId: string  , @Req() req) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }

    const userId = req.user._id
    return this.cartService.removeFromCart(productId , userId);
  }
}
