import type { Metadata } from "next";
import { FirebaseInit } from "./FirebaseInit";
import "@/styles/globals.css";
import ReactQueryClientProvider from "../components/ReactQueryClientProvider";
import ToastProvider from "../components/ToastProvider";

export const metadata: Metadata = {
  title: "POS admin",
  description: "Socket + REST to POS service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>
          <ToastProvider />
          <FirebaseInit />
          {children}
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
