import { User } from "./user.type";

export interface Student {
    id:string;
    user: User;
    isUndergraduate: boolean;
    code: string;
}
