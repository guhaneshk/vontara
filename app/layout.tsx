import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Vontara - Master AutoCAD",
  description: "Revolutionary AutoCAD learning platform built by students, for students",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-poppins antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
