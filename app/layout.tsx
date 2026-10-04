import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Ghalyah Health - غالية هيلث",
  description: "متابعة أدوية الأم",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}