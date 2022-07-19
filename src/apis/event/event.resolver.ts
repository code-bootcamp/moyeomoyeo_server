import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => String)
  loadEvents() {
    return this.eventService.loadEvents();
  }

  @Mutation(() => Event)
  findEvents(@Args('searchWord') searchWord: string) {
    return this.eventService.findEvents({ searchWord });
  }
}
