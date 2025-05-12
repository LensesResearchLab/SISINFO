/**
 * This file contains the navigation data structures for different user roles in the SISINFO system.
 * Each data structure defines the menu items, their icons, routes and nested sub-items.
 */

import {
  AlertTriangle,
  BookOpen,
  Calendar,
  FileBarChart,
  FileText,
  GraduationCap,
  Headphones,
  HelpCircle,
  PenSquare,
  School,
  ScrollText,
  Settings2,
  Video,
} from "lucide-react";
import { ROUTES } from "@/app/routes";

export const undergraduateData = [
  {
    title: "Proyecto de grado",
    url: "pregrado",
    icon: GraduationCap,
    isActive: false,
    items: [
      {
        Icon: FileText,
        title: "Consultar temas",
        description:
          "Aquí puedes ver los proyectos disponibles y aplicar al que te interese.",
        url: ROUTES.UNDERGRADUATE_THESIS_LIST,
      },
      {
        Icon: PenSquare,
        title: "Ver estado de aplicación",
        description:
          "Aquí puedes ver los detalles de tu inscripción al proyecto de grado.",
        url: ROUTES.UNDERGRADUATE_THESIS_STATUS,
      },
      {
        Icon: Calendar,
        title: "Consultar fechas",
        description:
          "Aquí puedes consultar las fechas importantes del proceso.",
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
        Icon: BookOpen,
        title: "Ver asistencias disponibles",
        description:
          "Aquí puedes ver las asistencias disponibles y aplicar a estas.",
        url: ROUTES.ASSISTANCE_LIST,
      },
      {
        Icon: PenSquare,
        title: "Ver estado de inscripción",
        description:
          "Consulta como se encuentra tu proceso de asistencia graduada.",
        url: ROUTES.ASSISTANCE_APPLIED_LIST,
      },
    ],
  },
];

export const graduateData = [
  {
    title: "Tesis de posgrado",
    url: "posgrado",
    icon: ScrollText,
    isActive: false,
    items: [
      {
        Icon: FileText,
        title: "Consultar temas",
        description:
          "Aquí puedes ver las tesis disponibles y aplicar a la que te interese.",
        url: ROUTES.POSTGRADUATE_THESIS_LIST,
      },
      {
        Icon: PenSquare,
        title: "Ver estado de aplicación",
        description: "Aquí puedes ver los detalles de tu inscripción a tesis.",
        url: ROUTES.POSTGRADUATE_THESIS_STATUS,
      },
      {
        Icon: Calendar,
        title: "Consultar fechas",
        description:
          "Aquí puedes consultar las fechas importantes del proceso.",
        url: ROUTES.POSTGRADUATE_THESIS_DATES,
      },
    ],
  },
  {
    title: "Asistencia graduada",
    url: "asistencia",
    icon: School,
    items: [
      {
        Icon: BookOpen,
        title: "Ver asistencias disponibles",
        description:
          "Aquí puedes ver las asistencias disponibles y aplicar a estas.",
        url: ROUTES.ASSISTANCE_LIST,
      },
      {
        Icon: PenSquare,
        title: "Ver estado de inscripción",
        description:
          "Consulta como se encuentra tu proceso de asistencia graduada.",
        url: ROUTES.ASSISTANCE_APPLIED_LIST,
      },
    ],
  },
];

export const professorData = [
  {
    title: "Proyecto de pregrado",
    url: "pregrado",
    icon: GraduationCap,
    items: [
      {
        Icon: FileText,
        title: "Publicar y consultar proyectos de pregrado",
        description:
          "Aquí puedes publicar y consultar los proyectos de grado activos.",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_LIST,
      },
      {
        Icon: PenSquare,
        title: "Consultar histórico proyectos de grado",
        description: "Aqui puedes ver los proyectos de grado que han existido.",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_HISTORY,
      },
      {
        Icon: Calendar,
        title: "Consultar fechas",
        description:
          "Aquí puedes consultar las fechas importantes del proceso.",
        url: ROUTES.PROFESSOR_UNDERGRADUATE_THESIS_DATES,
      },
    ],
  },
  {
    title: "Proyecto de maestría",
    url: "postgrado",
    icon: School,
    items: [
      {
        Icon: FileText,
        title: "Publicar y consultar proyectos de maestría",
        description:
          "Aquí puedes publicar y consultar los proyectos de grado activos.",
        url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_LIST,
      },
      /*
      {
        Icon: PenSquare,
        title: "Consultar histórico tesis de maestría",
        description: "Aqui puedes ver las tesis de maestría que han existido.",
        url: ROUTES.PROFESSOR_POSTGRADUATE_THESIS_HISTORY,
      }, */
      {
        Icon: Calendar,
        title: "Consultar fechas",
        description:
          "Aquí puedes consultar las fechas importantes del proceso.",
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
        Icon: BookOpen,
        title: "Ver asistencias publicadas",
        description:
          "Aqui puedes ver las asistencias publicadas y sus aplicantes.",
        url: ROUTES.PROFESSOR_ASSISTANCE_LIST,
      },
      {
        Icon: PenSquare,
        title: "Crear oferta",
        description: "Crea oferta de asistencia graduada",
        url: ROUTES.PROFESSOR_NEW_ASSISTANCE,
      },
    ],
  },
  {
    title: "Monitores",
    url: "monitores",
    icon: BookOpen,
    items: [
      {
        Icon: BookOpen,
        title: "Consultar monitores",
        description:
          "Aquí puedes consultar los monitores de los distintos cursos.",
        url: ROUTES.PROFESSOR_TEACHING_ASSISTANCE_LIST,
      },
    ],
  },
];

export const coordinatorData = [
  {
    title: "Configuración del semestre",
    url: "configuracion",
    icon: FileText,
    items: [
      {
        Icon: FileText,
        title: "Consultar programas de clases",
        description: "Aquí puedes ver los programas de clases por periodo.",
        url: ROUTES.COURSE_PROGRAMS,
      },
      {
        Icon: PenSquare,
        title: "Consultar cargas de notas",
        description:
          "Aquí puedes ver la carga de notas de los distintos cursos.",
        url: ROUTES.GRADE_LOAD,
      },
      {
        Icon: Calendar,
        title: "Administrar cartelera",
        description:
          "Aquí puedes administrar la cartelera de los distintos periodos.",
        url: ROUTES.BULLETIN_BOARD,
      },
    ],
  },
  {
    title: "Alertas y reportes",
    url: "alertas",
    icon: FileBarChart,
    items: [
      {
        Icon: BookOpen,
        title: "Generar reportes",
        description:
          "Aquí puedes generar reportes de las distintas actividades.",
        url: ROUTES.REPORTS,
      },
      {
        Icon: PenSquare,
        title: "Alerta de fechas",
        description: "Aqui puedes generar alertas de fechas importantes.",
        url: ROUTES.DATE_ALERTS,
      },
    ],
  },
  {
    title: "Monitores",
    url: "monitores",
    icon: BookOpen,
    items: [
      {
        Icon: AlertTriangle,
        title: "Cargar archivo",
        description:
          "Carga un archivo con los monitores de los distintos cursos.",
        url: ROUTES.UPLOAD_TAS,
      },
    ],
  },
];

export const supportData = [
  {
    title: "Ayuda",
    url: "soporte",
    icon: HelpCircle,
    items: [
      {
        Icon: AlertTriangle,
        title: "Reporte de incidencias",
        description: "Reporta cualquier problema que tengas con la plataforma.",
        url: ROUTES.SUPPORT_INCIDENCE,
      },
      {
        Icon: Video,
        title: "Tutoriales",
        description:
          "Aquí puedes ver tutoriales para aprender a usar la plataforma.",
        url: ROUTES.SUPPORT_TUTORIALS,
      },
      {
        Icon: Headphones,
        title: "Contactar a coordinadores",
        description:
          "Aquí puedes contactar a los coordinadores de la plataforma.",
        url: ROUTES.SUPPORT_CONTACT,
      },
    ],
  },
];
