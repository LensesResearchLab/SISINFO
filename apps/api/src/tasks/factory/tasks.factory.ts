import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskType } from '../enums/taskType';

export interface FactoryParams {
  type: TaskType;
  comment?: string;
  approved?: boolean;
  step?: number;
  documentId?: string;
  flow?: string;
  projectApplicationId?: string;
  studentId?: string;
  professorId?: string;
  coordinatorId?: string;
}

@Injectable()
export class TaskFactory {
  create(params: FactoryParams): CreateTaskDto {
    const {
      type,
      comment,
      approved,
      documentId,
      flow,
      step,
      projectApplicationId,
      studentId,
      professorId,
      coordinatorId,
    } = params;

    // Base común
    const dto: CreateTaskDto = {
      type,
      comment: comment ?? '',
      approved: approved ?? false,
      documentId,
      flow,
      step,
      projectApplicationId,
      studentId,
      professorId,
      coordinatorId,
    };

    switch (type) {
      case TaskType.UPLOAD_FILE:
      case TaskType.ABET_TASK:
        dto.documentId = '';
        return dto;

      case TaskType.SEND_APPROVE:
      case TaskType.VIEW_COMMENTS:
      case TaskType.SEND_COMMENTS:
        return dto;

      default:
        throw new BadRequestException(`Tipo de tarea desconocido`);
    }
  }
}
