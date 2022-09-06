import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

// The CreateGroupDto is used to validate the request body for the create group member endpoint. 
// The request body is mapped to this class and validated using the class-validator decorators internally by NestJs.
export class CreateGroupDto {

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    ownerId?: number;

    @ApiProperty()
    @IsOptional()
    membersId?: number[];

}