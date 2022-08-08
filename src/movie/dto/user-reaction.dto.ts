import { ApiProperty } from "@nestjs/swagger";

export class UserReactionDto {
    @ApiProperty()
    userId: string;
}