import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UserProfileDto } from './user_profile.dto';
import { User } from './user.entity';
import { AuthHelper } from './auth/auth.helper';
import { ChangeUserPasswordDto } from './change_user_password.dto';

@Injectable()
export class UserService {
  
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async getProfile(user:User): Promise<User> {
    return this.repository.findOneBy({id:user.id});
  }

  public async updateProfile(body: UserProfileDto, user:User): Promise<User> {
    user.firstName = body.firstName || user.firstName;
    user.lastName = body.lastName || user.lastName;
    user.profilePic = body.profilePic || user.profilePic;

    return this.repository.save(user);
  }

  public async changePassword(passwordDto: ChangeUserPasswordDto, user:User): Promise<User> {
    user.password = this.helper.encodePassword(passwordDto.password);
    
    return this.repository.save(user);
  }

  // Since static files are uploaded to public directory, append path to the file name. and update user profile.
  public async updateAvatar(response: { originalname: string; filename: string },user:User): Promise<User>  {
    user.profilePic = '/public/uploads/' + response.filename;
    return this.repository.save(user);
  }

}