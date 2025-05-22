import { Course } from "../types/entities/course.type";
import { LeaderPerCourse } from "../types/leader-per-course.type";


export function mapCoursesToLeadersRow(courses: Course[]) {
    return courses.map((course) => mapCourseToLeaderRow(course))
}

function mapCourseToLeaderRow(course: Course): LeaderPerCourse {
    return {
        code: course.code,
        courseName: course.name,
        professorName: course.mainProfessor?.user?.name ?? "Sin asignar",
        email: course.mainProfessor?.user?.email ?? "Sin correo",
        courseId: course.id,
    }
}
