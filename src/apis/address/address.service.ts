import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardAddress } from './entities/Board.address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(BoardAddress)
    private readonly addressRepository: Repository<BoardAddress>,
  ) {}

  async createAddress({ boardAddress }) {
    const address = await this.addressRepository.save({
      ...boardAddress,
    });
    return address;
  }
}
