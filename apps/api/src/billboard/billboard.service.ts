import { Injectable } from '@nestjs/common';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Billboard } from './entities/billboard.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillboardService {
  constructor(
    @InjectRepository(Billboard) private billboardRepository: Repository<Billboard>
  ){}

  async create(createBillboardDto: CreateBillboardDto) {
    const billboard = this.billboardRepository.create(createBillboardDto);
    await this.billboardRepository.save(billboard);
    return billboard
  }

  findAll() {
    return `This action returns all billboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billboard`;
  }

  update(id: number, updateBillboardDto: UpdateBillboardDto) {
    return `This action updates a #${id} billboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} billboard`;
  }
}
