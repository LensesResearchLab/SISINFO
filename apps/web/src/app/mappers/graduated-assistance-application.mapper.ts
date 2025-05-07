import { GraduatedAssistanceApplication } from "../types/entities/graduated-assistance-application.type";

export function mapGraduatedAssistanceApplicationsToRowValues(applications: GraduatedAssistanceApplication[]) {
  return applications.map(mapGraduatedAssistanceApplicationToRowValue);
}

function mapGraduatedAssistanceApplicationToRowValue(application: GraduatedAssistanceApplication) {
  return {
    id: application.id,
    status: application.status,
    student: application.student,
    graduatedAssistance: application.graduatedAssistance,
  };
}