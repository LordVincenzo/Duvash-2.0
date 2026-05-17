'use client'

import { useState, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { Plus, Pencil, Trash2, Eye, LogOut, Package, Search } from 'lucide-react'
import { AdminLogin } from '@/components/admin-login'
import { ProductForm } from '@/components/product-form'
import { Product, CATEGORIES } from '@/lib/types'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: products, isLoading } = useSWR<Product[]>('/api/products', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products?.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSave = useCallback(
    async (productData: Omit<Product, 'id'> & { id?: string }) => {
      if (productData.id) {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        })
      }
      mutate('/api/products')
      setShowForm(false)
      setEditingProduct(null)
    },
    []
  )

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    mutate('/api/products')
  }, [])

  const getCategoryName = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <div>
              <h1 className="font-serif text-xl font-bold">DUVASH Admin</h1>
              <p className="text-xs opacity-70">Panel de gestion de productos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 bg-primary-foreground/10 px-3 py-2 rounded-md transition-opacity"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 bg-primary-foreground/10 px-3 py-2 rounded-md transition-opacity"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <p className="text-2xl font-bold text-card-foreground mt-1">{products?.length || 0}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card text-foreground pl-10 pr-4 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todas las categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Product Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Categoria</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Colores</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts?.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-card-foreground text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-card-foreground">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {product.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full border border-border"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setShowForm(true)
                            }}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                            aria-label="Editar producto"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-md transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredProducts?.map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{getCategoryName(product.category)}</p>
                      <p className="font-bold text-primary text-sm mt-1">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setShowForm(true)
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-md"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {product.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-border"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts?.length === 0 && (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No se encontraron productos</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />
}
