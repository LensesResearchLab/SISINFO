import { CreateUserDto } from '../../users/dto/create-user.dto';

export const sampleUser: CreateUserDto[] = [
  {
    document: 'PROFESSOR1',
    name: 'Camilo Escobar',
    email: 'caev@uniandes.edu.co',
    password: 'PROFESSOR1',
  },
  {
    document: 'PROFESSOR2',
    name: 'Mario Linares',
    email: 'ml@uniandes.edu.co',
    password: 'PROFESSOR2',
  },
  {
    document: 'TA1',
    name: 'Daniel Diaz',
    email: 'dd@uniandes.edu.co',
    password: 'TA1',
  },
  {
    document: 'TA2',
    name: 'Jorge Bustamante',
    email: 'jb@uniandes.edu.co',
    password: 'TA2',
  },
  {
    document: 'TA3',
    name: 'Nicolás Camargo',
    email: 'nc@uniandes.edu.co',
    password: 'TA3',
  },
];
