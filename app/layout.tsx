import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rowdy Room Mission Control",
  description: "AI operating system for Rowdy Room.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
