import { TaskType } from '../enums/taskType';

export interface Step {
  type: TaskType;
  assignee: 'student' | 'professor' | 'coordinator';
  title: string;
  description: string;
}
export const flows: Record<string, Step[]> = {
  proyectoPregrado: [
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'coordinator',
      title: 'Aprobar estudiante',
      description: 'Aprobar al estudiante',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'professor',
      title: 'Aceptar estudiante',
      description: 'Profesor acepta al estudiante para su proyecto',
    },
    {
      type: TaskType.UPLOAD_FILE,
      assignee: 'student',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'professor',
      title: 'Aprobar documento',
      description: 'Aprobar documento de propuesta',
    },
    {
      type: TaskType.SEND_COMMENTS,
      assignee: 'professor',
      title: '30%',
      description: 'Enviar nota 30%',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'student',
      title: 'Retiro',
      description: '¿Retirará la materia?',
    },
    {
      type: TaskType.UPLOAD_FILE,
      assignee: 'student',
      title: 'Enviar poster',
      description: 'Subir el poster del proyecto',
    },
    {
      type: TaskType.SEND_COMMENTS,
      assignee: 'professor',
      title: 'Nota 100%',
      description: 'Enviar comentario y nota final del proyecto',
    },
    {
      type: TaskType.VIEW_COMMENTS,
      assignee: 'student',
      title: 'Revisar 100%',
      description: 'Revisar la nota final del proyecto',
    },
    {
      type: TaskType.ABET_TASK,
      assignee: 'professor',
      title: 'Subir reporte ABET',
      description: 'Cargar el archivo del reporte ABET',
    },
  ],
};
