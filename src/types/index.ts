export type DispositionType = 'CT' | 'E' | 'S' | 'D';

export interface TVDRow {
  id: string;
  dep: string;
  serie: string;
  subserie?: string;
  ac: number; // Años Archivo Central
  disp: DispositionType;
  per: 'p1' | 'p2' | 'p3';
  codigo: string;
  justificacion: string;
}

export interface HistoricalMilestone {
  y: number;
  t: string;
  d: string;
  per: 'p1' | 'p2' | 'p3';
  marcoLegal: string;
  detalles: string;
}

export interface DocumentRecord {
  id: string;
  radicado: string;
  serie: string;
  dep: string;
  fecha: string;
  folios: number;
  tipo: 'Oficio' | 'Resolución' | 'Acta' | 'Historia Laboral' | 'Contrato' | 'Expediente Aprendiz';
  soporte: 'Físico' | 'Electrónico' | 'Híbrido';
  hash: string;
  estado: 'Radicado' | 'En Custodia' | 'En Digitalización' | 'Para Transferencia';
}

export interface DocumentRisk {
  id: string;
  n: string;
  p: number; // 1-5 Probabilidad
  i: number; // 1-5 Impacto
  c: number; // 0-1 Eficacia del Control
  t: 'Reducir' | 'Modificar' | 'Compartir' | 'Evitar';
  dep: string;
  descripcion: string;
  controlActual: string;
  planAccion: string;
}

export interface CCDNode {
  codigo: string;
  nombre: string;
  version: string;
  retencion: string;
  disp: DispositionType;
  subseries?: {
    codigo: string;
    nombre: string;
    version: string;
    retencion: string;
  }[];
}
