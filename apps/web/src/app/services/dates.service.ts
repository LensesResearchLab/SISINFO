import { API_ROUTES } from '../routes';
import { ImportantSection } from '../types/entities/important-section';
import { updateImportantDateDto } from '../types/updateImportantDate.type';


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



export async function updateImportantDate(dateId: string, updateData:updateImportantDateDto): Promise<ImportantSection[]> {
  
  
  const url = `${API_ROUTES.BASE}/${API_ROUTES.IMPORTAT_DATE}/${dateId}`;
  console.log(JSON.stringify(updateData));
  const response = await fetch(url,{
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(updateData),
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error("Failed to fetch dates.");
  }
  
  return response.json();
}