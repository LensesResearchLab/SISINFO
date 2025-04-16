import { API_ROUTES } from "../routes";
import { Billboard } from "../types/billboard.type";
import { Period } from "../types/period.type";

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

export async function createBillboard(coursesInformation: Billboard) {
  console.log(coursesInformation);
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

