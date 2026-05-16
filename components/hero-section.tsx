import { ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25px 25px, currentColor 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] opacity-70 mb-4">
          Coleccion 2026
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-balance">
          Estilo que define tu esencia
        </h1>
        <p className="text-base md:text-lg opacity-80 mt-6 max-w-md mx-auto leading-relaxed text-pretty">
          Descubre nuestra coleccion de moda femenina: blusas, vestidos, faldas y mas. Haz tu pedido por WhatsApp.
        </p>
        <a
          href="#carnaval"
          className="inline-flex items-center gap-2 mt-8 text-sm uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
        >
          Explorar Catalogo
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
