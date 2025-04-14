import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards, Query, RawBodyRequest, Headers, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("/checkout")
  @Roles(["user"])
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto , @Req() req , @Query() query) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }
    const userId = req.user._id

    const {success_url = "https://ecommerce.com" , cancel_url = "https://ecommerce.com"} = query

    const dataAfterPayment = {
      success_url,
      cancel_url,
    }

    return this.orderService.createSession(createOrderDto , userId , dataAfterPayment);
  }


  @Post('/checkout/webhook')
  sessionWebhooks(
    @Headers('stripe-signature') sig,
    @Req() request:RawBodyRequest<Request>
  ){
    const endpointSecret = "whsec_9e20c902485791e87b6f3e2662f54dcf92f0069e6a48659a6085070f5ecee1f3";
    const payload = request.rawBody
    return this.orderService.handleWebhookRequest(payload ,sig ,  endpointSecret)
  }

  @Get()
  @Roles(["user"])
  @UseGuards(AuthGuard)
  findAllForUser(@Request() req ) {
    if(req.user.role.toLowerCase() === "admin"){
      throw new UnauthorizedException()
    }
    const userId = req.user._id
    return this.orderService.findAllForUser(userId);
  }


  @Get('/admin')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  findAllForAdmin() {
    return this.orderService.findAllForAdmin();
  }


  @Get('/admin/:userId')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  findOneForAdmin(@Param('userId') userId: string) {
    return this.orderService.findOneForAdmin(userId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
