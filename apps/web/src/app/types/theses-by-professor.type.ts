import { Thesis } from "./entities/thesis.type";

export type ThesesStudentTable = {
  [professorIdentifier: string]: Thesis[];
};

