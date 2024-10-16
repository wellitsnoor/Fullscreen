import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fullscreen",
  description: "Better Spotify Fullscreen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}