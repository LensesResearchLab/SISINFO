import { API_ROUTES } from "../routes";
import { Billboard } from "../types/entities/billboard.type";

export async function getBillboard(periodId: string) {
  const response = await fetch(
    `${API_ROUTES.BASE}/${API_ROUTES.COORDINATOR_BILLBOARD}/${periodId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get billboard.");
  }
  
  return response.json();
}

export async function getBillboardWithUploadedProgram(periodId: string) {
  const response = await fetch(
    `${API_ROUTES.BASE}/${API_ROUTES.COORDINATOR_BILLBOARD}/coursesProgram/${periodId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get billboard.");
  }
  
  return response.json();
}


export async function createBillboard(coursesInformation: Billboard[]) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.COORDINATOR_BILLBOARD}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coursesInformation),
  });


  if (!response.ok) {
    throw new Error("Failed to create billboard.");
  }

  return response.json();
}

export async function getCourseWithDocument(id: string) {
  const response = await fetch(
    `${API_ROUTES.BASE}/${API_ROUTES.COURSES}/${id}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get course");
  }

  return response.json();
}

export async function getProgramUploadedReport(period?: string) {
  const url = period 
    ? `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/program-report?period=${encodeURIComponent(period)}`
    : `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/program-report`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }
  return response.json();
}

export async function getPartialGradesReport(period?: string) {
  const url = period 
    ? `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/partial-report?period=${encodeURIComponent(period)}`
    : `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/partial-report`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }
  return response.json();
}

export async function getFinalGradesReport(period?: string) {
  const url = period 
    ? `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/final-report?period=${encodeURIComponent(period)}`
    : `${API_ROUTES.BASE}/${API_ROUTES.SECTIONS_REPORTS}/final-report`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data.");
  }
  return response.json();
}
