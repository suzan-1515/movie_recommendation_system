import { User } from '@/user/user.entity';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

/* Entity decorator is used to define the entity.
    - This decorator comes from TYPEORM.
    - The entity is mapped to the group table in the database.
    - Property name is mapped to the column name in the database.
*/

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @OneToOne(() => User,)
  @JoinColumn()
  public owner!: User;

  // Defines the many to many relationship between group and user.
  // Cascade set to true to update or delete the group  when user is updated or deleted.
  @ManyToMany(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable()
  public members!: User[];

}