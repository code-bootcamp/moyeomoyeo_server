import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/image/entities/image.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Date)
  dateStart: Date;

  @Column()
  @Field(() => Date)
  dateEnd: Date;

  @JoinTable()
  @OneToMany(() => Image, (images) => images.post)
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @Column()
  @Field(() => String)
  category: string;

  @CreateDateColumn()
  @Field(() => Date)
  uploadedAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  editedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  viewCount: number;

  @JoinTable()
  @ManyToMany(() => User, (likedUsers) => likedUsers.dibsPosts)
  @Field(() => [User], { nullable: true })
  likedUsers: User[];
}
