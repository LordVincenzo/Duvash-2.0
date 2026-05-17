import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Duvash',
  description: 'Tienda de ropa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}