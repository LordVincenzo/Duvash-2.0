'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { CATEGORIES } from '@/lib/types'

export function Navbar() {
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="font-serif text-2xl tracking-wider font-bold">
          DUVASH
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <a
                href={`/#${cat.slug}`}
                className="text-sm uppercase tracking-wide opacity-90 hover:opacity-100 transition-opacity"
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/carrito"
            className="relative p-2 hover:opacity-80 transition-opacity"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-6 py-4">
          <ul className="flex flex-col gap-4">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/#${cat.slug}`}
                  className="text-sm uppercase tracking-wide opacity-90 hover:opacity-100 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
