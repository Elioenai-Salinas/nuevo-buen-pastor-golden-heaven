import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  LogOut,
  CreditCard,
  User,
  Mail,
  DollarSign
} from 'lucide-react';
import type { AlumnoData } from '@/services/PortalAPI';

export default function Dashboard() {
  const [studentData, setStudentData] = useState<AlumnoData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('studentData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStudentData(data);
      } catch (error) {
        console.error('Error parsing student data:', error);
        navigate('/portal');
      }
    } else {
      navigate('/portal');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('studentData');
    navigate('/portal');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-pastel-blue/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-pastel-blue/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No hay datos disponibles</p>
          <Button asChild>
            <Link to="/portal">Volver al portal</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-pastel-blue/20">
      {/* Header */}
      <div className="container py-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Inicio
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-12">
        {/* Student Info Header */}
        <div className="bg-card rounded-2xl p-8 border border-border/50 mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            {studentData.nombre}
          </h1>
          <p className="text-muted-foreground text-lg mb-6">ID: {studentData.idAlumno}</p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Saldo Final */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Pendiente</p>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${(studentData.saldo || 0).toFixed(2)}
              </p>
            </div>

            {/* Estado de Cuenta */}
            <div className={`rounded-lg p-6 border ${
              studentData.mora.estado === 'ACTIVA'
                ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800' 
                : 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  studentData.mora.estado === 'ACTIVA'
                    ? 'bg-red-500/20' 
                    : 'bg-green-500/20'
                }`}>
                  {studentData.mora.estado === 'ACTIVA' ? (
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Estado de Cuenta</p>
              </div>
              <p className={`text-lg font-bold ${
                studentData.mora.estado === 'ACTIVA'
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {studentData.mora.estado === 'ACTIVA' ? 'Con Mora' : 'Al Día'}
              </p>
            </div>

            {/* Estado General */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
              </div>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {studentData.mora.estado}
              </p>
            </div>
          </div>
        </div>

        {/* Responsable Info */}
        {studentData.responsable && (
          <div className="bg-card rounded-2xl p-8 border border-border/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <User className="h-6 w-6" />
              Información del Responsable
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-muted-foreground mb-1">Nombre</p>
                <p className="text-lg font-semibold text-foreground">
                  {studentData.responsable}
                </p>
              </div>

              {studentData.mora.monto > 0 && (
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium text-muted-foreground">Monto de Mora</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    ${studentData.mora.monto.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-card rounded-2xl p-8 border border-border/50 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">Información Adicional</h2>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Última actualización</p>
            <p className="text-lg font-semibold text-foreground">
              {new Date(studentData.ultimaActualizacion).toLocaleString('es-ES')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Si tienes preguntas sobre tu estado de cuenta, por favor contacta con la administración del colegio.
          </p>
          <Button asChild variant="outline">
            <Link to="/contacto">Contactar Administración</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
