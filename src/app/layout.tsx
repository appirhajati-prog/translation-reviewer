import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}