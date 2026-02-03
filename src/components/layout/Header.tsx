import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Admisiones', href: '/admisiones' },
  { name: 'Académico', href: '/academico' },
  { name: 'Comunidad', href: '/comunidad' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

function isActivePath(currentPath: string, href: string) {
  // Activo exacto para "/" y activo por prefijo para el resto (ej: /comunidad/galeria)
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(href + '/');
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    // estado inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll as any);
  }, []);

  // ✅ Cierra el menú móvil al cambiar de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-3 lg:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 my-0" onClick={closeMobileMenu}>
          <img
            src={logo}
            alt="Centro Educativo El Buen Pastor Golden Heaven"
            className="h-14 w-14 lg:h-16 lg:w-16 object-contain"
          />
          <div className="hidden sm:block">
            <p className="font-heading font-bold text-primary text-sm lg:text-base leading-tight">
              Centro Educativo
            </p>
            <p className="font-heading font-bold text-primary text-sm lg:text-base leading-tight">
              El Buen Pastor <span className="text-golden">Golden Heaven</span>
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => {
            const active = isActivePath(location.pathname, item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-secondary text-primary'
                    : 'text-foreground/80 hover:text-primary hover:bg-secondary/50'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/portal" className="gap-2">
              <User className="h-4 w-4" />
              Portal Padres
            </Link>
          </Button>

          <Button variant="cta" size="default" asChild>
            <Link to="/admisiones">¡Inscríbete Ahora!</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container py-4 space-y-2">
              {navigation.map((item) => {
                const active = isActivePath(location.pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      active ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/portal" onClick={closeMobileMenu}>
                    <User className="h-4 w-4 mr-2" />
                    Portal Padres
                  </Link>
                </Button>

                <Button variant="cta" asChild className="w-full">
                  <Link to="/admisiones" onClick={closeMobileMenu}>
                    ¡Inscríbete Ahora!
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
