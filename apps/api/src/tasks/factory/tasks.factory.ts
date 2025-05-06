// src/tasks/task.factory.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskType } from '../enums/taskType';

export interface FactoryParams {
  type: TaskType;
  comment?: string;
  approved?: boolean;
  dateId?: string;
  documentId?: string;
}

@Injectable()
export class TaskFactory {
  /**
   * Crea un CreateTaskDto ya completo con defaults según el tipo
   */
  create(params: FactoryParams): CreateTaskDto {
    const { type, comment, approved, dateId, documentId } = params;

    // Base común
    const dto: CreateTaskDto = {
      type,
      comment: comment ?? '',
      approved: approved ?? false,
      dateId,
      documentId,
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

      case TaskType.SEND_BOOLEAN:
        // Tarea de respuesta sí/no: podría arrancar en approved = null,
        // pero aquí lo inicializamos en false
        dto.comment = dto.comment || '';
        dto.approved = dto.approved!;
        return dto;

      default:
        throw new BadRequestException(`Tipo de tarea desconocido: ${type}`);
    }
  }
}
