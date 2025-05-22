import { API_ROUTES } from "../routes";
import { Incidence } from "../types/entities/incidence.type";

export async function createIncidence(incidence: Incidence): Promise<Incidence> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(incidence),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(
        `Error reporting incidence: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al enviar la petición:", error);
    throw error;
  }
}


export async function closeIncidence(id: string): Promise<Incidence> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}/${id}`;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(
        `Error closing incidence: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al enviar la petición:", error);
    throw error;
  }
}

export async function getAllIncidences(): Promise<Incidence[]> {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.INCIDENCES}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("No se pudo parsear el error:", parseError);
      }
      throw new Error(
        `Error fetching incidences: ${response.status} ${response.statusText}`,
        { cause: errorData }
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener las incidencias:", error);
    throw error;
  }
}