import { API_ROUTES } from "../routes";
import { Billboard } from "../types/billboard.type";

export async function getBillboard(periodId: string) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.COORDINATOR_BILLBOARD}/${periodId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

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

export async function getCourseWithDocument(id:string) {
  const response = await fetch(`${API_ROUTES.BASE}/${API_ROUTES.COURSES}/${id}`,
    {
      method: "GET",
      headers:{
        "Content-type":"application/json"
      }
    }
  );
  if (!response.ok){
    throw new Error("Failed to get course")
  }

  return response.json();
  
}

