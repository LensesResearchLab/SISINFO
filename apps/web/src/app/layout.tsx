import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sisinfo",
  description: "Sisinfo es una plataforma de la Universidad de los Andes que facilita la gestión de proyectos de grado y asistencias graduadas.",
  openGraph: {
    title: "Sisinfo",
    description: "Realiza la gestión de tus proyectos de grado y asistencias graduadas de manera sencilla y rápida.",
    url: "https://github.com/TheSoftwareDesignLab/SISINFO/",
    siteName: "Sisinfo",
    images: [
      {
        url: "https://scontent.fbog2-5.fna.fbcdn.net/v/t39.30808-6/297323250_589978219193076_2690231843446515941_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH3fWKc2ZM4HjRPAtzFtuxevAotqySt5Ua8Ci2rJK3lRm668SEMshHEq30dPNzzcza67Dy2nNeGxABwpYwRrnwL&_nc_ohc=lkd-dIfjPSgQ7kNvgE7SzDv&_nc_oc=AdgM5AC9vN1_BImmA5BABIhVGosvFACqhZxS0pgPRpiWEKEmY7hgrkwWlMY58mVkSCvV_i6hdBBrh3NcvIYaVad3&_nc_zt=23&_nc_ht=scontent.fbog2-5.fna&_nc_gid=A2q9D91gkYL_5ZYbrM0AT1Y&oh=00_AYD6yU9qHdvaPBRj2vUDYGdWFjGjE00wyv19JiR64_GfPw&oe=67CD304C",
        alt: "Sisinfo",
      },
    ],
    locale: "es_CO",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
