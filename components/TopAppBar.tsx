'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Orçamentos', icon: 'description' },
  { href: '/configuracoes', label: 'Configurações', icon: 'settings' },
]

export default function TopAppBar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 lg:px-8 h-16 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center gap-3">
        
        {/* <span className="material-symbols-outlined text-primary">receipt_long</span> */}
        <Link href="/" className="text-headline-md font-bold text-primary leading-none">
          <img src="/logo-white.png" alt="" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const active = item.href === '/'
            ? pathname === '/' || pathname.startsWith('/orcamentos')
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-label-md transition-colors ${
                active
                  ? 'bg-secondary-container text-primary font-semibold'
                  : 'text-secondary hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center">
        <span className="material-symbols-outlined text-secondary">account_circle</span>
      </div>
    </header>
  )
}
