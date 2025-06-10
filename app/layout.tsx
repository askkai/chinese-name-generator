import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import DevTools from "@/components/DevTools"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChineseName.ai - Generate Your Perfect Chinese Name",
  description:
    "Get authentic Chinese names in 30 seconds. Perfect for students, professionals, and travelers exploring Chinese culture.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DevTools />
      </body>
    </html>
  )
}
