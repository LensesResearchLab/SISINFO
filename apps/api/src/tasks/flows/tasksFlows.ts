import { TaskType } from "../enums/taskType";

export interface Step {
    type: TaskType;
    assignee: 'student' | 'professor';
  }
export const flows: Record<string, Step[]> = {
    proyectoPregrado: [
        {type:TaskType.UPLOAD_FILE, assignee:'student'},
        {type:TaskType.SEND_APPROVE, assignee:'professor'},
        {type:TaskType.SEND_COMMENTS, assignee:'professor'},
        {type:TaskType.SEND_APPROVE, assignee:'student'},
        {type:TaskType.UPLOAD_FILE, assignee:'student'},
        {type:TaskType.SEND_COMMENTS, assignee:'professor'}
    ],
};
