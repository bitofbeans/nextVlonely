import "./globals.css";
import type { Metadata } from "next";
import localFont from 'next/font/local'
import Nav from "./components/NavBar";

const harmondSemiBld = localFont({
  src: [
    {
      path: "./fonts/Harmond-bold.otf",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/Harmond-normal.otf",
      weight: "400",
      style: "normal"
    },
  ],
  variable: "--font-harmond"
});

export const metadata: Metadata = {
  title: "vlonelyandfriends",
  description: "vlonelyandfriends info website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${harmondSemiBld.className} h-full antialiased`}
    >
      <body className="min-h-full min-w-full">
        <Nav />
        <main className="flex flex-1 justify-center items-center w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
