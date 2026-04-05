/**
 * PortalAPI.ts
 * Cliente para conectar el Portal de Netlify con Google Sheets
 * 
 * USO:
 * 1. Configura API_URL (obtenida de v3PortalApiGetPublicUrl() en Apps Script)
 * 2. Configura API_TOKEN (obtenida de v3PortalApiSetupToken() en Apps Script)
 * 3. Importa este archivo en Portal.tsx
 * 4. Usa las funciones para obtener datos del Google Sheet
 */

// ===== CONFIGURACIÓN =====
// Reemplaza estas URLs y tokens con los valores de tu proyecto

const API_URL = 'https://script.google.com/macros/s/AKfycbzjPGUfQabCLwLwUnv6ItSqyHFjywOiZ0tQ_Ngv8tWMLA7dzAfjUG5oZ9ANM8QzX3nh/exec';
// Obtén el SCRIPT_ID ejecutando v3PortalApiGetPublicUrl() en Apps Script

const API_TOKEN = '52f5e694-0eb3-40ee-ba39-9ece990b0669';
// Obtén el token ejecutando v3PortalApiSetupToken() en Apps Script

// ===== INTERFACES =====

export interface AlumnoData {
  idAlumno: string;
  nombre: string;
  saldo: number;
  mora: {
    monto: number;
    estado: string;
  };
  responsable: string;
  ultimaActualizacion: string;
}

export interface AlumnoListItem {
  idAlumno: string;
  nombre: string;
}

export interface ApiResponse<T> {
  version: string;
  timestamp: string;
  action: string;
  success: boolean;
  data: T | null;
  error: string | null;
}

// ===== FUNCIONES DE API =====

/**
 * Obtiene la lista de alumnos activos
 */
export async function getAlumnoList(): Promise<AlumnoListItem[]> {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'getAlumnoList');
  url.searchParams.set('token', API_TOKEN);

  const response = await fetch(url.toString());
  const data: ApiResponse<AlumnoListItem[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Error al obtener lista de alumnos');
  }

  return data.data || [];
}

/**
 * Obtiene los datos de estado de cuenta de un alumno
 */
export async function getAlumnoData(idAlumno: string): Promise<AlumnoData | null> {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'getAlumnoData');
  url.searchParams.set('id', idAlumno);
  url.searchParams.set('token', API_TOKEN);

  const response = await fetch(url.toString());
  const data: ApiResponse<AlumnoData> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Error al obtener datos del alumno');
  }

  return data.data || null;
}

/**
 * Verifica el estado de la API
 */
export async function getSystemStatus() {
  const url = new URL(API_URL);
  url.searchParams.set('action', 'getStatus');
  url.searchParams.set('token', API_TOKEN);

  const response = await fetch(url.toString());
  return await response.json();
}

/**
 * Autentica un user por ID de alumno
 * (En una implementación real, validarías contra una base de datos)
 */
export async function loginAlumno(idAlumno: string, password?: string): Promise<AlumnoData | null> {
  // En un flujo real, validarías password contra una fuente segura.
  // Por ahora, devolvemos los datos si el ID existe.

  const alumno = await getAlumnoData(idAlumno);
  if (!alumno) {
    throw new Error('Alumno no encontrado');
  }

  return alumno;
}
