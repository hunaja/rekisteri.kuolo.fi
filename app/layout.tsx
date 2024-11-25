import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Osoiteluettelo",
  description: "KuoLO Ry:n osoiteluettelo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.className} h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
