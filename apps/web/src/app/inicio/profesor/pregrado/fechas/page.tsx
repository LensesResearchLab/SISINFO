/**
 * @file ThesisDatesProfessor.tsx
 * @description Wrapper component for rendering the undergraduate thesis calendar for professors.
 * This component simply imports and displays the shared <ThesisDates /> component used in the undergraduate thesis module.
 * 
 * @author 
 * @created [Date]
 * @version 1.0
 */

"use client";

import ThesisDates from "@/app/inicio/pregrado/tesis/fechas/page";

/**
 * @component ThesisDatesProfessor
 * @description Displays the thesis dates component for professors. It wraps the shared `<ThesisDates />` calendar view.
 * This container ensures the layout is responsive and consistent within the professor dashboard.
 * 
 * @returns {JSX.Element} Rendered component inside a centered container
 */
export default function ThesisDatesProfessor() {
  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <ThesisDates />
    </div>
  );
}
