import { User } from "./user.type";

export interface Coordinator {
    user: User;
    office: string;
    email: string;
    extension: string;
    photo: string;
}