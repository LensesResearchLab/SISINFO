import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import Logo from "assets/uniandes_logo.svg";
import { Link } from "react-router-dom";


/**
 * SisinfoHeaderLogo Component
 * 
 * This component renders the header logo for the SISINFO sidebar.
 * It includes a link to the homepage, displaying the Uniandes logo and the text "SISINFO".
 * 
 * @returns {JSX.Element} The SISINFO header logo component
 */
export default function SisinfoHeaderLogo() {
  return (
    <SidebarMenu className="bg-sky-950 py-4">
      <SidebarMenuItem>
        <Link to="/">
          <div className="flex items-center justify-center mx-auto">
            <img src = {Logo} alt="Uniandes Logo" className="h-8 mx-3" />
            <span className="truncate font-semibold text-lg ">
              | SISINFO
            </span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}