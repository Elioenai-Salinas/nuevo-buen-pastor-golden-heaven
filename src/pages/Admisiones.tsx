import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Section, SectionHeader } from '@/components/shared/Section';
import {
  CheckCircle,
  FileText,
  Calendar,
  CreditCard,
  Phone,
  Clock,
  ArrowRight,
  Download,
  Send,
} from 'lucide-react';

// ✅ Link MÁS RECIENTE del calendario
const CALENDAR_BOOKING_URL = 'https://calendar.app.google/Z52GaZcJ2DUa4VrD7';

// ✅ Carpeta de documentos
const DOCUMENTS_FOLDER_URL =
  'https://drive.google.com/drive/folders/1KJ9XMQTPSqF5263hMnG3f0bE3QtW6_gl?usp=drive_link';

// ✅ Correo oficial de la escuela
const SCHOOL_EMAIL = 'cebuenpastor.goldenheaven@gmail.com';

// ✅ WhatsApp / Tel fijo
const WHATSAPP_URL =
  'https://wa.me/50764616826?text=Hola,%20me%20gustaría%20información%20sobre%20las%20matrículas.';
const PHONE_FIXED_TEL = 'tel:+5073972426';
const PHONE_FIXED_LABEL = '397-2426';

// ✅ Endpoint del Apps Script (desde .env) - igual que Contacto
const RAW_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as
  | string
  | undefined;
const ADMISSIONS_FORM_ENDPOINT = RAW_ENDPOINT?.trim();

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

const steps = [
  {
    number: '1',
    title: 'Solicita Información',
    description:
      'Completa el formulario o contáctanos por WhatsApp para recibir toda la información.',
    icon: FileText,
  },
  {
    number: '2',
    title: 'Llena el formulario',
    description:
      'Accede a los documentos para ver el formulario y la lista de requisitos.',
    icon: Download,
  },
  {
    number: '3',
    title: 'Completa la documentación',
    description:
      'Entrega los documentos requeridos y completa el proceso de inscripción.',
    icon: CheckCircle,
  },
  {
    number: '4',
    title: 'Formaliza la matrícula',
    description:
      'Realiza el pago de matrícula y ¡bienvenido a la familia Golden Heaven!',
    icon: CreditCard,
  },
];

const requirements = [
  'Copia de cédula del estudiante',
  'Copia de cédula de los padres o tutores',
  'Certificado de nacimiento',
  'Récord de vacunas actualizado',
  'Certificación de notas (para estudiantes de traslado)',
  '2 fotos tamaño carnet',
  'Carta de buena conducta (para estudiantes de traslado)',
];

const prices = [
  {
    level: 'Preescolar · Niños 4 años',
    enrollment: 'B/. 200.00',
    monthly: 'B/. 60.00',
    color: 'bg-pastel-pink',
  },
  {
    level: 'Kínder+ · Niños 5 años',
    enrollment: 'B/. 200.00',
    monthly: 'B/. 60.00',
    color: 'bg-pastel-blue',
  },
  {
    level: 'Primaria (1°–6°)',
    enrollment: 'B/. 200.00',
    monthly: 'B/. 65.00 – B/. 75.00 (según grado)',
    color: 'bg-pastel-green',
  },
];

function gradeLabel(value: string) {
  const map: Record<string, string> = {
    kinder: 'Preescolar (4 años)',
    'kinder-plus': 'Kínder+ (5 años)',
    '1': '1° Primaria',
    '2': '2° Primaria',
    '3': '3° Primaria',
    '4': '4° Primaria',
    '5': '5° Primaria',
    '6': '6° Primaria',
  };
  return map[value] || value;
}

export default function Admisiones() {
  const [sending, setSending] = useState(false);

  // ✅ Éxito/fracaso dentro de la página (como Contacto)
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const endpointOk = useMemo(
    () => isValidAppsScriptUrl(ADMISSIONS_FORM_ENDPOINT),
    [ADMISSIONS_FORM_ENDPOINT]
  );

  async function submitToAppsScript(payload: Record<string, string>) {
    if (!ADMISSIONS_FORM_ENDPOINT) throw new Error('Missing endpoint');

    // Envío compatible (sin preflight): form-urlencoded + no-cors
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => params.set(k, v));

    await fetch(ADMISSIONS_FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: params,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <div className="h-full bg-gradient-to-br from-secondary via-background to-pastel-pink/30" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-6">
              <Calendar className="h-4 w-4" />
              Matrículas Abiertas 2026
            </span>

            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Inicia el camino hacia el <span className="text-primary">éxito</span>{' '}
              de tu hijo
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              El proceso de admisión es sencillo. Estamos aquí para acompañarte en
              cada paso.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="cta" size="xl" asChild>
                <a href="#formulario">Solicitar Información</a>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a href={PHONE_FIXED_TEL}>
                  <Phone className="h-4 w-4 mr-2" />
                  {PHONE_FIXED_LABEL}
                </a>
              </Button>

              <Button variant="secondary" size="lg" asChild>
                <a
                  href={CALENDAR_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Cita
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <Section>
        <SectionHeader
          badge="Proceso de Admisión"
          title="4 pasos simples para inscribir a tu hijo"
          subtitle="Hemos diseñado un proceso ágil para que puedas completar la matrícula sin complicaciones."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {step.number}
                  </span>
                  <step.icon className="h-5 w-5 text-golden" />
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Requirements + Prices */}
      <Section className="bg-secondary/30">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              badge="Documentos"
              title="Requisitos para la matrícula"
              centered={false}
            />

            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{req}</span>
                </motion.li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="mt-6 font-semibold text-base"
              asChild
            >
              <a
                href={DOCUMENTS_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Enlace a documentos
              </a>
            </Button>

            <p className="text-xs text-muted-foreground mt-2">
              (Formulario de admisión, lista de requisitos y documentos informativos.)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader badge="Inversión" title="Costos de matrícula" centered={false} />

            <div className="space-y-4">
              {prices.map((price, index) => (
                <motion.div
                  key={price.level}
                  className={`${price.color} rounded-xl p-5`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-heading font-bold text-lg text-foreground mb-3">
                    {price.level}
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Matrícula</p>
                      <p className="font-bold text-foreground">{price.enrollment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mensualidad</p>
                      <p className="font-bold text-foreground">{price.monthly}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              * Los precios están sujetos a cambios. Contáctenos para información actualizada.
            </p>
            <p className="text-sm text-muted-foreground">
              * Aplica cargo de plataforma de <strong>B/. 10.00</strong>.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Form Section */}
      <Section id="formulario">
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            badge="Contáctanos"
            title="Solicita información o agenda una cita"
            subtitle="Completa el formulario y la solicitud llegará directamente al correo de la escuela."
          />

          {submitted ? (
            <div className="bg-pastel-green rounded-2xl p-8 text-center shadow-card border border-border/50">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                ¡Solicitud enviada!
              </h3>
              <p className="text-muted-foreground">
                Gracias. Hemos recibido tu solicitud y te responderemos a la brevedad.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSubmitted(false);
                  setSendError(null);
                }}
              >
                Enviar otra solicitud
              </Button>
            </div>
          ) : (
            <motion.form
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={async (e) => {
                e.preventDefault();
                setSendError(null);
                if (sending) return;

                const form = e.currentTarget;
                const parentName =
                  (form.querySelector('#parentName') as HTMLInputElement)?.value || '';
                const phone =
                  (form.querySelector('#phone') as HTMLInputElement)?.value || '';
                const email =
                  (form.querySelector('#email') as HTMLInputElement)?.value || '';
                const studentName =
                  (form.querySelector('#studentName') as HTMLInputElement)?.value || '';
                const grade =
                  (form.querySelector('#grade') as HTMLSelectElement)?.value || '';
                const message =
                  (form.querySelector('#message') as HTMLTextAreaElement)?.value || '';

                const gradeHuman = gradeLabel(grade);

                try {
                  setSending(true);

                  if (!endpointOk || !ADMISSIONS_FORM_ENDPOINT) {
                    setSendError(
                      'No se pudo enviar en este momento. Intenta nuevamente o contáctanos por WhatsApp.'
                    );
                    return;
                  }

                  await submitToAppsScript({
                    name: parentName,
                    parentName,
                    phone,
                    email,
                    studentName,
                    grade: gradeHuman,
                    subject: `Solicitud de admisiones — ${gradeHuman}`,
                    message: message?.trim() || '',
                    page: '/admisiones',
                    source: 'web-admisiones',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    to: SCHOOL_EMAIL,
                  });

                  form.reset();
                  setSubmitted(true);
                } catch (err) {
                  setSendError(
                    'No se pudo enviar en este momento. Intenta nuevamente o contáctanos por WhatsApp.'
                  );
                } finally {
                  setSending(false);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Nombre del padre/madre</Label>
                  <Input
                    id="parentName"
                    placeholder="Nombre completo"
                    required
                    disabled={sending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+507 6XXX-XXXX"
                    required
                    disabled={sending}
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
                  disabled={sending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nombre del estudiante</Label>
                  <Input
                    id="studentName"
                    placeholder="Nombre del niño/a"
                    required
                    disabled={sending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grado de interés</Label>
                  <select
                    id="grade"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    disabled={sending}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="kinder">Preescolar (4 años)</option>
                    <option value="kinder-plus">Kínder+ (5 años)</option>
                    <option value="1">1° Primaria</option>
                    <option value="2">2° Primaria</option>
                    <option value="3">3° Primaria</option>
                    <option value="4">4° Primaria</option>
                    <option value="5">5° Primaria</option>
                    <option value="6">6° Primaria</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Mensaje o consulta (opcional)</Label>
                <textarea
                  id="message"
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="¿Tienes alguna pregunta específica?"
                  disabled={sending}
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
                disabled={sending}
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </motion.form>
          )}

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-2">
              ¿Prefieres contactarnos directamente?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <a href={PHONE_FIXED_TEL}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </a>
              </Button>

              <Button variant="whatsapp" asChild>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>

              <Button variant="secondary" asChild>
                <a
                  href={CALENDAR_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservar Cita
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Schedule CTA */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Clock className="h-12 w-12 text-golden-light mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-primary-foreground mb-4">
              Agenda una cita con nuestro equipo
            </h2>
            <p className="text-primary-foreground/80 mb-6">
              Reserva tu espacio en el horario disponible. Podemos atenderte de
              forma presencial o por Google Meet, según coordinación previa.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <a
                href={CALENDAR_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Cita
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
