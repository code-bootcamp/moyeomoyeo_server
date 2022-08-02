import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BoardAddress {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'decimal', precision: 8, scale: 5 })
  @Field(() => Float, { nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 8, scale: 5 })
  @Field(() => Float, { nullable: true })
  lng: number;

  @Column()
  @Field(() => String, { nullable: true })
  postal: string;

  @Column()
  @Field(() => String, { nullable: true })
  address_description: string;
}
