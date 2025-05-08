import { Student } from "./entities/student.type"

export type Application = {
    id: string
    motivation: string
    wasContacted: boolean
    status: string
    student: Student
}