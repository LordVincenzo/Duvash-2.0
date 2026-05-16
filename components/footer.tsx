import { Instagram, MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/types'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-wider">DUVASH</h3>
            <p className="text-sm opacity-80 mt-1">Moda femenina con estilo</p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Seguir en Instagram"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-xs opacity-60">
            &copy; {new Date().getFullYear()} DUVASH. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
