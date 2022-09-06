import { User } from '@/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { Group } from './group.entity';
import { GroupService } from './group.service';

/* The GroupModule is the entry point for the group feature.
    - It imports the TypeOrmModule for the Group entity.
    - It imports the GroupController and GroupService.
*/
@Module({
  imports: [TypeOrmModule.forFeature([Group,User]), ],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
