import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';



@Controller('auth')
export class AuthController {
  constructor(

    private readonly authService: AuthService
  ) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }


  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.singIn(signInDto);
  }


  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-code')
  verifyCode(@Body() resetPasswordDto : ResetPasswordDto ){
    return this.authService.verifyCode( resetPasswordDto );
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: SignInDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  



  
}