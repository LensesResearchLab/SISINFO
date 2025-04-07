"use client";
import { getProjectApplicationsReport } from "@/app/services/project-application.service";
import { ProjectReport } from "@/app/types/project.type"
import SpinnerPage from "@/components/shared/spinner-page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";


export default function UndergraduateProjectsReport() {
    return (
      <div className="container mx-auto py-10 px-8">
        <ProjectsReportList />
      </div>
    )
  }

function ProjectsReportList() {
    const [data, setData] = useState<ProjectReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getProjectApplicationsReport();
            setData(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }, []);

    if (isLoading) {
      return <SpinnerPage />;
    }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-core-highlight">
            <TableCell className="border-r text-center font-medium text-white" colSpan={3}>
              Estudiante
            </TableCell>
            <TableCell className="border-r text-center font-medium text-white" colSpan={2}>
              Asesor
            </TableCell>
            <TableCell className="border-r text-center font-medium text-white" colSpan={2}>
            Información Académica
            </TableCell>
          </TableRow>
          <TableRow className="bg-core">
            <TableHead className="border-r text-white">Código</TableHead>
            <TableHead className="border-r text-white">Nombres y apellidos</TableHead>
            <TableHead className="border-r text-white">Correo</TableHead>
            <TableHead className="border-r text-white">Nombres y apellidos</TableHead>
            <TableHead className="border-r text-white">Correo</TableHead>
            <TableHead className="border-r text-white">Tema Tesis</TableHead>
            <TableHead className="border-r text-white">Estado Tesis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => (
            <TableRow key={project.student_code} className="bg-white">
              <TableCell className="border-r font-medium">{project.student_code}</TableCell>
              <TableCell className="border-r">{project.student_name}</TableCell>
              <TableCell className="border-r">{project.student_email}</TableCell>
              <TableCell className="border-r">{project.professor_name}</TableCell>
              <TableCell className="border-r">{project.professor_email}</TableCell>
              <TableCell className="border-r">{project.project_title}</TableCell>
              <TableCell className="border-r">{project.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}




