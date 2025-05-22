import { API_ROUTES } from '../routes';
import { ImportantSection } from '../types/entities/important-section';


export async function findByAcademicProcessAndPeriod(academicProcess: string, periodStr?: string): Promise<ImportantSection[]> {
  const params = new URLSearchParams();
  params.append('academicProcess', academicProcess);

  if (periodStr) {
    params.append('periodStr', periodStr);
  }

  const url = `${API_ROUTES.BASE}/${API_ROUTES.DATES}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch dates.");
  }
  return response.json();
}
