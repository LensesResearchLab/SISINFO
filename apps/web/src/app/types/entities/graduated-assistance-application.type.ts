import { GraduatedAssistance } from './graduated-assistance.type';
import { Student } from './student.type';

export interface GraduatedAssistanceApplication {
    id:                  string;
    status:              string;
    student:             Student;
    graduatedAssistance: GraduatedAssistance;
}

