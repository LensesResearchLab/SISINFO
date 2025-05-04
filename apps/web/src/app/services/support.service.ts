import { Tutorial } from "@/app/types/tutorial.types";
import { API_ROUTES } from "../routes";

const tutoriales: Tutorial[] = [
  {
    id: 1,
    title: "Tutorial de inscripción",
    description: "Aprende cómo inscribirte en las tesis de tu interés.",
    link: "https://www.youtube.com/watch?v=FHW8y_utKRU&ab_channel=BaityBait",
  },
  {
    id: 2,
    title: "Tutorial de inscripción",
    description: "Aprende cómo inscribirte en los cursos de tu interés.",
    link: "https://www.youtube.com/watch?v=FHW8y_utKRU&ab_channel=BaityBait",
  },
];


export async function getCoordinators() {
  const url = `${API_ROUTES.BASE}/${API_ROUTES.COORDINATORS}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
    });
    alert(JSON.stringify(response));
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error buscando los coordinadores: ${response.statusText}`, { cause: errorData });
    }
    return response.json();
}


export async function getTutorials() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return tutoriales;
}

export async function getTutorialById(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const tutorial = tutoriales.find((tutorial) => tutorial.id === id);
  if (tutorial) {
    return tutorial;
  }
  throw new Error("Tutorial not found.");
}
