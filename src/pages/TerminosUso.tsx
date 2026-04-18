import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const LAST_UPDATED = '18 de abril de 2026';

export default function TerminosUso() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container pt-28 pb-10 lg:pt-32 lg:pb-14">
        <article className="max-w-3xl mx-auto space-y-6">
          <header className="space-y-2">
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">Terminos de Uso</h1>
            <p className="text-muted-foreground text-sm">Ultima actualizacion: {LAST_UPDATED}</p>
          </header>

          <p>
            Este sitio web pertenece a Centro Educativo El Buen Pastor Golden Heaven. Al usar este sitio,
            aceptas estos terminos.
          </p>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">1. Uso permitido</h2>
            <p>
              El contenido del sitio se ofrece para informacion institucional, comunicacion con familias y
              apoyo a procesos educativos y administrativos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">2. Propiedad intelectual</h2>
            <p>
              Los textos, imagenes, marcas, logotipos y demas contenidos del sitio son propiedad de la
              institucion o de sus respectivos titulares y estan protegidos por derechos aplicables.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">3. Restricciones</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>No usar el sitio para actividades ilicitas o fraudulentas.</li>
              <li>No copiar ni redistribuir contenido sin autorizacion cuando corresponda.</li>
              <li>No intentar afectar la seguridad o disponibilidad del portal.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">4. Enlaces externos</h2>
            <p>
              El sitio puede incluir enlaces a servicios de terceros. No controlamos sus politicas ni su
              contenido, por lo que recomendamos revisar sus terminos y privacidad.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">5. Cambios</h2>
            <p>
              Podemos actualizar estos terminos en cualquier momento. La fecha de actualizacion se
              mostrara en esta pagina.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">6. Contacto</h2>
            <p>
              Para consultas sobre estos terminos, usa los canales oficiales publicados en la seccion de
              contacto del sitio.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
