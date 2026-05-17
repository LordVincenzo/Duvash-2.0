'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { Product, ProductColor } from '@/lib/types'

export interface CartItem {
  product: Product
  color: ProductColor
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, color: ProductColor) => void
  removeItem: (productId: string, colorName: string) => void
  updateQuantity: (productId: string, colorName: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CART_STORAGE_KEY = 'duvash-cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error cargando el carrito:', error)
    } finally {
      setCartLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!cartLoaded) return

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error guardando el carrito:', error)
    }
  }, [items, cartLoaded])

  const addItem = useCallback((product: Product, color: ProductColor) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && item.color.name === color.name
      )

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.color.name === color.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { product, color, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: string, colorName: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.color.name === colorName)
      )
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, colorName: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, colorName)
        return
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.color.name === colorName
            ? { ...item, quantity }
            : item
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}