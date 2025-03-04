"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import Footer from '@/components/shared/footer';

/**
 * Main Login page component
 * 
 * Renders the login page with a two-column layout on large screens:
 * - Left column contains the login form
 * - Right column contains the SISINFO banner (only visible on lg screens)
 * Also includes a footer at the bottom
 * 
 * @returns {JSX.Element} The login page component
 */
export default function Login() {
  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex flex-grow ">
        <div className="grid lg:grid-cols-2 w-screen">
          <div className="flex items-center justify-center bg-white py-5">
              <LogInForm/>
          </div>
          <div className="bg-sky-800 justify-center items-center hidden lg:flex">
            <SisinfoBanner />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

/**
 * Login form component
 * 
 * Renders a form with:
 * - Systems department banner
 * - Username input field
 * - Password input field
 * - Submit button
 * 
 * @returns {JSX.Element} The login form component
 */
function LogInForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Successful")
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-xl shadow-lg w-full max-w-md p-10 space-y-12">
      <div className="text-center">
        <Image 
          src={"/banner_sistemas.png"} 
          alt="Sistemas Logo" 
          width={350}
          height={160}
          className="mx-auto mb-8 " 
        />
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="user" className="text-lg">
            Usuario uniandes
          </Label>
          <Input id="user" type="text" placeholder="Ingresa tu usuario" required className="h-12 text-lg" />
        </div>
        <div className="space-y-4">
          <Label htmlFor="password" className="text-lg">
            Contraseña
          </Label>
          <Input id="password" type="password" placeholder="Ingresa tu contraseña" required className="h-12 text-lg" />
        </div>
        <Button type="submit" className="w-full h-12 text-lg mt-6">
          Iniciar Sesion
        </Button>
      </div>
    </form>
  )
}

/**
 * SISINFO Banner component
 * 
 * Displays the SISINFO branding on the right side of the login page
 * Contains:
 * - Large SISINFO text
 * - Uniandes logo
 * 
 * @returns {JSX.Element} The SISINFO banner component
 */
function SisinfoBanner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-6xl md:text-8xl font-bold mb-8">SISINFO</h1>
      <div>
      <Image 
          src={"/uniandes_logo.svg"} 
          alt="Sistemas Logo" 
          width={384}
          height={384}
        />
      </div>
    </div>
  )
}