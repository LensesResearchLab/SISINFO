import { Assistance, StatusInformation } from "@/app/inicio/estudiante/asistencia/types/assistance.type";

const assistance: Assistance[] = [
  {
    id: 0,
    name: "Asistencia graduada",
    clasification: "Investigacion",
    publication_date: new Date("12-05-2025"),
    end_date: new Date("12-05-2025"),
    description: "Hola mundo",
    requisites: ["1", "2"],
    professor: "Juan manuel",
    email: "juanma@gmail.com",
    start_semester: "2025-01",
  },
  {
    id: 1,
    name: "Director laboratorio",
    clasification: "Investigacion",
    publication_date: new Date("12-05-2025"),
    end_date: new Date("12-05-2025"),
    description: "Hola mundo",
    requisites: ["1", "2"],
    professor: "Juan manuel",
    email: "juanma@gmail.com",
    start_semester: "2025-01",
  },
  {
    id: 2,
    name: "Profesor asistente",
    clasification: "Investigacion",
    publication_date: new Date("12-05-2025"),
    end_date: new Date("12-05-2025"),
    description: "Hola mundo",
    requisites: ["1", "2"],
    professor: "Camilo Escobar",
    email: "juanma@gmail.com",
    start_semester: "2025-01",
  },
  {
    id: 3,
    name: "Profesor asistente",
    clasification: "Investigacion",
    publication_date: new Date("12-05-2025"),
    end_date: new Date("12-05-2025"),
    description: "Hola mundo",
    requisites: ["1", "2"],
    professor: "Juan manuel",
    email: "juanma@gmail.com",
    start_semester: "2025-01",
  },
  {
    id: 4,
    name: "Profesor asistente",
    clasification: "Investigacion",
    publication_date: new Date("12-05-2025"),
    end_date: new Date("12-05-2025"),
    description: "Hola mundo",
    requisites: ["1", "2"],
    professor: "Camilo Escobar",
    email: "juanma@gmail.com",
    start_semester: "2025-01",
  },
];

const status: StatusInformation[] = [
  {
    id: 1,
    assistance_id: 1,
    start_semester: "2025-20",
    name: "Asistente CLE",
    professor: "Camilo Escobar",
    student: "Nicolas Camargo",
    studentEmail: "n.camargop@uniandes.edu.co",
    studentCv: "hv.pdf",
    lastStep: "Inscrito",
    inscription_date: new Date("01-01-2025"),
    clasification: "Investigacion",
  },
  {
    id: 2,
    assistance_id: 2,
    start_semester: "2025-20",
    name: "Asistente SISINFO",
    professor: "Camilo Escobar 2",
    student: "Andres bernal",
    studentEmail: "a.bernal@uniandes.edu.co",
    studentCv: "hoja_vida_bernal.pdf",
    lastStep: "Postulado",
    inscription_date: new Date("01-02-2025"),
    clasification: "Investigacion",
  },
];

export async function getGraduatedAssistance() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return assistance;
}

export async function getGraduatedAssistanceById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const job = assistance.find((job) => job.id === Number(id));
  if (job) {
    return job;
  }
  throw new Error("Assistance not found.");
}

export async function getAssistanceStatus() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return status;
}

export async function getAssistanceStatusById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const application = status.find(
    (application) => application.id === Number(id)
  );
  if (application) {
    return application;
  }
  throw new Error("Assistance status not found.");
}
