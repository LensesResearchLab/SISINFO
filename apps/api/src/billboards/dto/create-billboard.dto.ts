import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBillboardDto {
  @IsBoolean()
  publicated: boolean;
}
