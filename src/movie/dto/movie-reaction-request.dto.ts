import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class MovieReactionRequestDto {
    @ApiProperty()
    @IsOptional()
    userId: string;
    @ApiProperty()
    movieId: string;
  }
