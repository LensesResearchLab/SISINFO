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
  tesis1: [
    { type: TaskType.SEND_APPROVE, assignee: 'professor', title: 'Aprobar Tesis 1', description: 'Revisar la propuesta de Tesis 1' },
    { type: TaskType.SEND_APPROVE, assignee: 'professor', title: 'Aprobar Tesis 1', description: 'Revisar la propuesta como coordinador' },
  ],
  tesis2: [
    { type: TaskType.SEND_APPROVE, assignee: 'professor', title: 'Aprobar Tesis 2', description: 'Revisar la solicitud de Tesis 2' },
    { type: TaskType.SEND_APPROVE, assignee: 'professor', title: 'Aprobar Tesis 2', description: 'Revisar la solicitud como coordinador' },
  ],
  inscripcionSubarea: [
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'professor',
      title: 'Aprobar inscripción a subárea',
      description: 'Revisar y aprobar la solicitud del estudiante',
    },
    {
      type: TaskType.SEND_APPROVE,
      assignee: 'professor',
      title: 'Aprobar inscripción a subárea',
      description: 'Revisar y aprobar la solicitud como coordinador de subárea',
    },
  ],
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
    }
  ],
};
