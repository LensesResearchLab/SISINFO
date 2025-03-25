import { Coordinator, Tutorial } from "@/app/types/support.types";

const coordinators: Coordinator[] = [
  {
    id: 1,
    name: "Juan Pablo Fernandez",
    office: "ML-70",
    email: "pregisis@uniandes.edu.co",
    extension: "2873",
    image: "/juan_fernandez.jpg",
  },
  {
    id: 2,
    name: "Natalia Franco Tamara",
    office: "ML-79",
    email: "magitn@uniandes.edu.co",
    extension: "3745",
    image: "/natalia_franco.jpg",
  },
];

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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return coordinators;
}

export async function getCoordinatorById(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const coordinator = coordinators.find((coord) => coord.id === id);
  if (coordinator) {
    return coordinator;
  }
  throw new Error("Coordinator not found.");
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
