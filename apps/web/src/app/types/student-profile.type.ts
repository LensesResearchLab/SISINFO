import { ThesisApplication } from "./entities/thesis-application.type";
import { Thesis } from "./entities/thesis.type";
import { User } from "./entities/user.type";


export interface Student {
    id: number;
    user: User;
    profile: string; // Not used for the moment
    thesis1: Thesis; // Not used for the moment
    thesis2: Thesis; // Not used for the moment
    thesisApplication: ThesisApplication;
    courses: Course[];
    others: Course[];
}

export interface Course {
    id: number;
    name: string;
    period: string;
}