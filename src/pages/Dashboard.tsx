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
  Phone,
  DollarSign
} from 'lucide-react';
import type { AlumnoData } from '@/services/PortalAPI';
import logo from '@/assets/logo.png';

function formatFecha(value?: string) {
  if (!value) return 'No disponible';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('es-PA');
}

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

  const tieneMora = studentData.tieneMora || (studentData.mora?.estado === 'ACTIVA' ? 'SI' : 'NO');
  const estadoCuenta =
    tieneMora === 'SI'
      ? 'Con mora activa'
      : (studentData.saldo > 0 ? 'Saldo pendiente sin mora' : 'Al dia');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary via-background to-pastel-blue/20">
      {/* Marca de agua */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="w-[70vw] max-w-4xl opacity-[0.06] select-none"
        />
      </div>

      <div className="relative z-10 container py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="El Buen Pastor" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Centro Educativo El Buen Pastor Golden Heaven</p>
            <p className="text-sm md:text-base font-semibold text-foreground">Estado de Cuenta de Padres</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      <div className="relative z-10 container max-w-6xl pb-12 pt-4">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl border bg-card/95 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              Saldo pendiente
            </div>
            <p className="text-3xl font-bold text-foreground">${(studentData.saldo || 0).toFixed(2)}</p>
          </div>

          <div className="rounded-xl border bg-card/95 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <AlertCircle className="h-4 w-4" />
              Tiene mora
            </div>
            <p className={`text-2xl font-bold ${tieneMora === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {tieneMora}
            </p>
          </div>

          <div className="rounded-xl border bg-card/95 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CreditCard className="h-4 w-4" />
              Estado de cuenta
            </div>
            <p className="text-xl font-semibold text-foreground">{estadoCuenta}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/95 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b bg-muted/30">
            <h2 className="text-lg font-semibold text-foreground">Detalle del estado de cuenta</h2>
            <p className="text-sm text-muted-foreground">Información consolidada para revisión de padres de familia</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-muted/20 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Campo</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">ID del alumno</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.idAlumno}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Nombre del alumno</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.nombre}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Responsable principal</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.responsable || 'No disponible'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Correo del responsable</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.correoResponsable || 'No disponible'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Teléfono del responsable</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{studentData.telefonoResponsable || 'No disponible'}</span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Saldo pendiente</td>
                  <td className="px-5 py-3 text-sm font-semibold text-foreground">${(studentData.saldo || 0).toFixed(2)}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Tiene mora</td>
                  <td className="px-5 py-3 text-sm font-semibold">
                    <span className={tieneMora === 'SI' ? 'text-red-600' : 'text-green-600'}>{tieneMora}</span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Monto en mora</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">${(studentData.mora?.monto || 0).toFixed(2)}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Último período pendiente</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.ultimoPeriodoPendiente || 'No aplica'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Estado de exportación</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{studentData.estadoExportacion || 'No disponible'}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-3 text-sm text-muted-foreground">Última actualización</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{formatFecha(studentData.ultimaActualizacion)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border bg-card/95 p-5 text-sm text-muted-foreground">
          Para aclaraciones de cobros, comunícate con administración e indica el ID del alumno.
        </div>
      </div>
    </div>
  );
}
