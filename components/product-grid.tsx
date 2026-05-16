'use client'

import { ProductCard } from './product-card'
import { Product } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const groupedProducts = CATEGORIES.map((category) => ({
    ...category,
    products: products.filter((p) => p.category === category.id),
  })).filter((group) => group.products.length > 0)

  return (
    <div className="flex flex-col gap-16">
      {groupedProducts.map((group) => (
        <section key={group.id} id={group.slug} className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              {group.name}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
