import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cooking by Lea",
  description: "Cooking by Lea est un blog de recettes proposant une grande variété de plats, y compris des options saines, pour satisfaire tous les goûts et régimes alimentaires. Explorez des guides étape par étape et des images vibrantes pour inspirer votre prochaine création culinaire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
