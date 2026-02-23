import ThesisDates from "@/app/inicio/posgrado/tesis/fechas/page";

/**
 * @module ThesisDatesProfessor
 * @description
 * Este componente actúa como un wrapper reutilizable que encapsula la vista `ThesisDates`,
 * permitiendo su visualización dentro del panel de profesores.
 * 
 * @component
 * @returns {JSX.Element} Renderiza el componente `ThesisDates` dentro de un contenedor estilizado.
 * 
 * @example
 * // Renderiza la vista de fechas de tesis para profesores
 * <ThesisDatesProfessor />
 * 
 * @remarks
 * Este componente no altera la lógica del componente `ThesisDates`, simplemente lo contextualiza
 * para uso en la interfaz de profesores. Asegura consistencia visual y estructural.
 * 
 * @see {@link ThesisDates} para la lógica principal de visualización de fechas de tesis.
 */


export default function ThesisDatesProfessor() {
  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <ThesisDates />
    </div>
  );
}
