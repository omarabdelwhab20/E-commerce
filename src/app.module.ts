import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserMeController } from './user-me/user-me.controller';
import { UserMeService } from './user-me/user-me.service';
import { UserMeModule } from './user-me/user-me.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SupplierModule } from './supplier/supplier.module';
import { RequestProductModule } from './request-product/request-product.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';





@Module({
  imports: [
  ConfigModule.forRoot() , 
  MongooseModule.forRoot('mongodb://localhost:27017/e-commerce'), 
  UserModule,
  MailerModule.forRoot({
    transport : {
      service : 'gmail',
      auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD,
      }
    }
  }),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
  UserMeModule,
  AuthModule,
  CategoryModule,
  SubCategoryModule,
  BrandModule,
  CouponModule,
  SupplierModule,
  RequestProductModule,
  ProductModule,
  ReviewModule,
],
  controllers: [UserMeController],
  providers: [UserMeService],
})
export class AppModule {}
