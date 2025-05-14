import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskType } from '../enums/taskType';

export interface FactoryParams {
  type: TaskType;
  comment?: string;
  approved?: boolean;
  documentId?: string;
  flow?: string;
  projectApplicationId?: string;
  studentId?: string;
  professorId?: string;
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
      projectApplicationId,
      studentId,
      professorId,
    } = params;

    // Base común
    const dto: CreateTaskDto = {
      type,
      comment: comment ?? '',
      approved: approved ?? false,
      documentId,
      flow,
      projectApplicationId,
      studentId,
      professorId,
    };

    switch (type) {
      case TaskType.UPLOAD_FILE:
        dto.documentId = '';
        return dto;

      case TaskType.SEND_COMMENTS:
        // Tarea de enviar comentarios: arranca aprobado en false
        dto.comment = dto.comment || 'Envía tus comentarios aquí';
        return dto;

      case TaskType.SEND_APPROVE:
        dto.approved = dto.approved!;
        return dto;

      default:
        throw new BadRequestException(`Tipo de tarea desconocido: ${type}`);
    }
  }
}
