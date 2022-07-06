import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';

@Resolver()
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => String)
  loadEvents() {
    return this.eventService.loadEvents();
  }
}
