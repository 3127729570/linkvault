import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
import Providers from "@/components/layout/Providers"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import SearchCommand from "@/components/search/SearchCommand"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "LinkVault - Website Collection & Navigation",
  description: "Discover and share quality websites",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  return (
    <html lang="en" suppressHydrationWarning>
      {adsenseClientId && (
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      )}
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen antialiased font-sans"
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SearchCommand />
        </Providers>
      </body>
    </html>
  )
}