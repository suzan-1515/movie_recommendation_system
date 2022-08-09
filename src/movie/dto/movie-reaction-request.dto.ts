import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class MovieReactionRequestDto {
    @ApiProperty()
    @IsOptional() 
    userId?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    movieId: string;
  }
