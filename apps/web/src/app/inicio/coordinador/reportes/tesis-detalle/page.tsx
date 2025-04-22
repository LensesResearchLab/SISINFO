"use client";
import { getThesisApplicationsReport } from "@/app/services/thesis.service";
import { ThesisReport } from "@/app/types/thesis.type";
import SpinnerPage from "@/components/shared/spinner-page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

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
    <div className="min-h-full min-w-full p-10">
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

        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {data.map((thesis) => (
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
                      <p className="font-medium">{thesis.student_email}</p>
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
                      <p className="font-medium">{thesis.professor_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Correo:</p>
                      <p className="font-medium">{thesis.professor_email}</p>
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
                        Subárea de Investigación:
                      </p>
                      <p className="font-medium">
                        {thesis.thesis_investigation_subarea}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Semestre de iniciación del proyecto:
                      </p>
                      <p className="font-medium">
                        {thesis.thesis_period.period}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Calificación:</p>
                      <p className="font-medium">
                        {thesis.thesis_grade || "No disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
