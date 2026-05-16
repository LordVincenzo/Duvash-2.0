'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CartProvider, useCart } from '@/lib/cart-context'
import { WHATSAPP_NUMBER } from '@/lib/types'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    let message = 'Hola, me gustaria comprar estas prendas:\n\n'

    items.forEach((item) => {
      const itemTotal = item.product.price * item.quantity
      message += `*${item.product.name}*\n`
      message += `Color: ${item.color.name}\n`
      message += `Cantidad: ${item.quantity}\n`
      message += `Precio: ${formatPrice(item.product.price)}\n`
      message += `Subtotal: ${formatPrice(itemTotal)}\n\n`
    })

    message += `*Total de la compra: ${formatPrice(totalPrice)}*`

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Tu carrito esta vacio
          </h2>
          <p className="text-muted-foreground mt-2">
            Agrega productos desde nuestro catalogo
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver Catalogo
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Tu Carrito ({items.length} {items.length === 1 ? 'producto' : 'productos'})
          </h2>
          <button
            onClick={clearCart}
            className="text-sm text-destructive hover:underline"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.color.name}`}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
            >
              {/* Product color indicator */}
              <div
                className="w-16 h-16 rounded-md border border-border flex-shrink-0"
                style={{ backgroundColor: item.color.hex }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-card-foreground truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Color: {item.color.name}
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {formatPrice(item.product.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.color.name, item.quantity - 1)
                  }
                  className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.color.name, item.quantity + 1)
                  }
                  className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Item Total & Delete */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground whitespace-nowrap">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.product.id, item.color.name)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <aside className="lg:w-80 flex-shrink-0">
        <div className="bg-card border border-border rounded-lg p-6 lg:sticky lg:top-24">
          <h3 className="font-serif text-lg font-bold text-card-foreground mb-4">
            Resumen del Pedido
          </h3>

          <div className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.color.name}`}
                className="flex justify-between text-muted-foreground"
              >
                <span className="truncate mr-2">
                  {item.product.name} x{item.quantity}
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border my-4" />

          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-card-foreground">Total</span>
            <span className="font-bold text-xl text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full mt-6 bg-green-600 text-primary-foreground py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Pedir por WhatsApp
          </button>

          <Link
            href="/"
            className="w-full mt-3 bg-secondary text-secondary-foreground py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-accent transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir Comprando
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default function CarritoPage() {
  return (
    <CartProvider>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <CartContent />
        </div>
      </main>
      <Footer />
    </CartProvider>
  )
}
