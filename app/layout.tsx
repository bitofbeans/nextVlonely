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

function Footer() {
    return (
        <div className='mt-5 grid grid-cols-5 w-full text-s place-items-center '>
            <div className="col-start-3 min-w-max">
                website by <a className="pl-1 underline decoration-1 underline-offset-2 text-blue-400" href="https://bitbeans.me">bitbeans</a>
            </div>
            <div className='w-full flex justify-end col-start-5'>
                <a className="text-xl text-white/25 p-2" href="/admin">log-in</a>
            </div>
        </div>
    )
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${harmondSemiBld.variable} ${elgoc.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-full overflow-x-hidden">
        <Nav />
        <main className="flex flex-col flex-1 justify-center items-center w-full">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
