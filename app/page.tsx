'use client'

import useSWR from 'swr'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { ProductGrid } from '@/components/product-grid'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/lib/cart-context'
import { Product } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function CatalogContent() {
  const { data: products, isLoading } = useSWR<Product[]>('/api/products', fetcher)

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm">Cargando catalogo...</p>
              </div>
            </div>
          ) : products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No hay productos disponibles.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function HomePage() {
  return (
    <CartProvider>
      <CatalogContent />
    </CartProvider>
  )
}
