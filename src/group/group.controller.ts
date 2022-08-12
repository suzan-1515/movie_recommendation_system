import { JwtAuthGuard } from '@/user/auth/auth.guard';
import { User } from '@/user/user.entity';
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create_group_dto';
import { GroupService } from './group.service';
import { Request } from 'express';
import { AddGroupMemberDto } from './dto/add_group_member_dto';
import { RemoveGroupMemberDto } from './dto/remove_group_member_dto';

@Controller('groups')
export class GroupController {

    constructor(private groupService: GroupService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'List of group owned by user.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async getGroup(@Req() { user }: Request) {
        return this.groupService.getGroup((<User>user));
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() { user }: Request) {
        createGroupDto.ownerId = (<User>user).id;
        return this.groupService.createGroup(createGroupDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/add-member')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group member(s) has been successfully added.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async addMember(@Body() updateGroupDto: AddGroupMemberDto, @Req() { user }: Request) {
        updateGroupDto.ownerId = (<User>user).id;
        return this.groupService.addMember(updateGroupDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/remove-member')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group member(s) has been successfully removed.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async removeMember(@Body() removeGroupMemberDto: RemoveGroupMemberDto, @Req() { user }: Request) {
        removeGroupMemberDto.ownerId = (<User>user).id;
        return this.groupService.removeMember(removeGroupMemberDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiResponse({ status: 201, description: 'The group has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async deleteGroup(@Param('id') id: number,@Req() { user }: Request) {
        return this.groupService.deleteGroup(id,(<User>user));
    }

}
