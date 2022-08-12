import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class RemoveGroupMemberDto {

    @ApiProperty()
    @IsNotEmpty()
    groupId: number;

    @ApiProperty()
    @IsOptional()
    ownerId?: number;

    @ApiProperty()
    @IsNotEmpty()
    membersId?: number[];

}