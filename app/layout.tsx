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
  variable: "--font-harmond-local"
});

const elgoc = localFont({
  src: [
    {
      path: "./fonts/Elgoc.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/Elgoc-bold.otf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-elgoc-local"
});


export const metadata: Metadata = {
  title: "vlonelyandfriends",
  description: "vlonelyandfriends info website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${harmondSemiBld.variable} ${elgoc.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-full">
        <main className="flex flex-col flex-1 justify-center items-center w-full">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}