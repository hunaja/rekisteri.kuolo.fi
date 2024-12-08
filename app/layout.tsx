import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { fiFI } from "@clerk/localizations";

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
    <ClerkProvider localization={fiFI}>
      <html lang="en" className="h-full">
        <body className={`${roboto.className} h-full`}>
          <Providers>
            <SignedOut>{children}</SignedOut>
            <SignedIn>{children}</SignedIn>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
