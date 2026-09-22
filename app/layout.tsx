import type { Metadata } from 'next'
import './globals.css'
import TopAppBar from '@/components/TopAppBar'

export const metadata: Metadata = {
  title: 'MN Orçamentos',
  description: 'Sistema de geração de orçamentos profissionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-on-background antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
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
