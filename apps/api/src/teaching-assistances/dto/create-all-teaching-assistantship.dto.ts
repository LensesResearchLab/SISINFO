import { CreateTeachingAssistanceDto } from './create-teaching-assistance.dto';

export class CreateAllTeachingAssistantship {
  period: string;
  assistants: CreateTeachingAssistanceDto[];
}
