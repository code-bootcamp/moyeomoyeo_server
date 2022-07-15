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
export class UpdatePostInput {
  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  fileSrc: string;

  @Column()
  @Field(() => String)
  headerImgSrc: string;

  @CreateDateColumn()
  @Field(() => Date)
  uploadedAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  editedAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  viewCount: number;

  //   @JoinTable()
  //   @ManyToMany(() => Category, (categories) => categories.posts)
  //   @Field(() => [Category])
  //   categories: Category[];
}
