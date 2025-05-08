import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
}
