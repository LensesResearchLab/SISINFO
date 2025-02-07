import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import Logo from "assets/uniandes_logo.svg";
import { Link } from "react-router-dom";

/*
  This component is used to display the logo of the application in the top of the sidebar.
  Shows the logo of the university and the name of the application with a sky background.
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