/**
 * This file contains the navigation data structures for different user roles in the SISINFO system.
 * Each data structure defines the menu items, their icons, routes and nested sub-items.
 */

import { FileText, School, Settings2 } from "lucide-react";
import { ROUTES } from "@/app/routes";

export const undergraduateData = [
  {
    title: "Tesis de pregrado",
    url: "pregrado",
    icon: FileText,
    isActive: false,
    items: [
      {
        title: "Consultar temas",
        url: ROUTES.UNDERGRADUATE_THESIS_LIST,
      },
      {
        title: "Consultar inscripcion",
        url: ROUTES.UNDERGRADUATE_THESIS_STATUS,
      },
      {
        title: "Consultar fechas",
        url: ROUTES.UNDERGRADUATE_THESIS_DATES,
      },
    ],
  },
  {
    title: "Asistencia graduada",
    url: "asistencia",
    icon: School,
    items: [
      {
        title: "Ver asistencias disponibles",
        url: ROUTES.ASSISTANCE_LIST,
      },
      {
        title: "Ver estado de inscripción",
        url: ROUTES.ASSISTANCE_APPLIED_LIST,
      },
    ],
  },
]

export const professorData = [
  {
    title: "Proyecto de pregrado",
    url: "pregrado",
    icon: FileText,
    items: [
      {
        title: "Publicar y consultar proyectos de pregrado",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST,
      },
      {
        title: "Consultar histórico proyectos de grado",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_HISTORY,
      },
      {
        title: "Consultar fechas",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_DATES,
      },
    ],
  },
  {
    title: "Proyecto de maestria",
    url: "postgrado",
    icon: School,
    items: [
      {
        title: "Publicar y consultar proyectos de maestria",
        url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_LIST,
      },
      {
        title: "Consultar histórico proyectos de grado",
        url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_HISTORY,
      },
      {
        title: "Consultar fechas",
        url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_DATES,
      },
    ],
  },
  {
    title: "Asistencias graduadas",
    url: "asistencia",
    icon: Settings2,
    items: [
      {
        title: "Ver asistencias publicadas",
        url: ROUTES.PROFESSOR_ASSISTANCE_LIST,
      },
      {
        title: "Crear oferta",
        url: ROUTES.PROFESSOR_NEW_ASSISTANCE,
      },
    ],
  },
]

export const coordinatorData = [
  {
    title: "Configuración del semestre",
    url: "configuracion",
    icon: FileText,
    items: [
      {
        title: "Consultar programas de clases",
        url: ROUTES.COURSE_PROGRAMS
      },
      {
        title: "Consultar cargas de notas",
        url: ROUTES.GRADE_LOAD
      },
      {
        title: "Administrar cartelera",
        url: ROUTES.BULLETIN_BOARD
      },
    ],
  },
  {
    title: "Alertas y reportes",
    url: "alertas",
    icon: FileText,
    items: [
      {
        title: "Generar reportes",
        url: ROUTES.REPORTS
      },
      {
        title: "Alerta de fechas",
        url: ROUTES.DATE_ALERTS
      },
    ],
  },
  {
    title: "Monitores",
    url: "monitores",
    icon: FileText,
    items: [
      {
        title: "Cargar archivo",
        url: ROUTES.UPLOAD_TAS
      },
    ],
  },
]

export const supportData = [
  {
    title: "Ayuda",
    url: "soporte",
    icon: FileText,
    items: [ 
      {
        title: "Reporte de incidencias",
        url: ROUTES.SUPPORT_INCIDENCE,
      },
      {
        title: "Tutoriales",
        url: ROUTES.SUPPORT_TUTORIALS,
      },
      {
        title: "Contactar a coordinadores",
        url: ROUTES.SUPPORT_CONTACT,
      },
    ],
  },
]