import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "react-hot-toast";
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
        <ErrorBoundary>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
