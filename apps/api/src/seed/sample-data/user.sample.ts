import { CreateUserDto } from '../../users/dto/create-user.dto';

export const sampleUser: CreateUserDto[] = [
  {
    name: 'Camilo Escobar',
    email: 'caev@uniandes.edu.co',
    password: 'PROFESSOR1',
  },
  {
    name: 'Mario Linares',
    email: 'ml@uniandes.edu.co',
    password: 'PROFESSOR2',
  },
  {
    name: 'Daniel Diaz',
    email: 'dd@uniandes.edu.co',
    password: 'TA1',
  },
  {
    name: 'Jorge Bustamante',
    email: 'jb@uniandes.edu.co',
    password: 'TA2',
  },
  {
    name: 'Nicolás Camargo',
    email: 'nc@uniandes.edu.co',
    password: 'TA3',
  },
];
