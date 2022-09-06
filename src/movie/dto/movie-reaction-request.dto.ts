import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

// The MovieReactionRequestDto is used to validate the request body for like, dislike etc. endpoint. 
// The request body is mapped to this class and validated using the class-validator decorators internally by NestJs.
export class MovieReactionRequestDto {
    @ApiProperty()
    @IsOptional() 
    userId?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    movieId: string;
  }
