import { sampleData } from "./sampleData";

const headers = [
  "CÓDIGO",
  "NUM. CONT.",
  "MATERIA",
  "SECCIÓN",
];

const convertToCsv = () => {
  const csvRows: string[] = [];
  csvRows.push(headers.join(";"));
  sampleData.forEach(row => {
    const values = [
      row.studentCode,
      row.studentName,
      row.courseCode,
      row.sectionNumber,
    ];
    csvRows.push(values.join(";"));
  });
  return "\uFEFF" + csvRows.join("\n");
};

export function handleDownload() {
  const csvContent = convertToCsv();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "plantillaMonitores.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
