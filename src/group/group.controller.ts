import { JwtAuthGuard } from '@/user/auth/auth.guard';
import { User } from '@/user/user.entity';
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create_group_dto';
import { GroupService } from './group.service';
import { Request } from 'express';
import { AddGroupMemberDto } from './dto/add_group_member_dto';
import { RemoveGroupMemberDto } from './dto/remove_group_member_dto';

// The GroupController is the entry point for the group endpoints.
// The @UseGuards() decorator is used to define the authentication guard for the endpoint. On this endpoint, the JwtAuthGuard is used.
/* The @UseInterceptors() decorator is used to define the interceptor for the endpoint. 
    - On this endpoint, the ClassSerializerInterceptor is used.
    - It maps the GroupDto class to the response body in JSON format.
*/
// @APiResponse decorator is for swagger documentation.
/* @Req() decorator is used to get the request object.
    - In this case, user is extracted from the request object.
    - User is appended to the request object by the JwtAuthGuard upon successful authentication.
*/
@Controller('groups')
export class GroupController {

    // GroupService is injected into the GroupController using the constructor.
    constructor(private groupService: GroupService) { }

    // The @Get() decorator denotes the HTTP GET method for the endpoint.
    // This endpoint is used to get the group created requested user. It deligate the request to the groupService.
    @UseGuards(JwtAuthGuard)
    @Get('/')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'List of group owned by user.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async getGroup(@Req() { user }: Request) {
        return this.groupService.getGroup((<User>user));
    }

    // The @Post() decorator denotes the HTTP POST method for the endpoint.
    /* This endpoint creates the group for the requested user.
        - It deligates request to the groupService.
        - The @Body() decorator gets the request body data.
        - Body data is mapped to CreateGroupDto class and validated by pipe defined in main application configuration.
    */
    // Group owner property is updated to the id of current user.
    @UseGuards(JwtAuthGuard)
    @Post('/')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() { user }: Request) {
        createGroupDto.ownerId = (<User>user).id;
        return this.groupService.createGroup(createGroupDto);
    }

    // The @Put() decorator denotes the HTTP PUT method for the endpoint.
    // This endpoint adds member the group created by requested user.
    @UseGuards(JwtAuthGuard)
    @Put('/add-member')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group member(s) has been successfully added.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async addMember(@Body() updateGroupDto: AddGroupMemberDto, @Req() { user }: Request) {
        updateGroupDto.ownerId = (<User>user).id;
        return this.groupService.addMember(updateGroupDto);
    }

    // The @Delete() decorator denotes the HTTP Delete method for the endpoint.
    // This endpoint removes member from the group created by requested user.
    @UseGuards(JwtAuthGuard)
    @Delete('/remove-member')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group member(s) has been successfully removed.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async removeMember(@Body() removeGroupMemberDto: RemoveGroupMemberDto, @Req() { user }: Request) {
        removeGroupMemberDto.ownerId = (<User>user).id;
        return this.groupService.removeMember(removeGroupMemberDto);
    }

    // This endpoint deletes the group created by requested user.
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async deleteGroup(@Param('id') id: number,@Req() { user }: Request) {
        return this.groupService.deleteGroup(id,(<User>user));
    }

}
