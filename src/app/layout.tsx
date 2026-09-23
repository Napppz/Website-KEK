import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "KEK Indonesia — Portal Informasi & Investasi Kawasan Ekonomi Khusus",
    template: "%s | KEK Indonesia",
  },
  description:
    "Portal informasi resmi Kawasan Ekonomi Khusus (KEK) Indonesia. Dapatkan informasi kawasan, peluang investasi, insentif fiskal, berita, dan regulasi JDIH.",
  keywords: [
    "KEK Indonesia",
    "Kawasan Ekonomi Khusus",
    "Special Economic Zones",
    "Investasi Indonesia",
    "Insentif Pajak KEK",
    "Dewan Nasional KEK",
    "JDIH KEK",
  ],
  authors: [{ name: "Sekretariat Dewan Nasional KEK Indonesia" }],
  openGraph: {
    title: "KEK Indonesia — Portal Informasi & Investasi Kawasan Ekonomi Khusus",
    description:
      "Portal informasi resmi Kawasan Ekonomi Khusus (KEK) Indonesia. Akselerasi investasi dan pertumbuhan ekonomi regional.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakartaSans.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900">
        {children}
      </body>
    </html>
  );
}
