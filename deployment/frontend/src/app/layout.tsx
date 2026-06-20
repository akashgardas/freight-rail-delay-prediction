import type { Metadata } from "next";
import "./globals.css";
import CommandCenterShell from "@/components/CommandCenterShell";

export const metadata: Metadata = {
  title: "CargoETA - Freight Rail Operations Intelligence System",
  description: "Futuristic command-center logistics delay prediction portal powered by LightGBM and SHAP explainability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased">
        <CommandCenterShell>
          {children}
        </CommandCenterShell>
      </body>
    </html>
  );
}
