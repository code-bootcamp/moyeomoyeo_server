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

  async loadEvents() {
    const result = await axios.get(
      'https://openapi.gg.go.kr/Ggculturevent?KEY=5fa2f78b0c4a4ab5a6a80ff0d3be5b91&pIndex=1&pSize=10&Type=json',
    );
    console.log(JSON.stringify(result.data.Ggculturevent[1].row[0]));
    await Promise.all(
      result.data.Ggculturevent[1].row.map((element) => {
        return this.eventRepository.save({
          name: element.TITLE,
          description: element.SUMMRY_SNTNC_CONT,
          date: element.EVENT_PERD.split(' ')[0],
          areaCode: element.INST_NM,
        });
      }),
    );
    return JSON.stringify(result.data);
  }
}
