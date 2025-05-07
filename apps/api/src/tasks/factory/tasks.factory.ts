// src/tasks/task.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskType } from '../enums/taskType';

export interface FactoryParams {
  type: TaskType;
  comment?: string;
  approved?: boolean;
  documentId?: string;
  projectApplicationId?: string; 
  flow?: string;
}

@Injectable()
export class TaskFactory {
  create(params: FactoryParams): CreateTaskDto {
    const { type, comment, approved, documentId, flow, projectApplicationId } = params;

    // Base común
    const dto: CreateTaskDto = {
      type,
      comment: comment ?? '',
      approved: approved ?? false,
      documentId,
      flow,
      projectApplicationId,
    };

    switch (type) {
      case TaskType.UPLOAD_FILE:
        // Tarea de subir archivo: comentario genérico, no aprobar automático
        dto.comment = dto.comment || 'Por favor sube tu archivo';
        dto.approved = false;
        return dto;

      case TaskType.SEND_COMMENTS:
        // Tarea de enviar comentarios: arranca aprobado en false
        dto.comment = dto.comment || 'Envía tus comentarios aquí';
        dto.approved = false;
        return dto;

      case TaskType.SEND_APPROVE:
        dto.comment = dto.comment || '';
        dto.approved = dto.approved!;
        return dto;

      default:
        throw new BadRequestException(`Tipo de tarea desconocido: ${type}`);
    }
  }
}
