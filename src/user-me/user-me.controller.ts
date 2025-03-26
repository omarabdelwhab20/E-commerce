import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserMeService } from './user-me.service';
import { Roles } from 'src/user/decorator/role.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('user/me')
export class UserMeController {
    constructor(private readonly userMeService: UserMeService) {}




    @Get()
    @Roles(['user' , 'admin'])
    @UseGuards(AuthGuard)
    getUserMe(@Req() req){
        return this.userMeService.getMe(req.user)
    };


    @Patch()
    @Roles(["user" , 'admin'])
    @UseGuards(AuthGuard)
    updateMe(@Req() req , @Body() updateUserDto : UpdateUserDto){
        return this.userMeService.updateMe(req.user , updateUserDto)
    }


    @Delete()
    @Roles(["user"])
    @UseGuards(AuthGuard)
    deleteMe(@Req() req  ){
        return this.userMeService.deleteMe(req.user)
    }
    

}
