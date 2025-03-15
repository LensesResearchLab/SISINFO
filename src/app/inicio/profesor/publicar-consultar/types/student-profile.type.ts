export interface Student {
    id: number;
    name: string;
    email: string;
    profile: string;
    advisor: string;
    thesis1: string;
    thesis2: string;
    state: string;
    courses: Course[];
    others: Course[];
}

export interface Course {
    id: number;
    name: string;
    period: string;
}