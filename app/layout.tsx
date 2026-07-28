import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "ProGaming — компьютерный клуб в Уфе",
  description:
    "Игровые зоны с мощными ПК, мониторами до 360 Гц и круглосуточной атмосферой в центре Уфы.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
