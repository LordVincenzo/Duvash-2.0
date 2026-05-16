'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface AdminLoginProps {
  onLogin: () => void
}

const ADMIN_PASSWORD = 'duvash2026'

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onLogin()
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">DUVASH</h1>
          <p className="text-muted-foreground mt-2 text-sm">Panel de Administracion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6">
          <label htmlFor="admin-password" className="block text-sm font-medium text-card-foreground mb-2">
            Contrasena
          </label>
          <div className="relative mb-4">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Ingresa la contrasena"
              className="w-full bg-secondary text-foreground px-4 py-3 pr-10 rounded-md border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-4">Contrasena incorrecta</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Contrasena por defecto: duvash2026
        </p>
      </div>
    </div>
  )
}
