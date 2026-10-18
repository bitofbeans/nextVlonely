import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image"
import localFont from 'next/font/local'
import Nav from "./components/NavBar";
import { EditModeProvider } from "./components/EditModeProvider";

// Caches the page for at least 10 minutes
// After that, when someone opens the page, it will be stale, but trigger a refresh
export const revalidate = 600;

/* 
  Website Fonts
 */
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
  metadataBase: new URL("https://vlonelyandfriends.vercel.app"),

  title: {
    default: "vlonely&friends | Underground Shows & Events",
    template: "%s | vlonely&friends",
  },

  description:
    "Discover upcoming shows, underground artists, and community events with vlonely&friends.",

  // opengraph = sharing on social media platforms
  openGraph: {
    type: "website",
    siteName: "vlonely&friends",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
  },
};

function Footer() {
    return (
      <div className="flex w-full justify-center py-9">
            <div className="grid grid-cols-3 place-items-center w-full max-w-220 items-center text-center text-xl font-elgoc text/">
                <div className="w-full text-white inline-block">
                    website by <a className="inline pl-1 underline decoration-1 underline-offset-2 text-blue-400" href="https://bitbeans.me">bitbeans</a>
                </div>
                
                <Image className='h-auto rotate-180' src='/SVG/verticalStar.svg' alt="star" width={30} height={44.36} />
                
                <Link className=" p-2 text-blue-400 underline decoration-1 underline-offset-2" href="/admin">log-in</Link>

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
            <EditModeProvider>
              {children}
              <Footer />
            </EditModeProvider>
          </main>
      </body>
    </html>
  );
}
