import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class AuthService {

  constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<User> , 
      private jwtService: JwtService,
      private mailService : MailerService

    ) {}



  async signUp(signUpDto: SignUpDto) {
    const {email , phoneNumber} = signUpDto

    const existedUser = await this.userModel.findOne({email})

    if(existedUser){
      throw new HttpException('This email is already in use' , HttpStatus.BAD_REQUEST)
    }

    const existedPhoneNumber = await this.userModel.findOne({phoneNumber})

    if(existedPhoneNumber){
      throw new HttpException('This phone number is already in use' , HttpStatus.BAD_REQUEST)
    }


    signUpDto.password = await bcrypt.hash(signUpDto.password , 10)

    const user = await this.userModel.create({
      ...signUpDto ,
      role : 'user',
      active : true
    })

    return {
      status : 201,
      message : 'User created successfully',
      data : user
    }


  }



  async singIn(signInDto : SignInDto){
    const {email , password} = signInDto
    const user = await this.userModel.findOne({email})

    if(!user){
      throw new HttpException('Invalid email or password' , HttpStatus.BAD_REQUEST)
    }

    const matchedPassword = await bcrypt.compare(password , user.password)

    if(!matchedPassword){
      throw new HttpException('Invalid email or password' , HttpStatus.BAD_REQUEST)
    }

    const token = await this.jwtService.sign({_id : user._id , email : user.email , role : user.role})

    return {
      status : 200,
      message : 'User logged in successfully',
      token 
    }
  }


  async resetPassword(resetPasswordDto : ResetPasswordDto){
    const {email} = resetPasswordDto
    const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6 , '0')

    await this.userModel.findOneAndUpdate(
      {email} ,
      {verificationCode : code},
      {upsert : false}
    )
    const htmlMessage = `
    <div>
      <h1>Forgot your password? if you didnt forget your password then dont click on this link</h1>
      <p>Use the following code to verify your account : <h3  font-weight : bold ; text-align: center ">${code} </h3></p>
      <h6 style ="font-weight : bold">Ecommerce-NestJs </h6>
    </div>
    `;


    try {
      await this.mailService.sendMail({
        from: `Ecommerce-NestJs <${process.env.USER_EMAIL}>`,
        to: email,
        subject: `Ecommerce-NestJs - Reset password`,
        html: htmlMessage,
      });
  
      return { 
        status: 200,
        message: "If this email is registered, a reset code has been sent successfully" 
      };
    } catch (error) {
      // Still return success message even if email sending fails
      // (This maintains the behavior of not revealing whether email exists)
      return { 
        status: 200,
        message: "If this email is registered, a reset code has been sent successfully" 
      };
    }
  }


  async verifyCode(resetPasswordDto: ResetPasswordDto) {

    if (!resetPasswordDto || !resetPasswordDto.email) {
        throw new HttpException("Email is required", HttpStatus.BAD_REQUEST);
    }

    const { email } = resetPasswordDto;
    
    const user = await this.userModel.findOne({ email }).select('verificationCode');
    
    if (!user) {
        throw new HttpException("No account found with this email", HttpStatus.BAD_REQUEST);
    }
    
    if (user.verificationCode !== resetPasswordDto.code) {
        throw new HttpException("Invalid code", HttpStatus.BAD_REQUEST);
    }

    await this.userModel.findOneAndUpdate(
        { email },
        { verificationCode: null }
    );

    return {
        status: 200,
        message: "Code verified successfully"
    };
}


  async changePassword(changePasswordDto : SignInDto){
    const user = await this.userModel.findOne({email : changePasswordDto.email})
    if(!user){
      throw new HttpException("User not found" , HttpStatus.NOT_FOUND)
    }
    const password = await bcrypt.hash(changePasswordDto.password , 10)

    const newPassword = await this.userModel.findOneAndUpdate({email : changePasswordDto.email} , {password})

    return {
      status : 200,
      message : "Password changed successfully"
    }
  }









}
