import { Thesis } from "./thesis.type";

export interface Student {
    id: number;
    name: string;
    email: string;
    profile: string;
    thesis1: Thesis;
    thesis2: Thesis;
    state: string;
    courses: Course[];
    others: Course[];
}

export interface Course {
    id: number;
    name: string;
    period: string;
}