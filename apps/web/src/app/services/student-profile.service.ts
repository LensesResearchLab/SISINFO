import { Student } from "../types/student-profile.type";

const student: Student = {
  id: 1,
  name: "Pedro Duarte",
  email: "pedro@gmail.com",
  profile: "CSW",
  advisor: "Escobar Velasquez, Camilo Andrés",
  thesis1: "202420",
  thesis2: "202510",
  state: "Inscripción aprobada",
  courses: [
    {
      id: 1,
      name: "Tutorial de inscripción",
      period: "202420",
    },
    {
      id: 2,
      name: "Tutorial de inscripción",
      period: "202420",
    },
    {
      id: 3,
      name: "Tutorial de inscripción",
      period: "202420",
    },
    {
      id: 4,
      name: "Tutorial de inscripción",
      period: "202420",
    },
  ],
  others: [
    {
      id: 5,
      name: "Tutorial de inscripción",
      period: "202420",
    },
    {
      id: 6,
      name: "Tutorial de inscripción",
      period: "202420",
    },
  ],
};
export async function getCourses() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return student.courses;
}

export async function getCourseById(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const course = student.courses.find((course) => course.id === id);
  if (course) {
    return course;
  }
  throw new Error("Course not found.");
}

export async function getStudent() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return student;
}
