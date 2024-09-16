import type { Metadata } from "next";
import React from "react";
import {fonts} from "@/components/fonts";
import {Providers} from "@/components/providers";

export const metadata: Metadata = {
  title: "Risk With Friends",
  description: "An asynchronous game of risk between friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fonts.rubik.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
