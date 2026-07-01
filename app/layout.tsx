import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopAppBar from '@/components/TopAppBar'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'MN Orçamentos',
  description: 'Sistema de geração de orçamentos profissionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-background text-on-background antialiased">
        {/* React 19 hoists this <link> to <head> automatically */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <TopAppBar />
        {children}
      </body>
    </html>
  )
}
