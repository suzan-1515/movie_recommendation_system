import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

// The RemoveGroupMemberDto is used to validate the request body for the remove group member endpoint. 
// The request body is mapped to this class and validated using the class-validator decorators internally by NestJs.
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