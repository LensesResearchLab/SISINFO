import { User } from "./user.type";

export interface Professor {
  id: string;
  isActive: boolean;
  user: User
}