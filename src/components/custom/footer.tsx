/**
 * Footer Component
 * 
 * This component renders the footer section of the application.
 * It includes the university's name, recognition details, address, phone numbers, and copyright information.
 * 
 * @returns {JSX.Element} The footer component
 */
export default function footer() {
  return (
    <footer className="bg-stone-900 text-center text-xs p-4">
      <div className="text-gray-400 text-xs">
        Universidad de los Andes | Vigilada Mineducación <br />
        Reconocimiento como Universidad: Decreto 1297 del 30 de mayo de 1964. <br />
        Reconocimiento personería jurídica: Resolución 28 del 23 de febrero de 1949 Minjusticia <br />
        Edificio Mario Laserna Cra 1Este No 19A - 40 Bogotá (Colombia) | Tel: +57 601 3394949 Ext: 2860, 2861, 2862 | Fax: +57 601 3324325 <br />
        © 2025 - Departamento de Ingeniería de Sistemas y Computación <br />
      </div>
    </footer>
  )
}