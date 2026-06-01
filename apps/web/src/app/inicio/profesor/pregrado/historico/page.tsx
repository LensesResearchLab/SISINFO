"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

import SpinnerPage from "@/components/shared/spinner-page";
import ErrorPage from "@/components/shared/error-page";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getProfessorProjectsHistory } from "@/app/services/project.service";
import { Project } from "@/app/types/entities/project.type";
import { getPeriods } from "@/app/services/period.service";

const ALL_PERIODS_OPTION = "all";

// Normalizes the period relation into the canonical YYYYSS code used across filters and queries.
function getProjectPeriodCode(project: Project): string | null {
  if (!project.period?.year || !project.period?.period) {
    return null;
  }

  const periodValue = `${project.period.period}`.padStart(2, "0");
  return `${project.period.year}${periodValue}`;
}

function getProjectPeriodLabel(project: Project): string {
  const code = getProjectPeriodCode(project);
  if (!code) {
    return "Sin período";
  }
  return `${code.slice(0, 4)}-${code.slice(4, 6)}`;
}

function formatPeriodLabel(periodCode: string): string {
  return `${periodCode.slice(0, 4)}-${periodCode.slice(4, 6)}`;
}

export default function ProfessorUndergraduateProjectsHistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ALL_PERIODS_OPTION);
  const hasInitialisedPeriod = useRef(false);

  const {
    data: projects,
    isFetching: isFetchingProjects,
    isError: isErrorProjects,
  } = useQuery<Project[]>({
    queryKey: ["projects-professor-history"],
    queryFn: async () => getProfessorProjectsHistory(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: periods,
    isFetching: isFetchingPeriods,
    isError: isErrorPeriods,
  } = useQuery<string[]>({
    queryKey: ["periods"],
    queryFn: getPeriods,
    staleTime: 10 * 60 * 1000,
  });

  const historicalProjects = useMemo(() => projects ?? [], [projects]);

  const periodOptions = useMemo(() => {
    const orderedPeriods = [...(periods ?? [])];
    orderedPeriods.sort((a, b) => b.localeCompare(a));
    return orderedPeriods;
  }, [periods]);

  useEffect(() => {
    if (!periodOptions.length) {
      return;
    }

    if (!hasInitialisedPeriod.current) {
      const stored = typeof window !== "undefined" ? localStorage.getItem("current_period") : null;
      if (stored && periodOptions.includes(stored)) setSelectedPeriod(stored);
      else setSelectedPeriod(periodOptions[0]);
      hasInitialisedPeriod.current = true;
      return;
    }

    if (
      selectedPeriod !== ALL_PERIODS_OPTION &&
      selectedPeriod &&
      !periodOptions.includes(selectedPeriod)
    ) {
      setSelectedPeriod(periodOptions[0]);
    }
  }, [periodOptions, selectedPeriod]);

  const filteredProjects = useMemo(() => {
    if (selectedPeriod === ALL_PERIODS_OPTION || !selectedPeriod) {
      return historicalProjects;
    }

    return historicalProjects.filter(
      (project) => getProjectPeriodCode(project) === selectedPeriod,
    );
  }, [historicalProjects, selectedPeriod]);

  // Aggregate summary metrics to highlight the scope of the filtered historical projects.
  const stats = useMemo(() => {
    const uniqueStudents = new Set<string>();
    const representedPeriods = new Set<string>();

    filteredProjects.forEach((project) => {
      project.students?.forEach((student) => uniqueStudents.add(student.id));
      const periodCode = getProjectPeriodCode(project);
      if (periodCode) {
        representedPeriods.add(periodCode);
      }
    });

    const totalStudents = uniqueStudents.size;
    const totalProjects = filteredProjects.length;
    const averageStudents = totalProjects
      ? filteredProjects.reduce((total, project) => total + (project.students?.length ?? 0), 0) /
        totalProjects
      : 0;

    return {
      totalProjects,
      totalStudents,
      representedPeriods: representedPeriods.size,
      averageStudents,
    };
  }, [filteredProjects]);

  const columns: ColumnDef<Project>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Tema del Proyecto",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{row.original.title}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.description}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Categoría",
      },
      {
        id: "period",
        header: "Período",
        accessorFn: (row) => getProjectPeriodLabel(row),
        cell: ({ row }) => (
          <span>{getProjectPeriodLabel(row.original)}</span>
        ),
      },
      {
        id: "areas",
        header: "Áreas de interés",
        accessorFn: (row) =>
          row.areasOfInterest?.map((area) => area.description).join(", ") ??
          "Sin áreas registradas",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.areasOfInterest?.length ? (
              row.original.areasOfInterest.map((area) => (
                <Badge key={`${row.original.id}-${area.description}`} variant="secondary">
                  {area.description}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Sin áreas registradas</span>
            )}
          </div>
        ),
      },
      {
        id: "students",
        header: "Estudiantes asignados",
        accessorFn: (row) =>
          row.students?.map((student) => student.user?.name ?? student.user?.email ?? student.id).join(", ") ??
          "Sin estudiantes",
        cell: ({ row }) => (
          row.original.students?.length ? (
            <ul className="space-y-1">
              {row.original.students.map((student) => (
                <li key={student.id} className="text-sm text-foreground">
                  <strong>{student.user?.name}</strong>
                  {student.user?.email ? (
                    <span className="block text-muted-foreground text-xs">{student.user.email}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-muted-foreground">Sin estudiantes asignados</span>
          )
        ),
      },
      {
        id: "quota",
        header: "Cupos utilizados",
        cell: ({ row }) => {
          const assigned = row.original.students?.length ?? 0;
          return (
            <span className="font-medium">{assigned} / {row.original.maxStudents}</span>
          );
        },
      },
    ],
    [],
  );

  if (isFetchingProjects || isFetchingPeriods) {
    return <SpinnerPage />;
  }

  if (isErrorProjects || isErrorPeriods) {
    return <ErrorPage />;
  }

  return (
    <section className="min-h-full mx-auto p-4 space-y-6 container max-w-[1200px]">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Histórico de proyectos de grado
        </h1>
        <p className="text-muted-foreground">
          Revisa los proyectos finalizados, los estudiantes que participaron y las áreas de investigación abordadas.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
            <CardDescription>Proyectos finalizados en el rango seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{stats.totalProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudiantes</CardTitle>
            <CardDescription>Participantes únicos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{stats.totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Períodos</CardTitle>
            <CardDescription>Períodos académicos representados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{stats.representedPeriods}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promedio de estudiantes</CardTitle>
            <CardDescription>Por proyecto finalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">
              {stats.averageStudents.toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Period filter moved into DataTable toolbar */}

      <div className="bg-card rounded-xl border shadow-sm p-4">
        <DataTable
          columns={columns}
          data={filteredProjects}
          toolbar={
            <div className="flex items-center gap-3">
              <Select
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
                disabled={!periodOptions.length}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PERIODS_OPTION}>Todos los períodos</SelectItem>
                  {periodOptions.map((period) => (
                    <SelectItem key={period} value={period}>
                      {formatPeriodLabel(period)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>
    </section>
  );
}
