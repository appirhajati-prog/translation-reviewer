import type { Metadata } from "next";
import { Vazirmatn, Inter } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نقد و بررسی ترجمه کتاب",
  description: "مقایسه ترجمه‌های مختلف کتاب‌ها، امتیازدهی و انتخاب بهترین ترجمه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className={`${vazirmatn.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}