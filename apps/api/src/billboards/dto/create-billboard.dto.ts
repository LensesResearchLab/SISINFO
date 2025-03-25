import { IsBoolean } from 'class-validator';

export class CreateBillboardDto {
  @IsBoolean()
  publicated: boolean;
}
