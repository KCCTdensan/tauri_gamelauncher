"use client"

import '@/styles/globals.css'
import 'normalize.css'
import '@/styles/titlebar.css'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import TitleBar from '@/components/Header/TitleBar'
import { useWindowEvent } from '@/lib/hooks'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useWindowEvent()

  return (
    <html lang="jp">
      <body>
        <TitleBar />
        <div className="html_main">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
