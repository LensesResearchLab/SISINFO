export enum TaskType {
  UPLOAD_FILE = 'UPLOAD_FILE',
  SEND_COMMENTS = 'SEND_COMMENTS',
  SEND_APPROVE = 'SEND_APPROVE',
  VIEW_COMMENTS = 'VIEW_COMMENTS',
  ABET_TASK = 'ABET_TASK'
}
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
      description: 'Enviar nota del 100%',
    },
    {
      type: TaskType.VIEW_COMMENTS,
      assignee: 'student',
      title: 'Revisar 100%',
      description: 'Revisar la nota del 100%',
    },
    {
      type: TaskType.ABET_TASK,
      assignee: 'professor',
      title: 'Tarea ABET',
      description: 'Completar la tarea ABET',
    }
  ],
};
