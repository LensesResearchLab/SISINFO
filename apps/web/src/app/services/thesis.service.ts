/*
const thesisList: { [professor: string]: Thesis[] } = {
  "Camilo Escobar": [
    {
      id: 1,
      title: "Titulo tesis 1",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Camilo Escobar",
    },
    {
      id: 2,
      title: "Titulo tesis 2",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Camilo Escobar",
    },
    {
      id: 3,
      title: "Titulo tesis 3",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Camilo Escobar",
    },
  ],
  "Mario Linares": [
    {
      id: 4,
      title: "Titulo tesis 4",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Linares",
    },
    {
      id: 5,
      title: "Titulo tesis 5",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Linares",
    },
    {
      id: 6,
      title: "Titulo tesis 6",
      category: "Empresa",
      description: "Descripcion tesis",
      email: "example@example.com",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Linares",
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
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Sandra Rueda",
    },
    {
      id: 8,
      title: "Titulo tesis",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Sandra Rueda",
    },
    {
      id: 9,
      title: "Titulo tesis",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Sandra Rueda",
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
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Sanchéz",
    },
    {
      id: 11,
      title: "Titulo tesis",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Sanchéz",
    },
    {
      id: 12,
      title: "Titulo tesis",
      description: "Descripcion tesis",
      email: "example@example.com",
      category: "Empresa",
      semester: "202510",
      students: [
        {
          id: 1,
          name: "John Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 2,
          name: "Jane Doe",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 3,
          name: "John Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
        {
          id: 4,
          name: "Jane Smith",
          status: "Inscrito",
          date: "30 de junio del 2025",
        },
      ],
      areas_of_interest: [
        "Software Engineering",
        "Software Architecture",
        "Software Maintenance",
      ],
      professor: "Mario Sanchéz",
    },
  ],
}; */

/* Undergraduate Thesis */
const API_URL = "http://localhost:8000/api/theses";
const API_URL_APPLICATIONS = "http://localhost:8000/api/thesis-applications";

export async function getPostgraduateThesis() {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisById(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

export async function getPostgraduateThesisStatus(document?: string) {
  const response = await fetch(`${API_URL_APPLICATIONS}/${document}`);
  if (!response.ok) {
    throw new Error("Failed to fetch graduated thesis data.");
  }
  return response.json();
}

// TODO: Delete this?
/*
export async function getUndergraduateThesis({
  semester,
  category,
}: {
  semester?: string;
  category?: string;
}) {
  if (category === "areas_of_interest") {
    return getUndergraduateThesisByArea(semester, category);
  }
  return getUndergraduateThesisByProfessor(semester, category);
}
// TODO: Delete this?
export async function getUndergraduateThesisByProfessor(
  semester?: string,
  category?: string
) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return thesisList;
}

// TODO: Delete this?
async function getUndergraduateThesisByArea(
  semester?: string,
  category?: string
) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const thesisPerField: { [field: string]: Thesis[] } = {};
  for (const thesis of Object.values(thesisList).flat()) {
    for (const field of thesis.areas_of_interest) {
      if (field in thesisPerField) {
        thesisPerField[field].push(thesis);
      } else {
        thesisPerField[field] = [thesis];
      }
    }
  }
  return thesisPerField;
}

// TODO: Delete this?
export async function getUndegraduadeThesisSemesters() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return ["202510", "202520", "202610", "202620"];
}

// TODO: Delete this?
export async function getUndergraduateThesisById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  for (const professor in thesisList) {
    const project = thesisList[professor].find(
      (project) => project.id === Number(id)
    );
    if (project) {
      return project;
    }
  }
  throw new Error("No se encontró el proyecto de grado");
}

// TODO: Delete this?
export async function getUndergraduateThesisDates() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    Inicio: [
      {
        title: "Entrega de propuesta",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de avance",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de producto final",
        date: "30 de junio del 2025",
      },
    ],
    Desarrollo: [
      {
        title: "Entrega de propuesta",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de avance",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de producto final",
        date: "30 de junio del 2025",
      },
    ],
    Pendiente: [
      {
        title: "Entrega de propuesta",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de avance",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de producto final",
        date: "30 de junio del 2025",
      },
    ],
    "Pendiente especial": [
      {
        title: "Entrega de propuesta",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de avance",
        date: "30 de junio del 2025",
      },
      {
        title: "Entrega de producto final",
        date: "30 de junio del 2025",
      },
    ],
  };
}
// TODO: Delete this?
export async function getThesisStatusInformation() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const status: StatusInformation = {
    semester: "202510",
    projectTitle: "Historias medicas",
    advisor: "Camilo Escobar",
    student: "John Doe",
    studentEmail: "john@example.com",
    grade: "Aprobado",
    lastStep: "Inscrito",
  };
  return status;
}

// TODO: Delete this?
export async function getThesisByProfessorId(professorId: number) {
  const professors = [
    "Camilo Escobar",
    "Mario Linares",
    "Sandra Rueda",
    "Mario Sanchéz",
  ];
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return thesisList[professors[professorId]];
} */

/* Posgraduate Report */
/* API GET for coordinators report of thesis */
const API_URL_REPORT =
  "http://localhost:8000/api/thesis-applications/thesis-report";
export async function getThesisApplicationsReport() {
  const response = await fetch(`${API_URL_REPORT}`);
  if (!response.ok) {
    throw new Error("Failed to fetch postgraduate data for report.");
  }
  return response.json();
}

/* API GET for coordinators report of thesis */
const API_URL_REPORT =
  "http://localhost:8000/api/thesis-applications/thesis-report";
export async function getThesisApplicationsReport() {
  const response = await fetch(`${API_URL_REPORT}`);
  if (!response.ok) {
    throw new Error("Failed to fetch undergraduate projects data for report.");
  }
  return response.json();
}
