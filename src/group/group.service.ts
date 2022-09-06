import { User } from '@/user/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create_group_dto';
import { Group } from './group.entity';
import { In, Equal } from "typeorm"
import { AddGroupMemberDto } from './dto/add_group_member_dto';
import { RemoveGroupMemberDto } from './dto/remove_group_member_dto';

// Group service handles the business logic for the group feature.
// It is injected into the GroupController.
@Injectable()
export class GroupService {

    // Inject the group repository into the service. This repository comes from TYPEORM that is configured to use Group entity.
    @InjectRepository(Group)
    private readonly repository: Repository<Group>;

    // This repository comes from TYPEORM that is configured to use User entity.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    // Create a new group.
    async createGroup(createGroupDto: CreateGroupDto): Promise<any> {
        console.log(createGroupDto);
        // Extract the group name, owner id and members id from the createGroupDto.
        let { name, ownerId, membersId }: CreateGroupDto = createGroupDto;

        // Validate the group name and ownerId.
        if (!name || !ownerId) {
            throw new BadRequestException('Missing body fields');
        }

        /* Find the owner of the group with requested ownerId.
            - If the owner is not found, throw a NotFoundException.
        */

        const user = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!user)
            throw new NotFoundException('Group owner not found.');

        /*
            - Group owner is added to the group members list.
            - If the membersId is not provided, the group will be created with only the owner.
            - If the membersId is provided, the group will be created with the owner and the members.
            - If the membersId is provided, but one or more members are not found, throw a NotFoundException.
        */
        let members = [];
        members.push(user);
        if (membersId) {
            membersId = [...new Set(membersId)]; // Remove duplicate members if present.
            members = await this.userRepository.find({ where: { id: In(membersId) } });
            if (!members || members.length !== membersId.length) {
                throw new NotFoundException('One or more group members not found.');
            }
        }

        const group = new Group();
        group.name = name;
        group.owner = user;
        group.members = members;

        try {

            // Save the group to the database. It returns the saved group.
            // Returned group does not contain the owner and member relation data.
            const savedGroup = await this.repository.save(group);

            // So, return the saved group with the relations to the owner and members.
            return this.repository.findOne(
                {
                    where:
                    {
                        id: savedGroup.id
                    },
                    relations: ['owner', 'members']
                },
            );
        } catch (e) {
            console.log(e);
            throw new BadRequestException('Group already exists.');
        }
    }

    // Get all groups.
    async getGroup(groupOwner: User): Promise<any> {

            // Custom query builder is used because by default TYpeORM does not support relations in the where clause.
            // Left join is used for the owner and members relation.
            // Check if the group owner is the same as the logged in user.
            // then get group id only.
            const groupsId = await this.repository.createQueryBuilder("group")
            .leftJoin("group.members", "user")
            .where("user.id = :ownerId", { ownerId: groupOwner.id })
            .select(["group.id"]).getMany();

            // Check if group exists.
            if(groupsId.length === 0){
                throw new NotFoundException('Group not found.');
            }

            // Query the groups with the group ids.
            const groups = await this.repository.find({ where: { id: In(groupsId.map((e)=>e.id)) }, relations: ['owner', 'members'] });
    
        return groups;
    }

    // Add members to the group.
    async addMember(updateGroupDto: AddGroupMemberDto): Promise<any> {
        let { groupId, membersId, ownerId }: AddGroupMemberDto = updateGroupDto;
        // Check if the group exists.
        const group = await this.repository.findOne({ where: { id: groupId }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
            // Check if the logged in user is the owner of the group.
        if (group.owner.id !== ownerId)
            throw new BadRequestException('You are not the owner of this group.');
        if (!membersId || membersId.length === 0)
            throw new BadRequestException('Members cannot be empty.');

        let members = [];

        // remove duplicate members if present.
        // Check if the member ids are valid.
        membersId = [...new Set(membersId)];
        members = await this.userRepository.find({ where: { email: In(membersId) } });
        if (!members || members.length !== membersId.length) {
            throw new NotFoundException('One or more group members not found.');
        }

        // Filter out the members that are already in the group and add only the news members.
        members = members.filter((member) => !group.members.map(e => e.id).includes(member.id));

        // merge the new members with the existing members.
        group.members = [...group.members, ...members];

        return this.repository.save(group);
    }

    // Remove members from the group.
    async removeMember(removeMemberDto: RemoveGroupMemberDto): Promise<any> {
        let { groupId, membersId, ownerId }: RemoveGroupMemberDto = removeMemberDto;
        const group = await this.repository.findOne({ where: { id: groupId }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
        if (group.owner.id !== ownerId)
            throw new BadRequestException('You are not the owner of this group.');
        if (!membersId || membersId.length === 0)
            throw new BadRequestException('Members cannot be empty.');

        // remove member to be removed from the group.
        const members = group.members.filter((member) => !membersId.includes(member.id));

        // update members after removing requested member.
        group.members = members;


        return this.repository.save(group);
    }

    // Delete the group.
    async deleteGroup(id: number, owner: User): Promise<any> {
        const group = await this.repository.findOne({ where: { id: id }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
        if (group.owner.id !== owner.id)
            throw new BadRequestException('You are not the owner of this group.');

        return this.repository.delete({ id: id });
    }

}
