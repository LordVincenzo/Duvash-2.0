export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  colors: ProductColor[]
  image: string
  sizes?: string[]
  featured?: boolean
}

export const CATEGORIES = [
  { id: 'carnaval', name: 'Carnaval', slug: 'carnaval' },
  { id: 'blusas', name: 'Blusas y Faldas', slug: 'blusas-faldas' },
  { id: 'vestidos', name: 'Vestidos', slug: 'vestidos' },
  { id: 'trajes-bano', name: 'Trajes de Baño', slug: 'trajes-baño' },
] as const

export const WHATSAPP_NUMBER = '573246046273'
