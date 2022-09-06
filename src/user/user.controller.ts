import { ClassSerializerInterceptor, Controller, Req, UseGuards, UseInterceptors, Put, Body, Inject, Get, Post, UploadedFile} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './auth/auth.guard';
import { UserProfileDto } from './user_profile.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ChangeUserPasswordDto } from './change_user_password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// Helper function to generate uploaded avatar file name with extension.
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = '.'+file.originalname.split('.')[1];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

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

  // Upload avatar image and and update user profile
  // Uploaded file is saved in the uploads folder
  // Upload file size limit is around 3MB.
  // Once file is uploaded, user update profile is called to update the avatar field in the user table.
  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image',{
    storage: diskStorage({
      destination: './public/uploads',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
    limits:{
      fileSize: 3145728,
    }
  }))
  private uploadFile(@UploadedFile() image,@Req() req: Request): Promise<User> {
    const user: User = <User>req.user;

    const response = {
    	originalname: image.originalname,
    	filename: image.filename,
    };

    return this.service.updateAvatar(response,user);

  }

}