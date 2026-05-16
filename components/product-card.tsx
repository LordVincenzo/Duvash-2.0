'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Check } from 'lucide-react'
import { Product, ProductColor } from '@/lib/types'
import { useCart } from '@/lib/cart-context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedColor) {
      return
    }
    addItem(product, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <article className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        {product.image && product.image !== '/placeholder-product.jpg' ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-muted-foreground text-sm text-center px-4">
              {product.name}
            </span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm uppercase tracking-wide font-medium">
            Destacado
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-card-foreground leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <p className="text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>

        {/* Color Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                selectedColor?.name === color.name
                  ? 'border-primary scale-110 ring-2 ring-primary/30'
                  : 'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Color ${color.name}`}
            />
          ))}
        </div>

        {selectedColor && (
          <p className="text-xs text-muted-foreground">
            Color: <span className="font-medium text-foreground">{selectedColor.name}</span>
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedColor || added}
          className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            added
              ? 'bg-green-600 text-primary-foreground'
              : selectedColor
              ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Agregado
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              {selectedColor ? 'Agregar al Carrito' : 'Selecciona un color'}
            </>
          )}
        </button>
      </div>
    </article>
  )
}
