import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const LAST_UPDATED = '18 de abril de 2026';

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container py-10 lg:py-14">
        <article className="max-w-3xl mx-auto space-y-6">
          <header className="space-y-2">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">Politica de Privacidad</h1>
            <p className="text-muted-foreground text-sm">Ultima actualizacion: {LAST_UPDATED}</p>
          </header>

          <p>
            En Centro Educativo El Buen Pastor Golden Heaven respetamos la privacidad de estudiantes,
            representantes y visitantes. Esta politica explica que datos recopilamos, para que los usamos
            y como protegemos la informacion.
          </p>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">1. Datos que recopilamos</h2>
            <p>
              Podemos recopilar nombre, telefono, correo, informacion academica basica y mensajes enviados
              por formularios del sitio para fines administrativos y de contacto institucional.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">2. Uso de la informacion</h2>
            <p>Usamos la informacion para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Atender consultas de admision y comunicacion con familias.</li>
              <li>Gestionar procesos academicos y administrativos autorizados.</li>
              <li>Mejorar nuestros servicios y canales de atencion.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">3. Comparticion de datos</h2>
            <p>
              No vendemos datos personales. Solo compartimos informacion cuando es necesario para la
              prestacion del servicio educativo, por obligacion legal o con autorizacion del titular.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">4. Seguridad</h2>
            <p>
              Aplicamos medidas tecnicas y administrativas razonables para proteger los datos frente a
              accesos no autorizados, perdida o alteracion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">5. Derechos del titular</h2>
            <p>
              El titular puede solicitar acceso, correccion o actualizacion de sus datos escribiendo a
              nuestro canal de contacto oficial publicado en este sitio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">6. Cambios a esta politica</h2>
            <p>
              Podemos actualizar esta politica para reflejar mejoras operativas o cambios normativos. La
              fecha de ultima actualizacion se mostrara en esta misma pagina.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
