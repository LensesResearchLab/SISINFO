import { StatusInformation, Thesis } from "undergraduateThesis/types/Thesis";

const thesis: {[professor: string]: Thesis[]} = {
    "Camilo Escobar": [
      {
        id: 1,
        title: "Titulo tesis",
        description: "Descripcion tesis",
        email: "example@example.com",
        category: "Empresa",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Camilo Escobar"
      },
      {
        id: 2,
        title: "Titulo tesis",
        description: "Descripcion tesis",
        email: "example@example.com",
        category: "Empresa",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Camilo Escobar"
      },
      {
        id: 3,
        title: "Titulo tesis",
        description: "Descripcion tesis",
        email: "example@example.com",
        category: "Empresa",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Camilo Escobar"
      },
    ],
    "Mario Linares": [
      {
        id: 4,
        title: "Titulo tesis",
        description: "Descripcion tesis",
        email: "example@example.com",
        category: "Empresa",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Mario Linares"
      },
      {
        id: 5,
        title: "Titulo tesis",
        description: "Descripcion tesis",
        email: "example@example.com",
        category: "Empresa",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Mario Linares"
      },
      {
        id: 6,
        title: "Titulo tesis",
        category: "Empresa",
        description: "Descripcion tesis",
        email: "example@example.com",
        semester: "202510",
        students: "4",
        areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
        professor: "Mario Linares"
      },
    ],
    "Sandra Rueda": [
        {
            id: 7,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Sandra Rueda"
        },
        {
            id: 8,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Sandra Rueda"
        },
        {
            id: 9,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Sandra Rueda"
        },
        
    ],
    "Mario Sanchéz": [
        {
            id: 10,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Mario Sanchéz"
        },
        {
            id: 11,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Mario Sanchéz"
        },
        {
            id: 12,
            title: "Titulo tesis",
            description: "Descripcion tesis",
            email: "example@example.com",
            category: "Empresa",
            semester: "202510",
            students: "4",
            areas_of_interest: ["Software Engineering", "Software Architecture", "Software Maintenance"],
            professor: "Mario Sanchéz"
        },
    ],
  }



export async function getUndergraduateThesis() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return thesis;
}

export async function getUndergraduateThesisById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    for (const professor in thesis) {
        const project = thesis[professor].find(project => project.id === Number(id));
        if (project) {
            return project;
        }
    }
    throw new Error("No se encontró el proyecto de grado"); 
}

export async function getUndergraduateThesisDates() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      "Inicio": [
        {
          "title": "Entrega de propuesta",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de avance",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de producto final",
          "date": "30 de junio del 2025"
        },
      ],
      "Desarrollo": [
        {
          "title": "Entrega de propuesta",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de avance",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de producto final",
          "date": "30 de junio del 2025"
        },
      ],
      "Pendiente": [
        {
          "title": "Entrega de propuesta",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de avance",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de producto final",
          "date": "30 de junio del 2025"
        },
      ],
      "Pendiente especial": [
        {
          "title": "Entrega de propuesta",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de avance",
          "date": "30 de junio del 2025"
        },
        {
          "title": "Entrega de producto final",
          "date": "30 de junio del 2025"
        },
      ]
    };
  
}


export async function getThesisStatusInformation() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const status: StatusInformation = {
      semester: "202510",
      projectTitle: "Historias medicas",
      advisor: "Camilo Escobar",
      student: "Estudiante",
      studentEmail: "Wilmer Arévalo",
      grade: "Aprobado",
      lastStep: "Inscrito",
    };
    return status
}
