import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NJ & NY Lottery Predictor — For Fun Only",
  description: "NJ and NY lottery number predictions based on frequency analysis. For entertainment only.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
