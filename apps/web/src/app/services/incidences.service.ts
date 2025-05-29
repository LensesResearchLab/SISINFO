import { API_ROUTES } from "../routes";
import { Incidence } from "../types/entities/incidence.type";
import handleRequest from "./handle-request";

export async function createIncidence(incidence: Incidence): Promise<Incidence> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}`;
  return handleRequest<Incidence>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidence),
  });
}

export async function closeIncidence(id: string): Promise<Incidence> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}/${id}`;
  return handleRequest<Incidence>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getAllIncidences(): Promise<Incidence[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}`;
  return handleRequest<Incidence[]>(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
