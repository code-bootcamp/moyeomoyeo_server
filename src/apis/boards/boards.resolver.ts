import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { TargetUser } from 'src/commons/auth/gql-user.param';

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
  fetchBoards() {
    return this.boardService.findAll();
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
}
