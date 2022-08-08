import { ApiProperty } from "@nestjs/swagger";

export class MovieReactionRequestDto {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    movieId: string;
  }
