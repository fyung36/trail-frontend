import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/index.scss";
import "./globals.scss";

import StyledComponentsRegistry from "@/lib/AntdRegistry";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Trail",
  description: "Monitoring and evaluation app",
  icons: {
    icon: "/assets/logo_black.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ReactQueryProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
