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
      <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      <body>
        {children}
      </body>
    </html>
  );
}