import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String)
  description: string;

  @Column({ nullable: true })
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => String)
  areaCode: string;

  @Column()
  @Field(() => String)
  imgSrc: string;

  @Column({ nullable: true })
  @Field(() => String)
  urlRedirect: string;
}
