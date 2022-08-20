import { User } from '@/user/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create_group_dto';
import { Group } from './group.entity';
import { In, Equal } from "typeorm"
import { AddGroupMemberDto } from './dto/add_group_member_dto';
import { RemoveGroupMemberDto } from './dto/remove_group_member_dto';

@Injectable()
export class GroupService {

    @InjectRepository(Group)
    private readonly repository: Repository<Group>;

    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    async createGroup(createGroupDto: CreateGroupDto): Promise<any> {
        console.log(createGroupDto);
        let { name, ownerId, membersId }: CreateGroupDto = createGroupDto;

        if (!name || !ownerId) {
            throw new BadRequestException('Missing body fields');
        }

        const user = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!user)
            throw new NotFoundException('Group owner not found.');

        let members = [];
        members.push(user);
        if (membersId) {
            membersId = [...new Set(membersId)];
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

            const savedGroup = await this.repository.save(group);

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

    async getGroup(groupOwner: User): Promise<any> {
        let groupId = await this.repository.createQueryBuilder("group")
            .leftJoin("group.owner", "user")
            .where("user.id = :ownerId", { ownerId: groupOwner.id })
            .select(["group.id"])
            .getOne();

            if(groupId){
                return this.repository.findOne({ where: { id: groupId.id }, relations: ['owner', 'members'] });
            }

            const groupsId = await this.repository.createQueryBuilder("group")
            .leftJoin("group.members", "user")
            .where("user.id = :ownerId", { ownerId: groupOwner.id })
            .select(["group.id"]).getMany();

            if(groupsId.length === 0){
                throw new NotFoundException('Group not found.');
            }

            const groups = await this.repository.find({ where: { id: In(groupsId) }, relations: ['owner', 'members'] });
    
        return groups;
    }

    async addMember(updateGroupDto: AddGroupMemberDto): Promise<any> {
        let { groupId, membersId, ownerId }: AddGroupMemberDto = updateGroupDto;
        const group = await this.repository.findOne({ where: { id: groupId }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
        if (group.owner.id !== ownerId)
            throw new BadRequestException('You are not the owner of this group.');
        if (!membersId || membersId.length === 0)
            throw new BadRequestException('Members cannot be empty.');

        let members = [];

        membersId = [...new Set(membersId)];
        members = await this.userRepository.find({ where: { email: In(membersId) } });
        if (!members || members.length !== membersId.length) {
            throw new NotFoundException('One or more group members not found.');
        }

        members = members.filter((member) => !group.members.map(e => e.id).includes(member.id));

        group.members = [...group.members, ...members];

        return this.repository.save(group);
    }

    async removeMember(removeMemberDto: RemoveGroupMemberDto): Promise<any> {
        let { groupId, membersId, ownerId }: RemoveGroupMemberDto = removeMemberDto;
        const group = await this.repository.findOne({ where: { id: groupId }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
        if (group.owner.id !== ownerId)
            throw new BadRequestException('You are not the owner of this group.');
        if (!membersId || membersId.length === 0)
            throw new BadRequestException('Members cannot be empty.');

        const members = group.members.filter((member) => !membersId.includes(member.id));

        group.members = members;


        return this.repository.save(group);
    }

    async deleteGroup(id: number, owner: User): Promise<any> {
        const group = await this.repository.findOne({ where: { id: id }, relations: ['owner', 'members'], });
        if (!group)
            throw new NotFoundException('Group not found.');
        if (group.owner.id !== owner.id)
            throw new BadRequestException('You are not the owner of this group.');

        return this.repository.delete({ id: id });
    }

}
