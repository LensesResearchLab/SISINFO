import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    return tag;
  }

  findAll() {
    return this.tagRepository.find({ relations: ['theses'] });
  }

  findOne(id: string) {
    return this.tagRepository.findOne({ where: { id }, relations: ['theses'] });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) return null;
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string) {
    await this.tagRepository.manager.query('DELETE FROM thesis_tags WHERE "tagId" = $1', [id]);
    await this.tagRepository.delete(id);
    return { id, deleted: true };
  }
}
