import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo-Brut Tipjar",
  description: "Tip Jar with Neo-Brutalism style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
