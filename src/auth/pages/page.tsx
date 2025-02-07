import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import Logo from "assets/uniandes_logo.svg";
import SistemasBanner from "assets/banner_sistemas.png";
import Footer from 'components/custom/footer';



export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex flex-grow ">
        <div className="grid lg:grid-cols-2 w-screen">
          <div className="flex items-center justify-center bg-white">
              <LogInForm/>
          </div>
          <div className="bg-[#0A626A] justify-center items-center hidden lg:flex">
            <SisinfoBanner />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function LogInForm() {
  const handleSubmit = (e: React.FormEvent) => {
    alert("Successful");
    e.preventDefault();
  }

  return (
    <form className="border rounded-xl shadow-lg w-10/12 md:w-8/12 px-6 py-10 h-4/6  flex flex-col justify-center">
      <img src={SistemasBanner} alt="Sistemas Logo" className="h-24 mx-auto mb-10" />
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="user">Usuario uniandes</Label>
          <Input id="user" type="text" placeholder="Ingresa tu usuario" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" placeholder="Ingresa tu contraseña" required />
        </div>
        <div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Iniciar Sesion
          </Button>
        </div>

      </div>
    </form>
  )
}

function SisinfoBanner() {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-white">
      <h1 className="text-6xl md:text-8xl font-bold mb-8">SISINFO</h1>
      <div>
        <img src={Logo} alt="Uniandes Logo" className="h-96" />
      </div>
    </div>
  )
}