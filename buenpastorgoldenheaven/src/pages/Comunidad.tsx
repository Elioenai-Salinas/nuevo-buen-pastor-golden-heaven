import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Ajusta estas rutas si tus archivos están en otra carpeta dentro de src/assets
import matriculasImg from '@/assets/matriculas-2026.png';
import summerFunImg from '@/assets/summer-fun.png';
import feriaCienciasImg from '@/assets/feria-ciencias.jpg';

const FACEBOOK_URL =
  'https://www.facebook.com/profile.php?id=100063931126975';
const INSTAGRAM_URL = 'https://www.instagram.com/buenpastorgoldenheaven/';

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  date?: string;
  category: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
  articleTitle: string;
  articleBody: string[];
  primaryCta?: { label: string; to: string };
};

type EventItem = {
  id: number;
  title: string;
  date?: string;
  time?: string;
  detailsTitle: string;
  detailsBody: string[];
};

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  filename: string;
};

// NOTICIAS
const news: NewsItem[] = [
  {
    id: 1,
    title: 'Matrículas 2026 Abiertas',
    excerpt:
      'Inicia el proceso de inscripción para el año escolar 2026. Te acompañamos en cada paso.',
    date: undefined,
    category: 'Admisiones',
    color: 'bg-pastel-pink',
    imageSrc: matriculasImg,
    imageAlt: 'Matrículas 2026',
    articleTitle: 'Matrículas 2026',
    articleBody: [
      'Estamos iniciando el proceso de inscripción para el año escolar 2026.',
      'Para comenzar:',
      '• Revisa la información de admisiones en nuestra web.',
      '• Solicita o completa los formularios necesarios.',
      '• Si tienes dudas, contáctanos desde la página de Contacto.',
      '• También puedes comunicarte por nuestro teléfono fijo o por WhatsApp (botón disponible en la página) y con gusto te orientamos.',
      'Atención: la coordinación y seguimiento se realizan según disponibilidad y con cita previa cuando aplique.',
    ],
    primaryCta: { label: 'Ir a Admisiones', to: '/admisiones' },
  },
  {
    id: 2,
    title: 'Summer Fun',
    excerpt:
      'Actividades y diversión para nuestros estudiantes durante la temporada de verano.',
    date: undefined,
    category: 'Eventos',
    color: 'bg-pastel-blue',
    imageSrc: summerFunImg,
    imageAlt: 'Summer Fun',
    articleTitle: 'Summer Fun',
    articleBody: [
      'Una experiencia especial con actividades recreativas y dinámicas para fortalecer habilidades, convivencia y disfrute en un ambiente seguro.',
      'Summer Fun ya se está realizando y hemos completado la primera semana, la cual ha tenido excelente acogida por parte de acudientes y estudiantes.',
      'Todavía estás a tiempo para la segunda semana del lunes 9 al jueves 12 de febrero.',
      'Para más información sobre cupos, horarios y requisitos, contáctanos por WhatsApp o desde la página de Contacto.',
    ],
    primaryCta: { label: 'Ir a Contacto', to: '/contacto' },
  },
  {
    id: 3,
    title: 'Feria de Ciencias',
    excerpt:
      'Nuestros estudiantes presentan proyectos creativos y experimentos que despiertan su curiosidad.',
    date: undefined,
    category: 'Académico',
    color: 'bg-pastel-green',
    imageSrc: feriaCienciasImg,
    imageAlt: 'Feria de Ciencias',
    articleTitle: 'Feria de Ciencias',
    articleBody: [
      'Nuestra Feria de Ciencias se convierte en un espacio especial para descubrir, experimentar y compartir aprendizajes. Los estudiantes presentan proyectos que reflejan su curiosidad y creatividad, explicando ideas, procesos y resultados con entusiasmo.',
      'A través de experimentos y demostraciones, se refuerzan habilidades como la observación, el pensamiento crítico y la comunicación. Es una jornada donde el aprendizaje se vive de forma práctica y significativa para toda la comunidad escolar.',
      'Esta feria se realizará en el mes de octubre, próximamente.',
    ],
    primaryCta: { label: 'Ir a Contacto', to: '/contacto' },
  },
];

// EVENTOS (clickeables + modal)
const events: EventItem[] = [
  {
    id: 1,
    title: 'Reunión de Padres de Familia',
    date: undefined,
    time: undefined,
    detailsTitle: 'Reunión de Padres de Familia',
    detailsBody: [
      'En esta sección compartiremos la información de la próxima reunión de padres de familia: fecha, hora, temas a tratar y recomendaciones.',
      'Por el momento, los detalles están por confirmarse.',
      'Te sugerimos estar pendiente del Boletín Informativo y de nuestras noticias para conocer la actualización.',
    ],
  },
  {
    id: 2,
    title: 'Summer Fun',
    date: 'Del 2 al 12 de febrero',
    time: '8:00 a.m. a 12:00 m.',
    detailsTitle: 'Summer Fun',
    detailsBody: [
      'Una experiencia especial con actividades recreativas y dinámicas para fortalecer habilidades, convivencia y disfrute en un ambiente seguro.',
      'Summer Fun ya se está realizando y hemos completado la primera semana, la cual ha tenido excelente acogida por parte de acudientes y estudiantes.',
      'Todavía estás a tiempo para la segunda semana del lunes 9 al jueves 12 de febrero.',
      'Para más información sobre cupos, horarios y requisitos, contáctanos por WhatsApp o desde la página de Contacto.',
    ],
  },
  {
    id: 3,
    title: 'Boletín Informativo',
    date: undefined,
    time: undefined,
    detailsTitle: 'Boletín Informativo',
    detailsBody: [
      'Este espacio está destinado a compartir información importante para padres de familia: avisos, recordatorios, comunicados y actualizaciones del centro educativo.',
      'Publicaremos aquí novedades relacionadas con actividades, fechas relevantes y orientaciones generales para acompañar el proceso escolar.',
      'Mantente pendiente de esta sección para futuras publicaciones.',
    ],
  },
];

// GALERÍA automática: /src/assets/galeria con nombres tipo galeria-01.jpg ... galeria-06.jpg
const galleryImageModules = import.meta.glob(
  '/src/assets/galeria/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
) as Record<string, string>;

function filenameFromPath(path: string) {
  const parts = path.split('/');
  return parts[parts.length - 1] ?? path;
}

function altFromFilename(filename: string) {
  return filename
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function Comunidad() {
  const [activeTab, setActiveTab] = useState<'noticias' | 'eventos' | 'galeria'>(
    'noticias'
  );

  // Modal Noticias
  const [openNewsId, setOpenNewsId] = useState<number | null>(null);
  const openNews = useMemo(
    () => news.find((n) => n.id === openNewsId) ?? null,
    [openNewsId]
  );
  const closeNewsModal = () => setOpenNewsId(null);

  // Modal Eventos
  const [openEventId, setOpenEventId] = useState<number | null>(null);
  const openEvent = useMemo(
    () => events.find((e) => e.id === openEventId) ?? null,
    [openEventId]
  );
  const closeEventModal = () => setOpenEventId(null);

  // Lightbox Galería
  const [openGalleryIndex, setOpenGalleryIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = useMemo(() => {
    const entries = Object.entries(galleryImageModules).map(([path, src]) => {
      const filename = filenameFromPath(path);
      return {
        id: path,
        src,
        filename,
        alt: altFromFilename(filename),
      };
    });

    // Ordena por nombre: galeria-01, galeria-02, ...
    entries.sort((a, b) => a.filename.localeCompare(b.filename, 'es'));

    // Solo 6 cuadrantes
    return entries.slice(0, 6);
  }, []);

  const currentGalleryItem =
    openGalleryIndex !== null ? galleryItems[openGalleryIndex] : null;

  const closeGalleryModal = () => setOpenGalleryIndex(null);

  const goPrev = () => {
    if (openGalleryIndex === null) return;
    const nextIndex =
      (openGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    setOpenGalleryIndex(nextIndex);
  };

  const goNext = () => {
    if (openGalleryIndex === null) return;
    const nextIndex = (openGalleryIndex + 1) % galleryItems.length;
    setOpenGalleryIndex(nextIndex);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openNewsId !== null) closeNewsModal();
        if (openEventId !== null) closeEventModal();
        if (openGalleryIndex !== null) closeGalleryModal();
      }
      if (openGalleryIndex !== null && galleryItems.length > 1) {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
      }
    };

    if (
      openNewsId !== null ||
      openEventId !== null ||
      openGalleryIndex !== null
    ) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNewsId, openEventId, openGalleryIndex, galleryItems.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 hero-gradient">
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Nuestra Comunidad
            </h1>

            <p className="text-lg text-muted-foreground">
              Mantente al día con las últimas noticias, eventos y momentos
              especiales de nuestra familia Golden Heaven.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: 'noticias', label: 'Noticias', icon: Newspaper },
            { id: 'eventos', label: 'Eventos', icon: Calendar },
            { id: 'galeria', label: 'Galería', icon: ImageIcon },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="lg"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'noticias' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.color} text-foreground/80`}
                      >
                        {item.category}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {item.date?.trim() ? item.date : 'Próximamente'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4">
                      {item.excerpt}
                    </p>

                    <button
                      type="button"
                      onClick={() => setOpenNewsId(item.id)}
                      className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all"
                      aria-label={`Leer más sobre ${item.title}`}
                    >
                      Leer más
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm">
                Próximamente más noticias y actualizaciones...
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'eventos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.button
                  key={event.id}
                  type="button"
                  className="w-full text-left bg-card rounded-xl p-6 shadow-soft border border-border/50 flex items-center gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setOpenEventId(event.id)}
                  aria-label={`Abrir detalle: ${event.title}`}
                >
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />{' '}
                        {event.date?.trim() ? event.date : 'Próximamente'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />{' '}
                        {event.time?.trim() ? event.time : 'Por confirmar'}
                      </span>
                    </div>
                    <div className="mt-3 inline-flex items-center text-primary text-sm font-medium">
                      Ver detalle
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm mb-4">
                Mantente informado sobre próximos eventos
              </p>
              <Button variant="outline" asChild>
                <Link to="/contacto">Contáctanos para más información</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === 'galeria' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {galleryItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aún no hay fotos en la galería.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Agrega imágenes en{' '}
                  <span className="font-medium">src/assets/galeria/</span> con
                  nombres como <span className="font-medium">galeria-01.jpg</span>{' '}
                  a <span className="font-medium">galeria-06.jpg</span>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryItems.map((image, index) => (
                  <motion.button
                    key={image.id}
                    type="button"
                    className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border/50 shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setOpenGalleryIndex(index)}
                    aria-label={`Abrir foto: ${image.alt}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-muted-foreground text-sm mb-4">
                Visita nuestras páginas de Facebook e Instagram para ver más fotos
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button variant="outline" asChild>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Section>

      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-primary-foreground mb-4">
            ¿Quieres ser parte de nuestra comunidad?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Inscribe a tu hijo y únete a las familias que confían en nosotros.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/admisiones">Comenzar Inscripción</Link>
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {openNews && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openNews.articleTitle}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeNewsModal}
            aria-label="Cerrar"
          />

          <div
            className="relative w-full max-w-2xl rounded-2xl bg-card shadow-soft border border-border/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {openNews.category}
                </p>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {openNews.articleTitle}
                </h3>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeNewsModal}
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4 rounded-xl overflow-hidden bg-secondary">
                <img
                  src={openNews.imageSrc}
                  alt={openNews.imageAlt}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {openNews.articleBody.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {openNews.primaryCta ? (
                  <Button asChild>
                    <Link to={openNews.primaryCta.to} onClick={closeNewsModal}>
                      {openNews.primaryCta.label}
                    </Link>
                  </Button>
                ) : null}

                <Button variant="outline" asChild>
                  <Link to="/contacto" onClick={closeNewsModal}>
                    Contacto
                  </Link>
                </Button>

                <Button variant="ghost" onClick={closeNewsModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openEvent && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openEvent.detailsTitle}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeEventModal}
            aria-label="Cerrar"
          />

          <div
            className="relative w-full max-w-2xl rounded-2xl bg-card shadow-soft border border-border/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Eventos</p>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {openEvent.detailsTitle}
                </h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />{' '}
                    {openEvent.date?.trim() ? openEvent.date : 'Próximamente'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />{' '}
                    {openEvent.time?.trim() ? openEvent.time : 'Por confirmar'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeEventModal}
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {openEvent.detailsBody.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link to="/contacto" onClick={closeEventModal}>
                    Contacto
                  </Link>
                </Button>

                <Button variant="ghost" onClick={closeEventModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentGalleryItem && openGalleryIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa de foto"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={closeGalleryModal}
            aria-label="Cerrar"
          />

          <div
            className="relative w-full max-w-4xl rounded-2xl bg-card shadow-soft border border-border/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 p-4 border-b border-border/50">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {currentGalleryItem.filename}
                </p>
                <p className="text-sm text-foreground font-medium truncate">
                  {currentGalleryItem.alt}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {galleryItems.length > 1 ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goPrev}
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goNext}
                      aria-label="Foto siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                ) : null}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeGalleryModal}
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-xl overflow-hidden bg-black">
                <img
                  src={currentGalleryItem.src}
                  alt={currentGalleryItem.alt}
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
