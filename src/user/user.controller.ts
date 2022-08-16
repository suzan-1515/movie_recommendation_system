import { ClassSerializerInterceptor, Controller, Req, UseGuards, UseInterceptors, Put, Body, Inject, Get } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './auth/auth.guard';
import { UserProfileDto } from './user_profile.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ChangeUserPasswordDto } from './change_user_password.dto';

@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private getProfile(@Req() req: Request): Promise<User> {
    const user: User = <User>req.user;
    return this.service.getProfile(user);
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateProfile(@Body() body: UserProfileDto, @Req() req: Request): Promise<User> {
    const user: User = <User>req.user;
    return this.service.updateProfile(body, user);
  }

  @Put('/password')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private changePassword(@Body() body: ChangeUserPasswordDto, @Req() req: Request): Promise<User> {
    const user: User = <User>req.user;
    return this.service.changePassword(body, user);
  }

}