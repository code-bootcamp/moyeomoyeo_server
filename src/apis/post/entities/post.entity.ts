import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/category/entities/category.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  fileSrc: string;

  @Column()
  @Field(() => String)
  headerImgSrc: string;

  @Column()
  @Field(() => String)
  hashtags: string;

  @CreateDateColumn()
  @Field(() => Date)
  uploadedAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  editedAt: Date;

  @Column()
  @Field(() => Int)
  viewCount: number;

  @JoinTable()
  @ManyToMany(() => Category, (categories) => categories.posts)
  @Field(() => [Category])
  categories: Category[];
}
