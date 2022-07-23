import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';
import { Accompany } from '../accompany/entities/accompany.entity';
import { BoardService } from './boards.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  @Query(() => [Board])
  fetchBoards(
    @Args('page', { nullable: true }) page: number,
    @Args('pageSize', { nullable: true }) pageSize: number,
  ) {
    return this.boardService.findAll({ page, pageSize });
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({ boardId, updateBoardInput });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Board)
  async makeBoardFull(@Args('boardId') boardId: string) {
    return this.boardService.markAsFull({ boardId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @TargetUser() payload: any,
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ) {
    return this.boardService.create({ payload, createBoardInput });
  }

  @Mutation(() => Boolean)
  deleteBoard(@Args('boardId') boardId: string) {
    return this.boardService.delete({ boardId });
  }

  @UseGuards(GqlAccessGuard)
  @Mutation(() => Accompany)
  requestAccompany(
    @Args('boardId') boardId: string,
    @TargetUser() targetUser: any,
  ) {
    return this.boardService.request({ boardId, targetUser });
  }

  @Query(() => [Accompany])
  fetchBoardRequest(@Args('boardId') boardId: string) {
    return this.boardService.fetchRequest({ boardId });
  }
}
