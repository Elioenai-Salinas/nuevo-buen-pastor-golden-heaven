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
  Printer,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  Phone,
  Mail,
} from 'lucide-react';
import type { AlumnoData, DetalleMovimiento } from '@/services/PortalAPI';
import logo from '@/assets/logo.png';

// ─────────────────── Helpers ───────────────────

function formatCurrency(val?: number) {
  const n = val ?? 0;
  return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

function formatFecha(val?: string) {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatPeriodo(val?: string) {
  if (!val) return '—';
  // Format YYYY-MM as 'Mes YYYY'
  const match = String(val).match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const mes = meses[parseInt(match[2], 10) - 1] ?? match[2];
    return `${mes} ${match[1]}`;
  }
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('es-PA', { month: 'long', year: 'numeric' });
}

/** Convierte tipo técnico de GAS a etiqueta legible en español. */
function getTipoLabel(tipo: string): { label: string; icon: React.ReactNode; color: 'cargo' | 'pago' | 'mora' | 'ajuste' | 'neutro' } {
  const t = String(tipo || '').trim().toUpperCase();
  if (t === 'CARGO' || t === 'CARGO_ESCOLAR' || t === 'CARGA')
    return { label: 'Cargo', icon: <ArrowDownCircle className="h-3.5 w-3.5" />, color: 'cargo' };
  if (t === 'PAGO_APLICADO' || t === 'PAGO')
    return { label: 'Pago', icon: <ArrowUpCircle className="h-3.5 w-3.5" />, color: 'pago' };
  if (t === 'MORA' || t === 'CARGO_MORA')
    return { label: 'Mora', icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'mora' };
  if (t === 'RECARGO')
    return { label: 'Recargo', icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'mora' };
  if (t === 'DESCUENTO' || t === 'BECA')
    return { label: 'Descuento', icon: <MinusCircle className="h-3.5 w-3.5" />, color: 'ajuste' };
  if (t === 'AJUSTE')
    return { label: 'Ajuste', icon: <MinusCircle className="h-3.5 w-3.5" />, color: 'ajuste' };
  if (t === 'MATRICULA' || t === 'CARGO_MATRICULA')
    return { label: 'Matrícula', icon: <CreditCard className="h-3.5 w-3.5" />, color: 'cargo' };
  // Capitalizar el tipo original como fallback
  const label = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase().replace(/_/g, ' ');
  return { label, icon: <DollarSign className="h-3.5 w-3.5" />, color: 'neutro' };
}

/** Capitaliza un concepto proveniente del sheet (ej. MENSUALIDAD → Mensualidad) */
function formatConcepto(concepto: string): string {
  if (!concepto) return '—';
  return concepto.charAt(0).toUpperCase() + concepto.slice(1).toLowerCase();
}

/** Agrupa movimientos por período para mostrar encabezados de sección. */
function groupByPeriodo(movimientos: DetalleMovimiento[]): { periodo: string; movs: DetalleMovimiento[] }[] {
  const map = new Map<string, DetalleMovimiento[]>();
  for (const m of movimientos) {
    const key = m.periodo || '';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).map(([periodo, movs]) => ({ periodo, movs }));
}

// ─────────────────── Badge components ───────────────────

function EstadoCuentaBadge({ estado, tieneMora, saldo }: { estado: string; tieneMora?: string; saldo?: number }) {
  const e = String(estado || '').toUpperCase().replace(/\s/g, '_');
  const isMora = tieneMora === 'SI' || e === 'MOROSO';
  const isAlDia = e === 'AL_DIA' || e === 'AL DIA' || (tieneMora === 'NO' && (saldo ?? 0) === 0);

  if (isAlDia)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
        <CheckCircle className="h-4 w-4" />Al día
      </span>
    );
  if (isMora)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-300 border border-red-400/30">
        <AlertCircle className="h-4 w-4" />En mora
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
      <Clock className="h-4 w-4" />Pendiente
    </span>
  );
}

function TipoMovBadge({ tipo }: { tipo: string }) {
  const { label, icon, color } = getTipoLabel(tipo);
  const cls = {
    cargo:  'bg-red-400/15 text-red-200 border-red-400/25',
    pago:   'bg-emerald-400/15 text-emerald-200 border-emerald-400/25',
    mora:   'bg-orange-400/15 text-orange-200 border-orange-400/25',
    ajuste: 'bg-blue-400/15 text-blue-200 border-blue-400/25',
    neutro: 'bg-white/10 text-white/60 border-white/15',
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {icon}{label}
    </span>
  );
}

// ─────────────────── Summary Card ───────────────────

type AccentColor = 'green' | 'red' | 'amber' | 'blue';

const accentGradient: Record<AccentColor, string> = {
  green: 'from-emerald-500/20 to-emerald-700/5  border-emerald-400/25',
  red:   'from-red-500/20   to-red-700/5   border-red-400/25',
  amber: 'from-amber-500/20 to-amber-700/5  border-amber-400/25',
  blue:  'from-blue-500/20  to-blue-700/5   border-blue-400/25',
};
const accentText: Record<AccentColor, string> = {
  green: 'text-emerald-300',
  red:   'text-red-300',
  amber: 'text-amber-300',
  blue:  'text-blue-300',
};

function SummaryCard({
  label, value, sub, icon, accent,
}: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent: AccentColor;
}) {
  return (
    <div className={`bg-gradient-to-br ${accentGradient[accent]} backdrop-blur-sm border rounded-2xl p-5 shadow-lg flex flex-col gap-1.5`}>
      <div className={`${accentText[accent]} opacity-80`}>{icon}</div>
      <p className="text-white/50 text-xs uppercase tracking-wide font-medium mt-0.5">{label}</p>
      <p className={`font-bold text-2xl font-mono leading-tight tracking-tight ${accentText[accent]}`}>{value}</p>
      {sub && <p className="text-white/35 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// ─────────────────── Mobile Movement Card ───────────────────

function MovimientoCard({ mov }: { mov: DetalleMovimiento }) {
  const { color } = getTipoLabel(mov.tipoMovimiento);
  const leftBorder = {
    cargo:  'border-l-red-400/60',
    pago:   'border-l-emerald-400/60',
    mora:   'border-l-orange-400/60',
    ajuste: 'border-l-blue-400/60',
    neutro: 'border-l-white/20',
  }[color];

  return (
    <div className={`pl-4 pr-4 py-3.5 border-b border-white/6 last:border-0 border-l-4 ${leftBorder}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">{formatConcepto(mov.concepto)}</p>
          <p className="text-white/45 text-xs mt-0.5">{formatFecha(mov.fechaMovimiento)}</p>
        </div>
        <TipoMovBadge tipo={mov.tipoMovimiento} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        {mov.cargo > 0 && (
          <div className="bg-red-500/12 border border-red-400/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wide">Cargo</p>
            <p className="text-red-300 font-mono text-sm font-bold">{formatCurrency(mov.cargo)}</p>
          </div>
        )}
        {mov.abono > 0 && (
          <div className="bg-emerald-500/12 border border-emerald-400/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wide">Pago</p>
            <p className="text-emerald-300 font-mono text-sm font-bold">{formatCurrency(mov.abono)}</p>
          </div>
        )}
        {mov.ajuste > 0 && (
          <div className="bg-blue-500/12 border border-blue-400/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wide">Ajuste</p>
            <p className="text-blue-300 font-mono text-sm font-bold">{formatCurrency(mov.ajuste)}</p>
          </div>
        )}
        <div className="bg-white/6 border border-white/12 rounded-lg px-3 py-1.5 text-center ml-auto">
          <p className="text-white/40 text-[10px] uppercase tracking-wide">Saldo</p>
          <p className="text-white font-mono text-sm font-bold">{formatCurrency(mov.saldoAcumulado)}</p>
        </div>
      </div>
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

  // ─────────────────── Derived data ───────────────────

  const resumen = studentData.resumenFinanciero;
  const detalle = studentData.detalleMovimientos ?? [];
  const grupos  = groupByPeriodo(detalle);

  const saldoFinal    = resumen?.saldoFinal    ?? studentData.saldo ?? 0;
  const totalCargos   = resumen?.totalCargos   ?? 0;
  const totalPagos    = resumen?.totalPagos    ?? 0;
  const totalAjustes  = resumen?.totalAjustes  ?? 0;
  const mesesVencidos = resumen?.mesesVencidosImpagos ?? 0;

  const rawEstado     = (resumen?.estadoMorosidad || resumen?.estadoCuenta || '').toUpperCase();
  const tieneMora     = studentData.tieneMora;
  const isAlDia       = rawEstado === 'AL_DIA' || rawEstado === 'AL DIA' || (tieneMora === 'NO' && saldoFinal === 0);
  const isMoroso      = rawEstado === 'MOROSO' || tieneMora === 'SI';
  const estadoAccent: AccentColor = isAlDia ? 'green' : isMoroso ? 'red' : 'amber';
  const estadoLabel   = isAlDia ? 'Al día' : isMoroso ? 'En mora' : 'Pendiente';
  const fechaCorte    = resumen?.fechaCorte ? formatFecha(resumen.fechaCorte) : new Date().toLocaleDateString('es-PA', { day: '2-digit', month: 'long', year: 'numeric' });

  // ─────────────────── Render ───────────────────

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[hsl(217,71%,14%)] via-[hsl(215,65%,22%)] to-[hsl(200,55%,30%)]">

      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0 overflow-hidden">
        <img src={logo} alt="" aria-hidden className="w-[80vw] max-w-xl opacity-[0.07] select-none"
          style={{ filter: 'brightness(1.5) saturate(0.3)' }} />
      </div>

      {/* ── Top header bar ── */}
      <header className="relative z-10 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10 backdrop-blur-sm bg-white/5 print:bg-white print:text-black">
        <div className="flex items-center gap-3">
          <img src={logo} alt="El Buen Pastor Golden Heaven"
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm flex-shrink-0" />
          <div>
            <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest leading-tight">Centro Educativo</p>
            <h1 className="text-white font-heading font-bold text-sm sm:text-lg md:text-xl leading-tight">
              El Buen Pastor <span className="text-white/75">Golden Heaven</span>
            </h1>
            <p className="text-white/35 text-[10px] sm:text-xs mt-0.5">Portal para Padres · Estado de Cuenta</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => window.print()}
            className="text-white/50 hover:text-white hover:bg-white/10 hidden sm:flex gap-1.5 print:hidden">
            <Printer className="h-4 w-4" /><span className="text-xs">Imprimir</span>
          </Button>
          <Button variant="ghost" size="sm" asChild
            className="text-white/60 hover:text-white hover:bg-white/10 print:hidden">
            <Link to="/"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline ml-1 text-xs">Inicio</span></Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}
            className="border-white/20 text-white/80 bg-white/8 hover:bg-white/15 gap-1.5 print:hidden">
            <LogOut className="h-4 w-4" /><span className="hidden sm:inline text-xs">Salir</span>
          </Button>
        </div>
      </header>

      {/* ── Student identity ribbon ── */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 pb-0">
        <div className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-base">{studentData.nombre.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-base leading-tight">{studentData.nombre}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <span className="text-white/50 text-xs">{studentData.idAlumno}</span>
                  {resumen?.grado && <span className="text-white/50 text-xs">Grado: <span className="text-white/75">{resumen.grado}</span></span>}
                  {studentData.responsable && <span className="text-white/50 text-xs">Resp: <span className="text-white/75">{studentData.responsable}</span></span>}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <EstadoCuentaBadge estado={rawEstado} tieneMora={tieneMora} saldo={saldoFinal} />
              <p className="text-white/35 text-xs">Fecha de corte: {fechaCorte}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 pb-0 overflow-x-auto print:hidden">
        <div className="flex gap-1 bg-white/6 backdrop-blur-sm rounded-xl p-1 border border-white/10 w-fit" style={{ minWidth: '100%' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center sm:flex-none ${
                  isActive ? 'bg-white text-[hsl(217,71%,28%)] shadow-sm font-semibold' : 'text-white/55 hover:text-white hover:bg-white/10'
                }`}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="relative z-10 px-4 sm:px-6 pt-4 pb-10 space-y-4">

        {/* ════════════════ TAB: Estado de Cuenta ════════════════ */}
        {activeTab === 'estado-cuenta' && (
          <>
            {/* Summary cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SummaryCard
                label="Saldo actual"
                value={formatCurrency(saldoFinal)}
                sub={saldoFinal === 0 ? 'Sin deuda pendiente' : mesesVencidos > 0 ? `${mesesVencidos} mes${mesesVencidos !== 1 ? 'es' : ''} por pagar` : 'Hay pagos pendientes'}
                icon={<DollarSign className="h-5 w-5" />}
                accent={saldoFinal === 0 ? 'green' : isMoroso ? 'red' : 'amber'}
              />
              <SummaryCard
                label="Estado"
                value={estadoLabel}
                sub={isAlDia ? 'Cuenta al corriente' : isMoroso ? 'Requiere atención' : 'Pendiente de pago'}
                icon={isAlDia ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                accent={estadoAccent}
              />
              <SummaryCard
                label="Total cargos"
                value={formatCurrency(totalCargos)}
                sub="Cobros del período"
                icon={<TrendingDown className="h-5 w-5" />}
                accent="blue"
              />
              <SummaryCard
                label="Total pagos"
                value={formatCurrency(totalPagos)}
                sub="Pagos aplicados"
                icon={<TrendingUp className="h-5 w-5" />}
                accent="green"
              />
            </div>

            {/* ── Estado de cuenta equation card ── */}
            {resumen && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/8">
                  <h3 className="text-white/60 text-xs uppercase tracking-widest font-semibold">Resumen financiero</h3>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-white/8">
                  {[
                    { label: 'Saldo anterior',   value: resumen.saldoAnterior, prefix: '',  color: 'text-white/80' },
                    { label: '+ Cargos período', value: totalCargos,            prefix: '+', color: 'text-red-300' },
                    { label: '− Pagos aplicados',value: totalPagos,             prefix: '−', color: 'text-emerald-300' },
                    { label: '= Saldo actual',   value: saldoFinal,             prefix: '=', color: saldoFinal === 0 ? 'text-emerald-300' : 'text-amber-300', bold: true },
                  ].map(({ label, value, prefix, color, bold }) => (
                    <div key={label} className="px-4 first:pl-0 last:pr-0 text-center">
                      <p className="text-white/35 text-[10px] uppercase tracking-wide">{label}</p>
                      <p className={`font-mono font-${bold ? 'bold text-lg' : 'semibold text-sm'} mt-1 ${color}`}>
                        <span className="text-white/30 mr-0.5 text-xs">{prefix}</span>
                        {formatCurrency(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Movements detail table ── */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Block header */}
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-heading font-semibold text-sm uppercase tracking-wide">
                    Detalle de movimientos
                  </h2>
                  <p className="text-white/40 text-xs mt-0.5">
                    {detalle.length > 0
                      ? `${detalle.length} movimiento${detalle.length !== 1 ? 's' : ''} · ${grupos.length} período${grupos.length !== 1 ? 's' : ''}`
                      : 'Sin movimientos registrados'}
                  </p>
                </div>
                {resumen?.ultimaFechaPago && (
                  <div className="text-right hidden sm:block">
                    <p className="text-white/30 text-[10px] uppercase tracking-wide">Último pago</p>
                    <p className="text-white/60 text-xs font-medium">{formatFecha(resumen.ultimaFechaPago)}</p>
                  </div>
                )}
              </div>

              {detalle.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <DollarSign className="h-10 w-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/35 text-sm">No hay movimientos en este período.</p>
                  <p className="text-white/20 text-xs mt-1">Los datos se actualizan al procesar cargos y pagos.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table — grouped by period */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-white/8 bg-white/3">
                          {[
                            { h: 'Fecha',       align: 'left'  },
                            { h: 'Tipo',        align: 'left'  },
                            { h: 'Descripción', align: 'left'  },
                            { h: 'Cargo',       align: 'right' },
                            { h: 'Pago',        align: 'right' },
                            { h: 'Saldo',       align: 'right' },
                          ].map(({ h, align }) => (
                            <th key={h}
                              className={`px-4 py-2.5 text-[10px] font-bold text-white/35 uppercase tracking-widest text-${align}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {grupos.map(({ periodo, movs }) => (
                          <>
                            {/* Period header row */}
                            <tr key={`period-${periodo}`} className="bg-white/4 border-y border-white/8">
                              <td colSpan={6} className="px-4 py-2">
                                <span className="text-white/55 text-xs font-semibold uppercase tracking-widest">
                                  📅 Período: {formatPeriodo(periodo)}
                                </span>
                              </td>
                            </tr>
                            {/* Movement rows */}
                            {movs.map((mov, i) => {
                              const { color } = getTipoLabel(mov.tipoMovimiento);
                              const rowTint = color === 'cargo' ? 'hover:bg-red-500/5'
                                : color === 'pago' ? 'hover:bg-emerald-500/5'
                                : 'hover:bg-white/3';
                              const leftBorder = color === 'cargo' ? 'border-l-2 border-l-red-400/50'
                                : color === 'pago' ? 'border-l-2 border-l-emerald-400/50'
                                : color === 'mora' ? 'border-l-2 border-l-orange-400/50'
                                : '';
                              return (
                                <tr key={mov.detalleId || `${periodo}-${i}`}
                                  className={`border-b border-white/4 transition-colors ${rowTint} ${leftBorder}`}>
                                  <td className="px-4 py-3 text-xs text-white/60 whitespace-nowrap">
                                    {formatFecha(mov.fechaMovimiento)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <TipoMovBadge tipo={mov.tipoMovimiento} />
                                  </td>
                                  <td className="px-4 py-3 text-sm text-white/85 font-medium">
                                    {formatConcepto(mov.concepto)}
                                    {mov.descripcion && mov.descripcion !== 'Pago aplicado desde APLICACION_PAGOS.' && (
                                      <p className="text-white/30 text-xs font-normal mt-0.5 leading-tight">{mov.descripcion}</p>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-mono tabular-nums">
                                    {mov.cargo > 0
                                      ? <span className="text-red-300 font-semibold">{formatCurrency(mov.cargo)}</span>
                                      : <span className="text-white/15">—</span>}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-mono tabular-nums">
                                    {mov.abono > 0
                                      ? <span className="text-emerald-300 font-semibold">{formatCurrency(mov.abono)}</span>
                                      : mov.ajuste > 0
                                        ? <span className="text-blue-300 font-semibold">{formatCurrency(mov.ajuste)}</span>
                                        : <span className="text-white/15">—</span>}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right font-mono font-bold tabular-nums">
                                    <span className={mov.saldoAcumulado > 0 ? 'text-amber-200' : 'text-emerald-300'}>
                                      {formatCurrency(mov.saldoAcumulado)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards — also grouped by period */}
                  <div className="md:hidden">
                    {grupos.map(({ periodo, movs }) => (
                      <div key={`m-${periodo}`}>
                        <div className="px-4 py-2 bg-white/4 border-y border-white/8">
                          <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                            Período: {formatPeriodo(periodo)}
                          </span>
                        </div>
                        {movs.map((mov, i) => (
                          <MovimientoCard key={mov.detalleId || `${periodo}-${i}`} mov={mov} />
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── Contact / institution footer ── */}
            <div className="bg-white/4 border border-white/8 rounded-2xl px-5 py-4">
              <p className="text-white/45 text-xs text-center leading-relaxed">
                Para consultas sobre cobros o aclaraciones, comuníquese con administración indicando el número de alumno <strong className="text-white/65">{studentData.idAlumno}</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {studentData.correoResponsable && (
                  <span className="inline-flex items-center gap-1.5 text-white/40 text-xs">
                    <Mail className="h-3.5 w-3.5" />{studentData.correoResponsable}
                  </span>
                )}
                {studentData.telefonoResponsable && (
                  <span className="inline-flex items-center gap-1.5 text-white/40 text-xs">
                    <Phone className="h-3.5 w-3.5" />{studentData.telefonoResponsable}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* ════════════════ TAB: Próximamente ════════════════ */}
        {activeTab !== 'estado-cuenta' && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-10 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-white/8 border border-white/12 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'pagos'      && <History  className="h-7 w-7 text-white/40" />}
              {activeTab === 'documentos' && <FileText className="h-7 w-7 text-white/40" />}
              {activeTab === 'avisos'     && <Bell     className="h-7 w-7 text-white/40" />}
            </div>
            <h3 className="text-white font-heading font-semibold text-lg mb-2">Próximamente</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">Esta sección estará disponible en una próxima actualización del portal.</p>
          </div>
        )}

      </main>
    </div>
  );
}
