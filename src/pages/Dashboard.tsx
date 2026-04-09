import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  LogOut,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Bell,
  History,
  Clock,
} from 'lucide-react';
import type { AlumnoData, DetalleMovimiento } from '@/services/PortalAPI';
import logo from '@/assets/logo.png';

// Helpers

function formatCurrency(val?: number) {
  return `$${(val ?? 0).toFixed(2)}`;
}

function formatFecha(val?: string) {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatPeriodo(val?: string) {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('es-PA', { month: 'long', year: 'numeric' });
}

// Badge components

function EstadoBadge({ estado }: { estado: string }) {
  const e = String(estado || '').toUpperCase();
  if (e === 'PAGADO' || e === 'AL DIA' || e === 'AL_DIA')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300"><CheckCircle className="h-3 w-3" />Al día</span>;
  if (e === 'PENDIENTE')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300"><Clock className="h-3 w-3" />Pendiente</span>;
  if (e === 'VENCIDO' || e === 'MOROSO')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-400/20 text-red-300"><AlertCircle className="h-3 w-3" />Vencido</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/60">{estado || '—'}</span>;
}

function TipoMovBadge({ tipo }: { tipo: string }) {
  const t = String(tipo || '').toUpperCase();
  if (t === 'CARGO')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-400/20 text-red-300">Cargo</span>;
  if (t === 'PAGO')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300">Pago</span>;
  if (t === 'MORA')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-400/20 text-orange-300">Mora</span>;
  if (t === 'AJUSTE')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-400/20 text-blue-300">Ajuste</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/60">{tipo || '—'}</span>;
}

// Summary card

type AccentColor = 'green' | 'red' | 'amber' | 'blue';

const accentGradient: Record<AccentColor, string> = {
  green: 'from-emerald-500/25 to-emerald-700/10 border-emerald-400/25',
  red:   'from-red-500/25 to-red-700/10 border-red-400/25',
  amber: 'from-amber-500/25 to-amber-700/10 border-amber-400/25',
  blue:  'from-blue-500/25 to-blue-700/10 border-blue-400/25',
};
const accentIcon: Record<AccentColor, string> = {
  green: 'text-emerald-300',
  red:   'text-red-300',
  amber: 'text-amber-300',
  blue:  'text-blue-300',
};

function SummaryCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: AccentColor;
}) {
  return (
    <div className={`bg-gradient-to-br ${accentGradient[accent]} backdrop-blur-sm border rounded-2xl p-4 shadow-lg flex flex-col gap-1`}>
      <div className={`mb-1 ${accentIcon[accent]}`}>{icon}</div>
      <p className="text-white/55 text-xs leading-tight">{label}</p>
      <p className="text-white font-bold text-xl font-mono leading-tight break-all">{value}</p>
      {sub && <p className="text-white/45 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// Mobile movement card

function MovimientoCard({ mov }: { mov: DetalleMovimiento }) {
  return (
    <div className="p-4 border-b border-white/8 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 mr-2">
          <p className="text-white font-medium text-sm leading-tight">{mov.concepto}</p>
          <p className="text-white/50 text-xs mt-0.5">{formatFecha(mov.fechaMovimiento)} · {formatPeriodo(mov.periodo)}</p>
        </div>
        <TipoMovBadge tipo={mov.tipoMovimiento} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        {mov.cargo > 0 && (
          <div className="text-center bg-red-500/10 rounded-lg px-3 py-1.5">
            <p className="text-white/45 text-[10px]">Cargo</p>
            <p className="text-red-300 font-mono text-sm font-semibold">{formatCurrency(mov.cargo)}</p>
          </div>
        )}
        {mov.abono > 0 && (
          <div className="text-center bg-emerald-500/10 rounded-lg px-3 py-1.5">
            <p className="text-white/45 text-[10px]">Abono</p>
            <p className="text-emerald-300 font-mono text-sm font-semibold">{formatCurrency(mov.abono)}</p>
          </div>
        )}
        <div className="text-center bg-white/5 rounded-lg px-3 py-1.5 ml-auto">
          <p className="text-white/45 text-[10px]">Saldo</p>
          <p className="text-white font-mono text-sm font-semibold">{formatCurrency(mov.saldoAcumulado)}</p>
        </div>
      </div>
      <div className="mt-2"><EstadoBadge estado={mov.estado} /></div>
    </div>
  );
}

// Tabs

type TabId = 'estado-cuenta' | 'pagos' | 'documentos' | 'avisos';

const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'estado-cuenta', label: 'Estado de Cuenta', shortLabel: 'Cuenta',     icon: DollarSign },
  { id: 'pagos',         label: 'Historial de Pagos', shortLabel: 'Pagos',    icon: History },
  { id: 'documentos',    label: 'Documentos',          shortLabel: 'Docs',    icon: FileText },
  { id: 'avisos',        label: 'Avisos',              shortLabel: 'Avisos',  icon: Bell },
];

// Main component

export default function Dashboard() {
  const [studentData, setStudentData] = useState<AlumnoData | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('estado-cuenta');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('studentData');
    if (stored) {
      try {
        setStudentData(JSON.parse(stored));
      } catch {
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

  // Loading / no-data states

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(217,71%,18%)] to-[hsl(200,60%,32%)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(217,71%,18%)] to-[hsl(200,60%,32%)]">
        <div className="text-center">
          <p className="text-white/60 mb-4">Sesión no encontrada.</p>
          <Button asChild variant="outline" className="border-white/20 text-white bg-white/10 hover:bg-white/20">
            <Link to="/portal">Ir al portal</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Derived financial data

  const resumen = studentData.resumenFinanciero;
  const detalle = studentData.detalleMovimientos ?? [];

  const saldoFinal    = resumen?.saldoFinal    ?? studentData.saldo ?? 0;
  const totalCargos   = resumen?.totalCargos   ?? 0;
  const totalPagos    = resumen?.totalPagos    ?? 0;
  const mesesVencidos = resumen?.mesesVencidosImpagos ?? 0;

  const rawEstado = (resumen?.estadoMorosidad || resumen?.estadoCuenta || '').toUpperCase();
  const estadoLabel =
    rawEstado === 'AL DIA' || rawEstado === 'AL_DIA' || studentData.tieneMora === 'NO' && saldoFinal === 0
      ? 'Al día'
      : rawEstado === 'MOROSO' || studentData.tieneMora === 'SI'
        ? 'Moroso'
        : rawEstado === 'PENDIENTE'
          ? 'Pendiente'
          : saldoFinal > 0 ? 'Pendiente' : 'Al día';

  const estadoAccent: AccentColor =
    estadoLabel === 'Al día' ? 'green' : estadoLabel === 'Moroso' ? 'red' : 'amber';

  // Render

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[hsl(217,71%,16%)] via-[hsl(215,65%,23%)] to-[hsl(200,55%,30%)]">

      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0 overflow-hidden">
        <img
          src={logo}
          alt=""
          aria-hidden
          className="w-[85vw] max-w-2xl opacity-[0.11] select-none"
          style={{ filter: 'brightness(1.4) saturate(0.6)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={logo}
            alt="El Buen Pastor Golden Heaven"
            className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-md flex-shrink-0"
          />
          <div>
            <p className="text-white/55 text-[11px] sm:text-xs leading-tight uppercase tracking-wider">Centro Educativo</p>
            <h1 className="text-white font-heading font-bold text-base sm:text-xl md:text-2xl leading-tight">
              El Buen Pastor
              <span className="block sm:inline sm:ml-1 text-white/80">Golden Heaven</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Inicio</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/20 text-white bg-white/10 hover:bg-white/20 gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      {/* Student identity pill */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/15">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-white/90 text-sm font-medium truncate max-w-[200px] sm:max-w-none">
            {studentData.nombre}
          </span>
          <span className="text-white/40 text-xs hidden sm:inline">·</span>
          <span className="text-white/55 text-xs hidden sm:inline">{studentData.idAlumno}</span>
          {resumen?.grado && (
            <>
              <span className="text-white/40 text-xs hidden sm:inline">·</span>
              <span className="text-white/55 text-xs hidden sm:inline">{resumen.grado}</span>
            </>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="relative z-10 px-4 sm:px-6 pb-3 overflow-x-auto">
        <div
          className="flex gap-1 bg-white/8 backdrop-blur-sm rounded-xl p-1 border border-white/12 w-fit"
          style={{ minWidth: '100%' }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center sm:flex-none sm:justify-start ${
                  isActive
                    ? 'bg-white text-[hsl(217,71%,28%)] shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden text-xs">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 sm:px-6 pb-10 space-y-4">

        {/* TAB: Estado de Cuenta */}
        {activeTab === 'estado-cuenta' && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryCard
                label="Saldo Pendiente"
                value={formatCurrency(saldoFinal)}
                sub={resumen?.fechaCorte ? `Corte: ${formatFecha(resumen.fechaCorte)}` : undefined}
                icon={<DollarSign className="h-5 w-5" />}
                accent={saldoFinal > 0 ? 'amber' : 'green'}
              />
              <SummaryCard
                label="Estado de Cuenta"
                value={estadoLabel}
                sub={mesesVencidos > 0 ? `${mesesVencidos} mes${mesesVencidos > 1 ? 'es' : ''} vencido${mesesVencidos > 1 ? 's' : ''}` : undefined}
                icon={estadoLabel === 'Al día' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                accent={estadoAccent}
              />
              <SummaryCard
                label="Total Cargos"
                value={formatCurrency(totalCargos)}
                icon={<TrendingDown className="h-5 w-5" />}
                accent="blue"
              />
              <SummaryCard
                label="Total Pagos"
                value={formatCurrency(totalPagos)}
                icon={<TrendingUp className="h-5 w-5" />}
                accent="green"
              />
            </div>

            {/* Financial detail block */}
            <div className="backdrop-blur-sm bg-white/6 border border-white/12 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-heading font-semibold text-base">Estado de Cuenta</h2>
                  <p className="text-white/50 text-xs mt-0.5">
                    {detalle.length > 0
                      ? `${detalle.length} movimiento${detalle.length > 1 ? 's' : ''} registrado${detalle.length > 1 ? 's' : ''}`
                      : 'Sin movimientos registrados aún'}
                  </p>
                </div>
                {resumen?.ultimaFechaPago && (
                  <p className="text-white/40 text-xs hidden sm:block">
                    Último pago: {formatFecha(resumen.ultimaFechaPago)}
                  </p>
                )}
              </div>

              {detalle.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <DollarSign className="h-10 w-10 text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No hay movimientos en el estado de cuenta.</p>
                  <p className="text-white/25 text-xs mt-1">
                    Los datos se actualizan automáticamente al procesar cargos y pagos.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/8">
                          {['Fecha', 'Tipo', 'Concepto', 'Período', 'Cargo', 'Abono', 'Saldo', 'Estado'].map((h) => (
                            <th
                              key={h}
                              className={`px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide ${
                                ['Cargo', 'Abono', 'Saldo'].includes(h) ? 'text-right' : 'text-left'
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map((mov, i) => (
                          <tr
                            key={mov.detalleId || i}
                            className="border-b border-white/5 hover:bg-white/4 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-white/75 whitespace-nowrap">
                              {formatFecha(mov.fechaMovimiento)}
                            </td>
                            <td className="px-4 py-3">
                              <TipoMovBadge tipo={mov.tipoMovimiento} />
                            </td>
                            <td className="px-4 py-3 text-sm text-white/90 font-medium max-w-[200px] truncate">
                              {mov.concepto}
                            </td>
                            <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">
                              {formatPeriodo(mov.periodo)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-red-300 font-mono tabular-nums">
                              {mov.cargo > 0 ? formatCurrency(mov.cargo) : <span className="text-white/20">—</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-emerald-300 font-mono tabular-nums">
                              {mov.abono > 0 ? formatCurrency(mov.abono) : <span className="text-white/20">—</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-white font-mono font-semibold tabular-nums">
                              {formatCurrency(mov.saldoAcumulado)}
                            </td>
                            <td className="px-4 py-3">
                              <EstadoBadge estado={mov.estado} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden">
                    {detalle.map((mov, i) => (
                      <MovimientoCard key={mov.detalleId || i} mov={mov} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Totals footer (only if resumen available) */}
            {resumen && (
              <div className="backdrop-blur-sm bg-white/6 border border-white/12 rounded-xl px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Saldo anterior', value: resumen.saldoAnterior },
                  { label: 'Cargos del período', value: resumen.totalCargos },
                  { label: 'Pagos aplicados', value: resumen.totalPagos },
                  { label: 'Saldo final', value: resumen.saldoFinal },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-white/45 text-xs">{label}</p>
                    <p className="text-white font-mono font-semibold text-sm mt-0.5">{formatCurrency(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer note */}
            <p className="text-white/35 text-xs text-center pt-1">
              Para aclaraciones sobre cobros, comunícate con administración indicando tu número de alumno.
            </p>
          </>
        )}

        {/* TAB: Próximamente (Pagos / Documentos / Avisos) */}
        {activeTab !== 'estado-cuenta' && (
          <div className="backdrop-blur-sm bg-white/6 border border-white/12 rounded-2xl p-10 text-center shadow-xl">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'pagos'      && <History  className="h-7 w-7 text-white/50" />}
              {activeTab === 'documentos' && <FileText className="h-7 w-7 text-white/50" />}
              {activeTab === 'avisos'     && <Bell     className="h-7 w-7 text-white/50" />}
            </div>
            <h3 className="text-white font-heading font-semibold text-lg mb-1">Próximamente</h3>
            <p className="text-white/45 text-sm">Esta sección estará disponible en una próxima versión del portal.</p>
          </div>
        )}

      </main>
    </div>
  );
}
