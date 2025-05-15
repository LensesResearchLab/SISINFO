import { TaskType } from '../enums/taskType';

export interface Step {
  type: TaskType;
  assignee: 'student' | 'professor';
  title: string;
  description: string;
}
export const flows: Record<string, Step[]> = {
  proyectoPregrado: [
    {
      type: TaskType.UPLOAD_FILE,
      assignee: 'student',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'professor',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.SEND_COMMENTS,
      assignee: 'professor',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'student',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.UPLOAD_FILE,
      assignee: 'student',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
    {
      type: TaskType.SEND_COMMENTS,
      assignee: 'professor',
      title: 'Documento propuesta',
      description: 'Subir el documento de propuesta',
    },
  ],
};
