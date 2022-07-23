import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => String)
  loadEvents(
    @Args('pageIndex') pageIndex: string,
    @Args('loadSize') loadSize: string,
  ) {
    return this.eventService.loadEvents({ pageIndex, loadSize });
  }

  @Query(() => [Event])
  fetchEvents() {
    return this.eventService.fetchEvents();
  }

  @Mutation(() => Event)
  findEvents(@Args('searchWord') searchWord: string) {
    return this.eventService.findEvents({ searchWord });
  }
}
