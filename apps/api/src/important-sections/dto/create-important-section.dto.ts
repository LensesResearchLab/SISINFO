import { AcademicProcess } from '../enum/academic-process.enum';

export class CreateImportantSectionDto {
  name: string;
  academicProcess: AcademicProcess;
  periodStr: string;
}
