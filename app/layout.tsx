import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} Darbo valandos`,
    template: `%s | ${APP_NAME}`,
  },
  description: "Statybų darbo valandų apskaita su savaitinėmis PDF ataskaitomis.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1f6b57",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
