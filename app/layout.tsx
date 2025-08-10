import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kits Temáticos Únicos para Cada Ocasión | LaSuerteEsLoca",
  description:
    "Descubre kits diseñados para sorprender en adolescentes, baby showers, despedidas, casamientos y para levantar el ánimo. Regalos con personalidad, creatividad y cariño que conectan y emocionan.",

  keywords: [
    "kits temáticos", "kits para adolescentes", "kits baby shower", "kits despedida de soltero",
    "kits casamiento", "kits levanta ánimo", "regalos originales", "kits para fiestas",
    "kits personalizados", "regalos para ocasiones especiales"
  ],

  authors: [
    { name: "Fernando Alfaro", url: "https://lasuerteloca.netlify.app/" }
  ],

  openGraph: {
    title: "Kits Temáticos Únicos para Cada Ocasión | LaSuerteEsLoca",
    description:
      "Explora nuestra colección de kits especiales para todas las ocasiones: adolescentes, baby showers, despedidas, casamientos y más. Regala alegría y recuerdos inolvidables.",
    url: "https://lasuerteloca.netlify.app/products",
    siteName: "Tu Tienda Online",
    images: [
      {
        url: "https://lasuerteloca.netlify.app/LaSuerteEsLoca.png", // Cambiar a una imagen representativa real
        width: 1200,
        height: 630,
        alt: "Kits Temáticos para Todas las Ocasiones",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kits Temáticos Únicos para Cada Ocasión | LaSuerteEsLoca",
    description:
      "Regalos con personalidad para adolescentes, baby showers, despedidas y casamientos. Sorprende con nuestros kits originales y llenos de cariño.",
    site: "@tu_twitter", // Cambia por tu cuenta
    creator: "@tu_twitter",
    images: ["https://lasuerteloca.netlify.app/LaSuerteEsLoca.png"],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: "url('/1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <CartProvider>
          <Navbar />
          {children}
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
