import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAlumno } from '@/services/PortalAPI';
import { 
  User, 
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Bell,
  CreditCard,
  TrendingUp,
  LogIn
} from 'lucide-react';

import logo from '@/assets/logo.png';

const features = [
  {
    icon: BookOpen,
    title: 'Notas en línea',
    description: 'Consulta las calificaciones de tu hijo en tiempo real.',
  },
  {
    icon: TrendingUp,
    title: 'Seguimiento de progreso',
    description: 'Observaciones de docentes sobre el desarrollo de tu hijo.',
  },
  {
    icon: Bell,
    title: 'Comunicados',
    description: 'Recibe avisos importantes directamente del colegio.',
  },
  {
    icon: CreditCard,
    title: 'Estado de cuenta',
    description: 'Revisa pagos pendientes y realiza transacciones.',
  },
];

export default function Portal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const form = e.currentTarget as HTMLFormElement;
    const credInput = form.querySelector('#credencial') as HTMLInputElement;
    const credencial = credInput?.value?.trim() || '';

    try {
      if (!credencial) {
        setError('Por favor ingresa tu credencial de acceso');
        setIsLoading(false);
        return;
      }

      const studentData = await loginAlumno(credencial);

      if (studentData) {
        sessionStorage.setItem('studentData', JSON.stringify(studentData));
        navigate('/dashboard');
      } else {
        setError('Credencial incorrecta');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la conexión');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-pastel-blue/20 flex flex-col">
      {/* Back to home */}
      <div className="container py-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <div className="flex-1 container flex items-center justify-center py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Logo" className="h-16 w-16" />
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Portal para Padres</h2>
                <p className="text-muted-foreground text-sm">Centro Educativo El Buen Pastor</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Accede al portal exclusivo para padres y mantente informado sobre 
              el progreso académico de tus hijos, comunicados importantes y el 
              estado de cuenta.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-card/50 backdrop-blur rounded-xl p-4 border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <feature.icon className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border/50 max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="lg:hidden flex justify-center mb-4">
                  <img src={logo} alt="Logo" className="h-20 w-20" />
                </div>
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 hidden lg:block" />
                <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
                  Iniciar Sesión
                </h1>
                <p className="text-muted-foreground text-sm">
                  Ingresa tus credenciales para acceder
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="credencial">Credencial de acceso</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="credencial"
                      placeholder="EBP-0001-482-193-027-654"
                      className="pl-10 font-mono tracking-wider"
                      required
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Ingresa la credencial completa que te entregó la administración</p>
                </div>

                <Button 
                  type="submit" 
                  variant="cta" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Ingresar al Portal
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  ¿No tienes acceso al portal?
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contacto">
                    Contactar Administración
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile features */}
            <div className="lg:hidden mt-8">
              <h3 className="font-heading font-semibold text-center text-foreground mb-4">
                ¿Qué puedes hacer en el portal?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div 
                    key={feature.title}
                    className="bg-card/50 rounded-lg p-3 text-center border border-border/50"
                  >
                    <feature.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xs font-medium text-foreground">{feature.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="container py-6 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Centro Educativo El Buen Pastor Golden Heaven
        </p>
      </div>
    </div>
  );
}
