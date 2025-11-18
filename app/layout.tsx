import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DONA+ | Plataforma de Gestión de Donaciones",
  description: "Conectando donantes con beneficiarios a través de empresas de transporte",
  keywords: "donaciones, transporte, solidaridad, República Dominicana, logística",
  authors: [{ name: "DONA+" }],
  openGraph: {
    title: "DONA+ | Plataforma de Gestión de Donaciones",
    description: "Conectando donantes con beneficiarios a través de empresas de transporte",
    url: "https://dona.sujeto10.com",
    siteName: "DONA+",
    locale: "es_DO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
