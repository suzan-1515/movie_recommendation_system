import { IsOptional, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  public readonly firstName?: string;

  @IsString()
  @IsOptional()
  public readonly lastName?: string;

  @IsString()
  @IsOptional()
  public readonly profilePic?: string;
}