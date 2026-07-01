'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Orçamentos', icon: 'description' },
  { href: '/orcamentos/novo', label: 'Novo', icon: 'add_circle' },
  { href: '/configuracoes', label: 'Config', icon: 'settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface-container-lowest shadow-[0_-1px_3px_rgba(15,23,42,0.08)]">
      {navItems.map((item) => {
        const active = item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-full transition-colors ${
              active ? 'text-primary' : 'text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
