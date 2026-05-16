'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Product, ProductColor, CATEGORIES } from '@/lib/types'

interface ProductFormProps {
  product?: Product | null
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void
  onClose: () => void
}

export function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [category, setCategory] = useState(product?.category || CATEGORIES[0].id)
  const [colors, setColors] = useState<ProductColor[]>(product?.colors || [])
  const [featured, setFeatured] = useState(product?.featured || false)
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }])
      setNewColorName('')
      setNewColorHex('#000000')
    }
  }

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || colors.length === 0) return

    onSave({
      ...(product?.id ? { id: product.id } : {}),
      name,
      description,
      price: parseFloat(price),
      category,
      colors,
      image: product?.image || '/placeholder-product.jpg',
      featured,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-card-foreground">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-card-foreground mb-1">
              Nombre del producto *
            </label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary text-foreground px-3 py-2 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ej: Top Espalda Afuera"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-desc" className="block text-sm font-medium text-card-foreground mb-1">
              Descripcion
            </label>
            <textarea
              id="product-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary text-foreground px-3 py-2 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
              placeholder="Descripcion del producto..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-card-foreground mb-1">
              Precio (COP) *
            </label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-secondary text-foreground px-3 py-2 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="30000"
              min="0"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium text-card-foreground mb-1">
              Categoria
            </label>
            <select
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-secondary text-foreground px-3 py-2 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Colores disponibles *
            </label>

            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-sm"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Eliminar color ${color.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-10 rounded-md border border-input cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Nombre del color"
                className="flex-1 bg-secondary text-foreground px-3 py-2 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddColor()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90"
                aria-label="Agregar color"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-card-foreground">Producto destacado</span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name || !price || colors.length === 0}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
