/**
 * Application Routes
 *
 * This constant defines all the routes used in the application, organized by user role.
 * The routes are stored as key-value pairs where the key is a descriptive name
 * and the value is the actual URL path.
 *
 * Structure:
 * - Home route
 * - Student routes (thesis management, graduate assistance, support)
 * - Professor routes (undergraduate/postgraduate thesis, assistance management)
 * - Coordinator routes (academic administration)
 */
export const ROUTES: Record<string, string> = {
  HOME: "/inicio",

  /*  Student  */

  UNDERGRADUATE_THESIS_LIST: "/pregrado/tesis/lista",
  UNDERGRADUATE_THESIS_STATUS: "/pregrado/tesis/estado",
  UNDERGRADUATE_THESIS_DATES: "/pregrado/tesis/fechas",

  ASSISTANCE_LIST: "/estudiante/asistencia/lista",
  ASSISTANCE_APPLIED_LIST: "/estudiante/asistencia/lista_aplicadas",

  SUPPORT_INCIDENCE: "/soporte/incidencia",
  SUPPORT_TUTORIALS: "/soporte/tutoriales",
  SUPPORT_CONTACT: "/soporte/contacto",

  /* Graduate Student */

  POSTGRADUATE_THESIS_LIST: "/posgrado/tesis/lista",
  POSTGRADUATE_THESIS_STATUS: "/posgrado/tesis/estado",
  POSTGRADUATE_THESIS_DATES: "/posgrado/tesis/fechas",

  /*  Professor  */
  APPLICANTS: "aplicantes",

  PROFESSOR_UNDERGRADUATE_THESIS_LIST: "/profesor/pregrado/lista",
  PROFESSOR_UNDERGRADUATE_THESIS_NEW: "/profesor/pregrado/nuevo",
  PROFESSOR_UNDERGRADUATE_THESIS_HISTORY: "/profesor/pregrado/historico",
  PROFESSOR_UNDERGRADUATE_THESIS_DATES: "/profesor/pregrado/fechas",

  PROFESSOR_POSTGRADUATE_THESIS_LIST: "/profesor/maestria/lista",
  PROFESSOR_POSTGRADUATE_THESIS_NEW: "/profesor/maestria/nuevo",
  PROFESSOR_POSTGRADUATE_THESIS_HISTORY: "/profesor/maestria/historico",
  PROFESSOR_POSTGRADUATE_THESIS_DATES: "/profesor/maestria/fechas",
  PROFESSOR_POSTGRADUATE_THESIS_STUDENT: "/profesor/maestria/estudiante",

  PROFESSOR_ASSISTANCE_LIST: "/profesor/asistencias/lista",
  PROFESSOR_ASSISTANCE_LIST_EDIT: "profesor/asistencias/lista/manejar",
  PROFESSOR_ASSISTANCE_LIST_EDIT_ID:
    "profesor/asistencias/lista/manejar/editar",
  PROFESSOR_NEW_ASSISTANCE: "/profesor/asistencias/nueva",

  PROFESSOR_TEACHING_ASSISTANCE_LIST: "/profesor/monitores/",

  /*  Coordinators  */

  COURSE_PROGRAMS: "/coordinador/programas/lista",
  GRADE_LOAD: "/coordinador/carga_notas",
  BULLETIN_BOARD: "/coordinador/cartelera",

  REPORTS: "/coordinador/reportes",
  DATE_ALERTS: "/coordinador/alertas_fechas",

  UPLOAD_TAS: "/coordinador/monitores",

  /*  General  */

  TASK_LIST: "/tareas",
};

export const API_ROUTES: Record<string, string> = {
  BASE: "http://localhost:8000/api",
  PERIODS: "periods",
  ASSISTANCE_APPLICATIONS: 'assistance-applications',
  COURSES:'courses',
  COORDINATOR_BILLBOARD:'billboards',
  TASKS:'tasks',

  TEACHING_ASSISTANTS: 'teaching-assistances',
  PROFESSORS: 'professors',
  SECTIONS_REPORTS: "sections",
  INCIDENCES: "incidences",
  COORDINATORS: "coordinators",
};
