import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from 'lucide-react';

const MAPS_LINK = 'https://maps.app.goo.gl/cKJVtaWfn3d8ATf4A';

const ADDRESS_LINE_1 = 'Rio Abajo calle 9, Edif. 26-27D';
const ADDRESS_LINE_2 = 'Panamá';

const SCHOOL_EMAIL = 'cebuenpastor.goldenheaven@gmail.com';

// Trim para evitar CRLF/espacios al final (Windows)
const RAW_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as
  | string
  | undefined;
const CONTACT_FORM_ENDPOINT = RAW_ENDPOINT?.trim();

const FIXED_PHONE_DISPLAY = '397-2426';
const FIXED_PHONE_TEL = 'tel:397-2426';

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    content: FIXED_PHONE_DISPLAY,
    action: FIXED_PHONE_TEL,
    color: 'bg-pastel-blue',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: '+507 6461-6826',
    action: 'https://wa.me/50764616826',
    color: 'bg-pastel-green',
  },
  {
    icon: Mail,
    title: 'Correo Electrónico',
    content: SCHOOL_EMAIL,
    action: `mailto:${SCHOOL_EMAIL}`,
    color: 'bg-pastel-pink',
  },
  {
    icon: Clock,
    title: 'Horario de Atención',
    content:
      'Atención únicamente con cita previa. No se recibe a nadie sin previa coordinación.',
    color: 'bg-pastel-yellow',
  },
];

function isValidAppsScriptUrl(url: string | undefined) {
  const v = url?.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'script.google.com' &&
      u.pathname.includes('/macros/s/') &&
      u.pathname.endsWith('/exec')
    );
  } catch {
    return false;
  }
}

// Intentar detectar automáticamente la foto de ubicación en src/assets
// (para no depender del nombre exacto del archivo)
const assetImages = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function pickLocationPhotoSrc() {
  const entries = Object.entries(assetImages);

  const priority = [
    'ubicacion',
    'ubicación',
    'google map',
    'googlemap',
    'mapa',
    'street',
    'exterior',
  ];

  for (const key of priority) {
    const found = entries.find(([path]) =>
      path.toLowerCase().includes(key.toLowerCase())
    );
    if (found) return found[1];
  }

  return null;
}

const LOCATION_PHOTO_SRC = pickLocationPhotoSrc();

export default function Contacto() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Importante: depende del endpoint (no [] vacío)
  const endpointOk = useMemo(
    () => isValidAppsScriptUrl(CONTACT_FORM_ENDPOINT),
    [CONTACT_FORM_ENDPOINT]
  );

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSendError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);

    if (isSending) return;
    setIsSending(true);

    if (!endpointOk || !CONTACT_FORM_ENDPOINT) {
      setSendError(
        !CONTACT_FORM_ENDPOINT
          ? 'Falta configurar el envío directo (VITE_CONTACT_FORM_ENDPOINT).'
          : 'La URL del Apps Script es inválida. Debe ser de script.google.com y terminar en /exec.'
      );
      setIsSending(false);
      return;
    }

    try {
      // Envío compatible (evita preflight): form-urlencoded + no-cors
      const params = new URLSearchParams();
      params.set('name', name);
      params.set('phone', phone);
      params.set('email', email);
      params.set('subject', subject);
      params.set('message', message);
      params.set('source', 'web-contacto');
      params.set('ts', new Date().toISOString());

      await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: params,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Contacto: error enviando a Apps Script', err);
      setSendError(
        'No se pudo enviar directamente. Intenta de nuevo o contáctanos por WhatsApp.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-secondary via-background to-pastel-blue/20">
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-6">
              <MessageCircle className="h-4 w-4" />
              Contáctanos
            </span>

            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Estamos aquí para ayudarte
            </h1>

            <p className="text-lg text-muted-foreground">
              Escríbenos por WhatsApp o envíanos tu mensaje. La atención es
              únicamente con cita previa.
            </p>

            {/* Se removió el indicador visual del estado de Apps Script */}
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {info.action ? (
                <a
                  href={info.action}
                  target={info.action.startsWith('http') ? '_blank' : undefined}
                  rel={
                    info.action.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="block bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center hover:shadow-card transition-shadow"
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <info.icon className="h-6 w-6 text-foreground/80" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {info.title}
                  </h3>
                  <p className="text-primary font-medium break-all">
                    {info.content}
                  </p>
                </a>
              ) : (
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center">
                  <div
                    className={`w-14 h-14 rounded-xl ${info.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <info.icon className="h-6 w-6 text-foreground/80" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {info.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{info.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
              Envíanos un mensaje
            </h2>

            {submitted ? (
              <div className="bg-pastel-green rounded-2xl p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                  ¡Solicitud enviada!
                </h3>
                <p className="text-muted-foreground">
                  Gracias por escribirnos. Te responderemos a la brevedad.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSubmitted(false);
                    resetForm();
                  }}
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border border-border/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del acudiente</Label>
                    <Input
                      id="name"
                      placeholder="Nombre completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+507 6XXX-XXXX"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSending}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="subject">Asunto</Label>
                  <select
                    id="subject"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSending}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="admisiones">Información de Admisiones</option>
                    <option value="visita">Agendar una Visita</option>
                    <option value="academico">Consulta Académica</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">Mensaje</Label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Indícanos el grado de interés y tu consulta."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                  />
                </div>

                {sendError ? (
                  <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground">
                    {sendError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  className="w-full"
                  disabled={isSending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? 'Enviando…' : 'Enviar Mensaje'}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
              Nuestra Ubicación
            </h2>

            <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50">
              {/* Foto exterior + overlay */}
              <div className="relative h-64 bg-secondary">
                {LOCATION_PHOTO_SRC ? (
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full"
                    aria-label="Ver ubicación en Google Maps"
                  >
                    <img
                      src={LOCATION_PHOTO_SRC}
                      alt="Vista exterior de la ubicación"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />

                <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
                  <div className="flex items-start gap-2 text-white">
                    <div className="mt-0.5 rounded-lg bg-black/35 p-2">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">
                        {ADDRESS_LINE_1}
                      </p>
                      <p className="text-sm text-white/90">{ADDRESS_LINE_2}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="bg-white/90" asChild>
                    <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                      Ver en Google Maps
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-foreground mb-3">
                  Centro Educativo El Buen Pastor Golden Heaven
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <a
                      href={MAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
                    </a>
                  </p>

                  <p className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    Atención únicamente con cita previa. No se recibe a nadie sin
                    previa coordinación.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="default" size="lg" className="w-full" asChild>
                <a href={FIXED_PHONE_TEL}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </a>
              </Button>

              <Button variant="whatsapp" size="lg" className="w-full" asChild>
                <a
                  href="https://wa.me/50764616826"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
