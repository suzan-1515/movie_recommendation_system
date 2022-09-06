import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

// The AddGroupMemberDto is used to validate the request body for the add group member endpoint. 
// The request body is mapped to this class and validated using the class-validator decorators internally by NestJs.
export class AddGroupMemberDto {

    @ApiProperty()
    @IsNotEmpty()
    groupId: number;

    @ApiProperty()
    @IsOptional()
    ownerId?: number;

    @ApiProperty()
    @IsNotEmpty()
    membersId?: string[];

}