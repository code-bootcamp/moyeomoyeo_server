import { InputType, OmitType } from '@nestjs/graphql';
import { BoardDate } from '../entities/boardDate.entity';

@InputType()
export class BoardDateInput extends OmitType(BoardDate, ['id'], InputType) {}
