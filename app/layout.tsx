import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Student portal for campus notifications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
