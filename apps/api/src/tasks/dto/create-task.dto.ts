import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
