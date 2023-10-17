import '@/styles/globals.css'
import 'normalize.css'
import '@/styles/titlebar.css'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import TitleBar from '@/components/Header/TitleBar'

export const metadata: Metadata = {
  title: 'KCCTd3bu GameLauncher',
  description: 'd3bu has many works.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
