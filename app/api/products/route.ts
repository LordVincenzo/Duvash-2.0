import { NextResponse } from 'next/server'
import { defaultProducts } from '@/lib/products'
import { Product } from '@/lib/types'

// In-memory store for products (persists across requests in development)
let products: Product[] = [...defaultProducts]

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newProduct: Product = {
    ...body,
    id: body.id || `product-${Date.now()}`,
  }
  products.push(newProduct)
  return NextResponse.json(newProduct, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const index = products.findIndex((p) => p.id === body.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  products[index] = { ...products[index], ...body }
  return NextResponse.json(products[index])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  products = products.filter((p) => p.id !== id)
  return NextResponse.json({ success: true })
}
