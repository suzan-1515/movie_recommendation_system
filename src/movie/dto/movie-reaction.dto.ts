import { ApiProperty } from "@nestjs/swagger";

export class MovieReactionDto {
    @ApiProperty()
    movieId: string;
}