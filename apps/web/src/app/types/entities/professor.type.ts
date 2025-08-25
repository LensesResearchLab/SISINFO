import { CreateUser, User } from "./user.type";

export interface Professor {
  id: string;
  isActive: boolean;
  user: User
}

export interface ProfessorCreate {
  user: CreateUser;
}