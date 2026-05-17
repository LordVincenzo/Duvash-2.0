/* eslint-disable @next/next/no-img-element */
'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { X, Plus, Trash2, ImagePlus } from 'lucide-react'
import { Product, ProductColor, CATEGORIES } from '@/lib/types'

type ProductFormData = Omit<Product, 'id'> & { id?: string }

interface ProductFormProps {
  product: Product | null
  onSave: (productData: ProductFormData) => void | Promise<void>
  onClose: () => void
}

export function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category || CATEGORIES[0].id)
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors?.length ? product.colors : [{ name: 'Negro', hex: '#000000' }]
  )
  const [image, setImage] = useState(product?.image || '')
  const [sizesText, setSizesText] = useState(product?.sizes?.join(', ') || '')
  const [featured, setFeatured] = useState(product?.featured || false)
  const [saving, setSaving] = useState(false)

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen valido.')
      return
    }

    const maxSize = 3 * 1024 * 1024

    if (file.size > maxSize) {
      alert('La imagen es muy pesada. Usa una imagen menor a 3 MB.')
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  const updateColor = (index: number, field: keyof ProductColor, value: string) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      )
    )
  }

  const addColor = () => {
    setColors((prev) => [...prev, { name: '', hex: '#000000' }])
  }

  const removeColor = (index: number) => {
    setColors((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanColors = colors.filter(
      (color) => color.name.trim() !== '' && color.hex.trim() !== ''
    )

    if (!name.trim()) {
      alert('Escribe el nombre del producto.')
      return
    }

    if (!description.trim()) {
      alert('Escribe la descripcion del producto.')
      return
    }

    if (!price || Number(price) <= 0) {
      alert('Escribe un precio valido.')
      return
    }

    if (!cleanColors.length) {
      alert('Agrega al menos un color.')
      return
    }

    if (!image) {
      alert('Sube una foto o pega una URL de imagen.')
      return
    }

    const sizes = sizesText
      .split(',')
      .map((size) => size.trim())
      .filter(Boolean)

    const payload: ProductFormData = {
      ...(product?.id ? { id: product.id } : {}),
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      colors: cleanColors,
      image,
      featured,
      ...(sizes.length ? { sizes } : {}),
    }

    try {
      setSaving(true)
      await onSave(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Completa la informacion del producto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Nombre
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Vestido flores"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Precio
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: 50000"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Descripcion
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Describe el producto..."
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Categoria
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Tallas
              </span>
              <input
                type="text"
                value={sizesText}
                onChange={(event) => setSizesText(event.target.value)}
                className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: S, M, L"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">
                Colores
              </span>

              <button
                type="button"
                onClick={addColor}
                className="text-sm bg-secondary text-secondary-foreground px-3 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Agregar color
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_80px_auto] gap-2 items-center"
                >
                  <input
                    type="text"
                    value={color.name}
                    onChange={(event) =>
                      updateColor(index, 'name', event.target.value)
                    }
                    className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Nombre del color"
                  />

                  <input
                    type="color"
                    value={color.hex}
                    onChange={(event) =>
                      updateColor(index, 'hex', event.target.value)
                    }
                    className="h-10 w-full bg-card rounded-md border border-input cursor-pointer"
                    aria-label="Color"
                  />

                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    disabled={colors.length === 1}
                    className="p-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Eliminar color"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              Foto del producto
            </span>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden border border-border flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={name || 'Vista previa del producto'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground text-center px-4">
                    Sin imagen
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <ImagePlus className="w-4 h-4" />
                  Subir foto desde el computador
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">
                    Tambien puedes pegar una URL de imagen:
                  </span>

                  <input
                    type="text"
                    value={image.startsWith('data:image') ? '' : image}
                    onChange={(event) => setImage(event.target.value)}
                    className="bg-card text-foreground px-3 py-2.5 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://..."
                  />

                  {image.startsWith('data:image') && (
                    <p className="text-xs text-muted-foreground">
                      Imagen cargada desde tu computador.
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="w-4 h-4"
                  />
                  Marcar como destacado
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}