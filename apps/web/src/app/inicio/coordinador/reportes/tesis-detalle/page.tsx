"use client";
import { getThesisApplicationsReport } from "@/app/services/thesis.service";

import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { ThesisReport } from "@/app/types/thesis-report.type";

/**
 * ThesisDetailedReport Component
 *
 * Renders a paginated, filterable list of thesis application cards for "Tesis 1",
 * with the ability to export the visible data into a stylized PDF (2 cards per page).
 *
 * Features:
 * - Search by student name, thesis subarea, and semester
 * - Pagination (4 cards per page)
 * - Dynamic generation of filtered results
 * - Export to landscape PDF using html2canvas and jsPDF
 *
 * Filters:
 * - Name (text input)
 * - Subarea (text input)
 * - Semester (dropdown derived from data)
 *
 * Export:
 * - Generates a 2-column layout per page using `html2canvas` snapshots of `.thesis-card` DOM nodes
 * - Adds generation date and page number to each sheet
 * - Final output is a downloadable PDF file with academic styling
 *
 * Technologies:
 * - React state and effects for data fetching and filtering
 * - Refs and DOM traversal for capturing rendered content
 * - html2canvas for element-to-image conversion
 * - jsPDF for structured PDF creation
 *
 * @returns {JSX.Element} Rendered UI with filters, cards, and export button
 */

export default function ThesisDetailedReport() {
  return (
    <div className="container mx-auto py-10 px-8">
      <ThesisDetailedCards />
    </div>
  );
}

function ThesisDetailedCards() {
  const [data, setData] = useState<ThesisReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // For search filters
  const [nameFilter, setNameFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [subareaFilter, setSubareaFilter] = useState('');

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  // Filter cards based on search
  const filteredData = data.filter(thesis => {
    const nameMatch = thesis.student_name.toLowerCase().includes(nameFilter.toLowerCase());
    const semesterMatch = !semesterFilter || `${thesis.thesis_period.year}-${thesis.thesis_period.period}` === semesterFilter;
    const subareaMatch = !subareaFilter || thesis.thesis_investigation_subarea.toLowerCase().includes(subareaFilter.toLowerCase());
    
    return nameMatch && semesterMatch && subareaMatch;
  });

  // Pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getThesisApplicationsReport();
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

  const downloadPDF = async () => {
    if (!cardsContainerRef.current) return;

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "letter",
      });

      const margin = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      const cards = cardsContainerRef.current.querySelectorAll(".thesis-card");
      const totalCards = cards.length;
      const cardsPerPage = 2;
      const totalPages = Math.ceil(totalCards / cardsPerPage);

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const today = new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        pdf.text(
          `Reporte generado el ${today}`,
          pdfWidth - margin - 60,
          margin
        );

        // Paginacion
        pdf.setFontSize(8);
        pdf.text(
          `Página ${pageNum + 1} de ${totalPages}`,
          pdfWidth / 2,
          pdfHeight - 5
        );

        // solo 2 cards por pagina
        for (let i = 0; i < cardsPerPage; i++) {
          const cardIndex = pageNum * cardsPerPage + i;
          if (cardIndex >= totalCards) break;

          const card = cards[cardIndex];

          const cardWidth = contentWidth / 2 - 5;
          const cardHeight = contentHeight - 20;
          const xPos = margin + i * (cardWidth + 10);
          const yPos = margin + 15;

          // Card a imagen
          const canvas = await html2canvas(card as HTMLElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            allowTaint: true,
          });

          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", xPos, yPos, cardWidth, cardHeight);
        }
      }

      pdf.save("reporte_tesis1_detalle.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-full min-w-full px-10 py-0">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-core">
              Maestría en Ingeniería: Sistemas y Computación
            </h2>
            <p className="text-gray-600 mt-1">
              Reporte detallado inscritos a tesis 1
            </p>
          </div>
          <Button
            onClick={downloadPDF}
            className="bg-core-highlight hover:bg-core text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
  
        {/* Search and filter section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nameSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por nombre
            </label>
            <input
              type="text"
              id="nameSearch"
              placeholder="Nombre del estudiante"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-core-highlight"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="subareaFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por subárea
            </label>
            <input
              type="text"
              id="subareaFilter"
              placeholder="Nombre de la subárea"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-core-highlight"
              value={subareaFilter}
              onChange={(e) => setSubareaFilter(e.target.value)}/>
          </div>  
          <div>
            <label htmlFor="semesterFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por semestre
            </label>
            <select
              id="semesterFilter"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-core-highlight"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="">Todos los semestres</option>
              {[...new Set(data.map(thesis => `${thesis.thesis_period.year}-${thesis.thesis_period.period}`))].map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>


        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {filteredData.slice(startIndex, endIndex).map((thesis) => (
            <div
              key={thesis.student_code}
              className="thesis-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="bg-core-highlight text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    Tema del Proyecto: {thesis.thesis_title}
                  </h3>
                  <p className="text-sm bg-white text-core-highlight px-2 py-1 rounded-md font-medium">
                    Estado: {thesis.status}
                  </p>
                </div>
              </div>
  
              <div className="p-5 grid grid-cols-1 gap-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-semibold text-core text-lg">
                      Estudiante
                    </h4>
                    <p className="text-sm text-gray-500">
                      Fecha: {new Date().toISOString().split("T")[0]}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500 text-sm">Carnet:</p>
                      <p className="font-medium">{thesis.student_code}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Correo:</p>
                      <p className="font-medium break-words">{thesis.student_email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 text-sm">
                        Nombres y Apellidos:
                      </p>
                      <p className="font-medium">{thesis.student_name}</p>
                    </div>
                  </div>
                </div>
  
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-core text-lg mb-3">
                    Asesor
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Nombres y Apellidos:
                      </p>
                      <p className="font-medium">
                        <a href={`mailto:${thesis.professor_email}`} className="text-core-highlight hover:underline">
                          {thesis.professor_name}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
  
                <div>
                  <h4 className="font-semibold text-core text-lg mb-3">
                    Información Académica
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Semestre de inicio del proyecto:
                      </p>
                      <p className="font-medium">
                      {thesis.thesis_period.year}-{thesis.thesis_period.period}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Calificación:</p>
                      <p className="font-medium">
                        {thesis.thesis_grade ?? "No disponible"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                  <p className="text-gray-500 text-sm">
                        Subárea de Investigación:
                      </p>
                      <p className="font-medium break-all">
                        {thesis.thesis_investigation_subarea}
                      </p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Paginacion */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            >
              Anterior
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${
                  currentPage === page 
                    ? 'bg-core-highlight text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
