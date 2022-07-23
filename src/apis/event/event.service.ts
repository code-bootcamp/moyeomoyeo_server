import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import axios from 'axios';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async loadEvents({ pageIndex, loadSize }) {
    const KEY = process.env.OPENAPI_CLIENT_KEY;
    const result = await axios.get(
      `https://openapi.gg.go.kr/Ggculturevent?KEY=${KEY}&pIndex=${pageIndex}&pSize=${loadSize}&Type=json`,
    );
    await Promise.all(
      result.data.Ggculturevent[1].row.map((element) => {
        return this.eventRepository.save({
          name: element.TITLE,
          description: element.SUMMRY_SNTNC_CONT,
          date: element.EVENT_PERD.split(' ')[0],
          areaCode: element.INST_NM,
          imgSrc: element.IMAGE_URL,
          urlRedirect: element.SNTNC_URL,
        });
      }),
    );
    return JSON.stringify(result.data);
  }

  async fetchEvents() {
    const results = await this.eventRepository.find();
    return results;
  }

  async findEvents({ searchWord }) {
    const events = await this.eventRepository.find({
      where: { name: searchWord },
    });
    return events;
  }
}
