import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Madrasa Québec — apprendre en famille",
  description: "Un espace simple pour apprendre, suivre la progression et construire une communauté.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
