import React, { useState } from 'react';
import { TVDRow, DocumentRisk, DocumentRecord } from '../types';
import { soundService } from '../services/soundService';
import {
  FileText,
  ShieldAlert,
  Database,
  Layers,
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Eye,
  Plus,
} from 'lucide-react';

export type AppMode = 'overview' | 'sgd' | 'tvd' | 'risks' | 'ventanilla';

interface V2ModulesViewProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  totalDocs: number;
  docFeed: DocumentRecord[];
  tvdRows: TVDRow[];
  risks: DocumentRisk[];
  onOpenRadicarModal: () => void;
  onSelectRisk: (risk: DocumentRisk) => void;
}

export const V2ModulesView: React.FC<V2ModulesViewProps> = ({
  currentMode,
  totalDocs,
  docFeed,
  tvdRows,
  risks,
  onOpenRadicarModal,
  onSelectRisk,
}) => {
  // Sub-tabs for SGD
  const [sgdTab, setSgdTab] = useState<'requisitos' | 'checklist' | 'flujo' | 'auditorias'>('requisitos');
  // Sub-tabs for TVD
  const [tvdTab, setTvdTab] = useState<'fondos' | 'matriz' | 'convalidacion'>('fondos');
  // Sub-tabs for Risks
  const [riskTab, setRiskTab] = useState<'matriz' | 'controles' | 'apetito'>('matriz');
  // Search in Ventanilla
  const [ventanillaSearch, setVentanillaSearch] = useState<string>('');
  const [ventanillaTypeFilter, setVentanillaTypeFilter] = useState<string>('all');

  const handleSubTabChange = (setter: (val: any) => void, val: any) => {
    soundService.playBlip(600);
    setter(val);
  };

  /* =========================================================
     MÓDULO 01 · SGD (ISO 30301)
     ========================================================= */
  const renderSGDModule = () => (
    <div className="vw">
      {/* View Header */}
      <div className="vh">
        <h2>01 · SISTEMA DE GESTIÓN PARA DOCUMENTOS (NTC-ISO 30301)</h2>
        <p>
          Marco directivo para la creación, captura, gestión, mantenimiento y disposición de documentos
          auténticos, fiables e íntegros en el SENA. Alineado con la política archivística nacional del AGN.
        </p>
      </div>

      {/* Secondary KPIs */}
      <div className="span2 kpis2">
        <div className="kc">
          <small>Nivel de Madurez SGD</small>
          <b>3.6 / 5.0</b>
          <em>Nivel Gestionado (Optimización Continua)</em>
        </div>
        <div className="kc">
          <small>Requisitos ISO Cumplidos</small>
          <b>24 / 27</b>
          <em>88.8% Conformidad Auditada</em>
        </div>
        <div className="kc">
          <small>Calidad de Metadatos</small>
          <b>96.4%</b>
          <em>Esquema Dublin Core Institucional</em>
        </div>
        <div className="kc">
          <small>Expedientes en Custodia</small>
          <b>{totalDocs.toLocaleString('es-CO')}</b>
          <em>Integridad SHA-256 Verificada</em>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="tabs">
        <button
          type="button"
          onClick={() => handleSubTabChange(setSgdTab, 'requisitos')}
          className={`cbtn ${sgdTab === 'requisitos' ? 'on' : ''}`}
        >
          Requisitos Normativos (PHVA)
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setSgdTab, 'checklist')}
          className={`cbtn ${sgdTab === 'checklist' ? 'on' : ''}`}
        >
          Checklist de Conformidad
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setSgdTab, 'flujo')}
          className={`cbtn ${sgdTab === 'flujo' ? 'on' : ''}`}
        >
          Flujo de Procesos Documentales
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setSgdTab, 'auditorias')}
          className={`cbtn ${sgdTab === 'auditorias' ? 'on' : ''}`}
        >
          Auditorías y No Conformidades
        </button>
      </div>

      {/* TAB 1: Requisitos PHVA */}
      {sgdTab === 'requisitos' && (
        <div className="pane">
          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66]">PLANIFICAR (PLAN) · POLÍTICAS & LIDERAZGO</h3>
              <span className="chip" style={{ ['--c' as any]: '#00FF66' }}>CLÁUSULAS 4 & 5</span>
            </header>
            <div className="body">
              <ul className="ul">
                <li>
                  <b>4.1 Contexto Organizacional:</b> Determinación de factores internos y externos del SENA frente al AGN y entes de control.
                  <small>Matriz DOFA archivística y mapa de partes interesadas.</small>
                </li>
                <li>
                  <b>5.1 Liderazgo y Compromiso:</b> Adopción de la política documental por el Consejo Directivo Nacional.
                  <small>Resolución de adopción de directrices archivísticas institucionales.</small>
                </li>
                <li>
                  <b>5.2 Política de Gestión Documental:</b> Marco integral obligatorio para las 33 Regionales y Dirección General.
                  <small>Disponible en el sistema de gestión integrado SIGA.</small>
                </li>
              </ul>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00E5FF]">HACER (DO) · OPERACIÓN & CONTROLES</h3>
              <span className="chip" style={{ ['--c' as any]: '#00E5FF' }}>CLÁUSULA 8</span>
            </header>
            <div className="body">
              <ul className="ul">
                <li>
                  <b>8.1 Procesos Documentales:</b> Creación, captura, radicación, distribución, custodia y disposición final.
                  <small>Interoperabilidad de ventanilla única y archivo central.</small>
                </li>
                <li>
                  <b>8.2 Reglas de Metadatos:</b> Dublin Core adaptado al AGN (autor, asunto, código CCD, folios, vigencia).
                  <small>Validación criptográfica en la radicación de expedientes.</small>
                </li>
                <li>
                  <b>8.3 Disposición y Preservación:</b> Aplicación de tablas TVD y preservación a largo plazo PDF/A.
                  <small>Cronograma de transferencias secundarias hacia el AGN.</small>
                </li>
              </ul>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#ffb020]">VERIFICAR (CHECK) · EVALUACIÓN DE DESEMPEÑO</h3>
              <span className="chip" style={{ ['--c' as any]: '#ffb020' }}>CLÁUSULA 9</span>
            </header>
            <div className="body">
              <ul className="ul">
                <li>
                  <b>9.1 Seguimiento y Medición:</b> Indicadores clave de oportunidad en radicación y tiempos de respuesta.
                  <small>Tiempo promedio de despacho: 1.8 días hábiles.</small>
                </li>
                <li>
                  <b>9.2 Auditoría Interna:</b> Programa anual de auditorías archivísticas a dependencias y archivos de gestión.
                  <small>12 auditorías cerradas / 5 en curso durante la vigencia 2026.</small>
                </li>
                <li>
                  <b>9.3 Revisión por la Dirección:</b> Informe semestral de estado al Comité Institucional de Gestión y Desempeño.
                </li>
              </ul>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66]">ACTUAR (ACT) · MEJORA CONTINUA</h3>
              <span className="chip" style={{ ['--c' as any]: '#00FF66' }}>CLÁUSULA 10</span>
            </header>
            <div className="body">
              <ul className="ul">
                <li>
                  <b>10.1 No Conformidad y Acción Correctiva:</b> Cierre de hallazgos de auditorías de Control Interno y AGN.
                  <small>4 no conformidades abiertas; 9 de 11 acciones correctivas en plazo.</small>
                </li>
                <li>
                  <b>10.2 Mejora Continua:</b> Automatización de flujos y foliación electrónica de expedientes híbridos.
                </li>
              </ul>
              <div className="note">
                ⚠ REQUISITO AUDITORÍA AGN: Todo fondo documental debe contar con plan de contingencia física y digital actualizado cada 12 meses.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Checklist de Conformidad */}
      {sgdTab === 'checklist' && (
        <div className="span2">
          <div className="cl-grid">
            {[
              { n: '01', t: 'Política Documental Institucional', desc: 'Aprobada por el Comité de Gestión y Desempeño y publicada en la intranet.', st: '100% CUMPLIDO', col: '#00FF66' },
              { n: '02', t: 'Cuadro de Clasificación Documental (CCD)', desc: 'Estructura codificada por funciones y dependencias productoras.', st: '100% CUMPLIDO', col: '#00FF66' },
              { n: '03', t: 'Ventanilla Única de Correspondencia', desc: 'Canal unificado físico y virtual con asignación estricta de consecutivo.', st: '100% CUMPLIDO', col: '#00FF66' },
              { n: '04', t: 'Tablas de Retención (TRD) y Valoración (TVD)', desc: 'Convalidación en proceso ante el Consejo Departamental de Archivos.', st: '85% EN PROGRESO', col: '#00E5FF' },
              { n: '05', t: 'Programa de Gestión Documental (PGD)', desc: '8 fases archivísticas estandarizadas y presupuestadas.', st: '90% CUMPLIDO', col: '#00FF66' },
              { n: '06', t: 'Plan Institucional de Archivos (PINAR)', desc: 'Proyectos prioritarios de intervención del fondo acumulado.', st: '80% EN PROGRESO', col: '#00E5FF' },
              { n: '07', t: 'Preservación Digital a Largo Plazo', desc: 'Repositorio seguro para documentos electrónicos nativos (PDF/A).', st: '70% EN AJUSTE', col: '#ffb020' },
              { n: '08', t: 'Gestión de Riesgos Documentales (ISO 31000)', desc: 'Mapa de calor 5x5 calibrado y controles periódicos implementados.', st: '95% CUMPLIDO', col: '#00FF66' },
            ].map(item => (
              <details key={item.n} className="acc" open>
                <summary>
                  <span className="cn">{item.n}</span>
                  <span className="ct font-bold">{item.t}</span>
                  <span className="chip" style={{ ['--c' as any]: item.col }}>{item.st}</span>
                </summary>
                <div className="accb text-[#7fa292]">
                  {item.desc}
                  <div className="chips mt-2">
                    <span className="chip" style={{ ['--c' as any]: '#00E5FF' }}>EVIDENCIA VERIFICADA</span>
                    <span className="chip" style={{ ['--c' as any]: '#7fa292' }}>AUDITORÍA 2026</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Flujo de Procesos Documentales */}
      {sgdTab === 'flujo' && (
        <div className="span2">
          <div className="panel cyber-panel p-5 border border-[#39A900]/60 bg-[#080C16]">
            <header className="pb-3 mb-4 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                RUTA DEL EXPEDIENTE DOCUMENTAL · OPERACIÓN SEGÚN ISO 30301
              </h3>
            </header>

            <div className="flow mb-6">
              <div className="st">
                <b>1. PRODUCCIÓN / RECEPCIÓN</b>
                Generación del documento u oficio por dependencias o ventanilla virtual.
                <small className="block text-[#7fa292] mt-1">Revisión de competencia y anexos.</small>
              </div>
              <div className="st">
                <b>2. RADICACIÓN & HASH</b>
                Asignación de consecutivo único institucional, fecha/hora y hash SHA-256.
                <small className="block text-[#7fa292] mt-1">Impresión de sticker / firma electrónica.</small>
              </div>
              <div className="st">
                <b>3. CLASIFICACIÓN CCD</b>
                Asociación obligatoria al código de serie y subserie del Cuadro de Clasificación.
                <small className="block text-[#7fa292] mt-1">Vinculación al expediente madre.</small>
              </div>
              <div className="st">
                <b>4. TRÁMITE & CUSTODIA</b>
                Gestión operativa por el funcionario competente y archivo de gestión.
                <small className="block text-[#7fa292] mt-1">Trazabilidad de préstamos y traslados.</small>
              </div>
              <div className="st">
                <b>5. TRANSFERENCIA PRIMARIA</b>
                Paso al Archivo Central cumplidos los años de retención en gestión.
                <small className="block text-[#7fa292] mt-1">Aplicación de FUID y foliación técnica.</small>
              </div>
              <div className="st">
                <b>6. DISPOSICIÓN FINAL</b>
                Conservación Total (CT), Eliminación (E), Selección (S) o Digitalización (D).
                <small className="block text-[#7fa292] mt-1">Acta formal de Comité Institucional.</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Auditorías */}
      {sgdTab === 'auditorias' && (
        <div className="span2">
          <div className="cards">
            {[
              { id: 'AUD-2026-01', t: 'Auditoría Archivo de Gestión · Dirección General', r: 'CERRADA', h: '0 Hallazgos Mayores · 2 Oportunidades de Mejora', col: '#00FF66' },
              { id: 'AUD-2026-02', t: 'Inspección Foliación Fondos Acumulados · Reg. Antioquia', r: 'EN CURSO', h: 'Avance al 58% de legajos intervenidos', col: '#00E5FF' },
              { id: 'AUD-2026-03', t: 'Verificación Repositorio Digital · Reg. Bogotá', r: 'CERRADA', h: 'Conformidad con metadatos Dublin Core al 98%', col: '#00FF66' },
              { id: 'AUD-2026-04', t: 'Auditoría Pólizas y Siniestros · Reg. Valle', r: 'PENDIENTE', h: 'Programada para noviembre 2026', col: '#ffb020' },
            ].map(a => (
              <div key={a.id} className="card hl">
                <span className="chip mb-2" style={{ ['--c' as any]: a.col }}>{a.r}</span>
                <b>{a.id}</b>
                <div className="text-[#d7ffe6] font-semibold text-xs mb-1">{a.t}</div>
                <small>{a.h}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================
     MÓDULO 02 · TVD & FONDO ACUMULADO (AGN)
     ========================================================= */
  const renderTVDModule = () => (
    <div className="vw">
      <div className="vh">
        <h2>02 · TABLAS DE VALORACIÓN DOCUMENTAL · TVD (FONDOS ACUMULADOS AGN)</h2>
        <p>
          Instrumento archivístico obligatorio para organizar, evaluar y dar disposición final a la documentación
          producida por el SENA en sus periodos institucionales anteriores a la adopción de las TRD.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          type="button"
          onClick={() => handleSubTabChange(setTvdTab, 'fondos')}
          className={`cbtn ${tvdTab === 'fondos' ? 'on' : ''}`}
        >
          Fondos Institucionales & Periodos
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setTvdTab, 'matriz')}
          className={`cbtn ${tvdTab === 'matriz' ? 'on' : ''}`}
        >
          Matriz TVD y Retención
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setTvdTab, 'convalidacion')}
          className={`cbtn ${tvdTab === 'convalidacion' ? 'on' : ''}`}
        >
          Ruta de Convalidación Externa (AGN)
        </button>
      </div>

      {/* TAB 1: Fondos & Periodos */}
      {tvdTab === 'fondos' && (
        <div className="pane">
          <div className="span2">
            <div className="per">
              <div className="flex-1">
                <b className="text-[#00FF66]">PERIODO 1: 1957 – 1993</b>
                <span>Fondo Antiguo: Creación por Decreto-Ley 118 de 1957. Archivo centralizado y documentación histórica patrimonial.</span>
              </div>
              <div className="flex-1">
                <b className="text-[#00E5FF]">PERIODO 2: 1994 – 2003</b>
                <span>Fondo Intermedio: Ley 119 de 1994 (Reorganización). Descentralización funcional hacia las Direcciones Regionales.</span>
              </div>
              <div className="flex-1">
                <b className="text-[#3EF5B5]">PERIODO 3: 2004 – HOY</b>
                <span>Fondo Moderno: Decreto 249 de 2004. Estructura orgánica actual, Centros de Formación y expedientes electrónicos.</span>
              </div>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                ETAPAS DE INTERVENCIÓN DEL FONDO ACUMULADO
              </h3>
            </header>
            <div className="body">
              <ol className="ul space-y-2">
                <li>
                  <b>Fase 1: Diagnóstico Integral:</b> Levantamiento de metros lineales por depósito y evaluación de estado biológico.
                </li>
                <li>
                  <b>Fase 2: Identificación & Cuadro de Clasificación:</b> Reconstrucción histórica orgánica y funcional.
                </li>
                <li>
                  <b>Fase 3: Depuración y Ordenación:</b> Separación de documentos de apoyo, duplicados y grapas metálicas.
                </li>
                <li>
                  <b>Fase 4: Foliación y Foliado Técnico:</b> Numeración continua a lápiz grafito en la esquina superior derecha.
                </li>
                <li>
                  <b>Fase 5: Descripción y FUID:</b> Inventario documental detallado según formato reglamentario del AGN.
                </li>
              </ol>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00E5FF] uppercase">
                CRITERIOS DE DISPOSICIÓN FINAL (TVD)
              </h3>
            </header>
            <div className="body space-y-3 font-mono text-xs">
              <div className="p-2 border border-[#00FF66]/50 bg-[#00FF66]/10">
                <b className="text-[#00FF66]">CT · Conservación Total:</b>
                <p className="text-[11px] text-[#d7ffe6] mt-0.5">Series con valor histórico, científico, testimonial o pensional (Actas Consejo, Historias Laborales).</p>
              </div>
              <div className="p-2 border border-[#ff3860]/50 bg-[#ff3860]/10">
                <b className="text-[#ff3860]">E · Eliminación:</b>
                <p className="text-[11px] text-[#d7ffe6] mt-0.5">Documentos que han cumplido su término de prescripción administrativa, fiscal o jurídica (Comprobantes contables prescritos).</p>
              </div>
              <div className="p-2 border border-[#00E5FF]/50 bg-[#00E5FF]/10">
                <b className="text-[#00E5FF]">S · Selección:</b>
                <p className="text-[11px] text-[#d7ffe6] mt-0.5">Muestreo cuantitativo o cualitativo del 10% por regional para memoria institucional.</p>
              </div>
              <div className="p-2 border border-[#ffb020]/50 bg-[#ffb020]/10">
                <b className="text-[#ffb020]">D · Digitalización:</b>
                <p className="text-[11px] text-[#d7ffe6] mt-0.5">Preservación en medio digital certificado según Ley 527 de 1999.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Matriz TVD */}
      {tvdTab === 'matriz' && (
        <div className="span2">
          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                CATÁLOGO COMPLETO DE SERIES DE FONDO ACUMULADO
              </h3>
              <span className="text-xs text-[#00E5FF] font-mono">{tvdRows.length} SERIES REGISTRADAS</span>
            </header>
            <div className="body overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#39A900] text-[#00E5FF]">
                    <th className="p-2">Código</th>
                    <th className="p-2">Dependencia</th>
                    <th className="p-2">Serie Documental</th>
                    <th className="p-2">Periodo</th>
                    <th className="p-2 text-center">Años A.C.</th>
                    <th className="p-2 text-center">Disposición</th>
                    <th className="p-2">Justificación Archivística</th>
                  </tr>
                </thead>
                <tbody>
                  {tvdRows.map(r => (
                    <tr key={r.id} className="border-b border-[#39A900]/20 hover:bg-[#00FF66]/10">
                      <td className="p-2 text-[#00FF66] font-bold">{r.codigo}</td>
                      <td className="p-2 text-[#7fa292]">{r.dep}</td>
                      <td className="p-2 text-[#d7ffe6] font-semibold">{r.serie}</td>
                      <td className="p-2 text-[#00E5FF]">{r.per.toUpperCase()}</td>
                      <td className="p-2 text-center font-bold text-[#3EF5B5]">{r.ac} años</td>
                      <td className="p-2 text-center">
                        <span className={`chip`} style={{ ['--c' as any]: r.disp === 'CT' ? '#00FF66' : r.disp === 'E' ? '#ff3860' : r.disp === 'S' ? '#00E5FF' : '#ffb020' }}>
                          {r.disp}
                        </span>
                      </td>
                      <td className="p-2 text-[#7fa292] text-[11px] max-w-[320px]">{r.justificacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Convalidación AGN */}
      {tvdTab === 'convalidacion' && (
        <div className="span2 conv">
          <div className="panel cyber-panel p-5 border border-[#00E5FF]/60 bg-[#080C16]">
            <header className="pb-3 mb-4 border-b border-[#00E5FF]/40">
              <h3 className="text-xs font-bold font-mono text-[#00E5FF] uppercase">
                RUTA DE CONVALIDACIÓN ANTE EL ARCHIVO GENERAL DE LA NACIÓN
              </h3>
            </header>

            <div className="tri mb-6">
              <div style={{ ['--c' as any]: '#00FF66' }}>
                <h4>FASE 1: NIVEL INTERNO (SENA)</h4>
                <p>
                  Elaboración técnica por el equipo archivístico, revisión por Asesoría Jurídica y aprobación
                  formal mediante Acta del Comité Institucional de Gestión y Desempeño.
                </p>
                <div className="chips mt-2">
                  <span className="chip" style={{ ['--c' as any]: '#00FF66' }}>ESTADO: APROBADO</span>
                  <span className="chip" style={{ ['--c' as any]: '#7fa292' }}>ACTO ADMIN. EMITIDO</span>
                </div>
              </div>

              <div style={{ ['--c' as any]: '#00E5FF' }}>
                <h4>FASE 2: CONSEJO DEPARTAMENTAL</h4>
                <p>
                  Presentación de expedientes ante el Consejo Departamental de Archivos de Cundinamarca/Bogotá
                  con memorias metodológicas e historia institucional.
                </p>
                <div className="chips mt-2">
                  <span className="chip" style={{ ['--c' as any]: '#00E5FF' }}>ESTADO: RADICADO</span>
                  <span className="chip" style={{ ['--c' as any]: '#7fa292' }}>RAD. 2026-CDA-481</span>
                </div>
              </div>

              <div style={{ ['--c' as any]: '#ffb020' }}>
                <h4>FASE 3: CONVALIDACIÓN FINAL AGN</h4>
                <p>
                  Evaluación por el Comité Evaluador de Documentos del AGN para emisión del Certificado de Convalidación
                  oficial vinculante para el Estado Colombiano.
                </p>
                <div className="chips mt-2">
                  <span className="chip" style={{ ['--c' as any]: '#ffb020' }}>ESTADO: DÍA 34 DE 90</span>
                  <span className="chip" style={{ ['--c' as any]: '#7fa292' }}>PLAZO REGLAMENTARIO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================
     MÓDULO 03 · GESTIÓN DE RIESGOS (NTC-ISO 31000)
     ========================================================= */
  const renderRisksModule = () => (
    <div className="vw">
      <div className="vh">
        <h2>03 · GESTIÓN DEL RIESGO DOCUMENTAL (NTC-ISO 31000)</h2>
        <p>
          Identificación, análisis, evaluación y tratamiento sistemático de los eventos que pueden comprometer
          la autenticidad, integridad, confidencialidad y disponibilidad del patrimonio documental del SENA.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          type="button"
          onClick={() => handleSubTabChange(setRiskTab, 'matriz')}
          className={`cbtn ${riskTab === 'matriz' ? 'on' : ''}`}
        >
          Matriz de Riesgo 5×5 Ampliada
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setRiskTab, 'controles')}
          className={`cbtn ${riskTab === 'controles' ? 'on' : ''}`}
        >
          Tratamiento & Planes de Acción
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange(setRiskTab, 'apetito')}
          className={`cbtn ${riskTab === 'apetito' ? 'on' : ''}`}
        >
          Apetito de Riesgo & Tolerancia
        </button>
      </div>

      {/* TAB 1: Matriz Ampliada */}
      {riskTab === 'matriz' && (
        <div className="pane">
          <div className="panel cyber-panel p-4 border border-[#ff3860]/60 bg-[#080C16]">
            <header className="pb-2 mb-3 border-b border-[#ff3860]/40">
              <h3 className="text-xs font-bold font-mono text-[#ff3860] uppercase">
                MATRIZ DE CALOR COORDENADA (PROBABILIDAD VS IMPACTO)
              </h3>
            </header>
            <div className="body">
              {/* Coordinated risk grid */}
              <div className="rm my-2">
                {/* Labels column */}
                <div className="al">I5 Catastrófico</div>
                {[1, 2, 3, 4, 5].map(p => {
                  const items = risks.filter(r => r.p === p && r.i === 5);
                  const score = p * 5;
                  const c = score <= 9 ? '#c6ff00' : score <= 14 ? '#ffb020' : score <= 19 ? '#ff7a1a' : '#ff3860';
                  return (
                    <div key={p} className="rc" style={{ ['--c' as any]: c }}>
                      <small>{score}</small>
                      {items.map(r => (
                        <button
                          key={r.id}
                          onClick={() => onSelectRisk(r)}
                          className="mk cursor-pointer"
                          style={{ ['--m' as any]: '#00FF66' }}
                          title={`${r.id}: ${r.n}`}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                })}

                <div className="al">I4 Mayor</div>
                {[1, 2, 3, 4, 5].map(p => {
                  const items = risks.filter(r => r.p === p && r.i === 4);
                  const score = p * 4;
                  const c = score <= 9 ? '#c6ff00' : score <= 14 ? '#ffb020' : score <= 19 ? '#ff7a1a' : '#ff3860';
                  return (
                    <div key={p} className="rc" style={{ ['--c' as any]: c }}>
                      <small>{score}</small>
                      {items.map(r => (
                        <button
                          key={r.id}
                          onClick={() => onSelectRisk(r)}
                          className="mk cursor-pointer"
                          style={{ ['--m' as any]: '#00FF66' }}
                          title={`${r.id}: ${r.n}`}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                })}

                <div className="al">I3 Moderado</div>
                {[1, 2, 3, 4, 5].map(p => {
                  const items = risks.filter(r => r.p === p && r.i === 3);
                  const score = p * 3;
                  const c = score <= 4 ? '#00FF66' : score <= 9 ? '#c6ff00' : '#ffb020';
                  return (
                    <div key={p} className="rc" style={{ ['--c' as any]: c }}>
                      <small>{score}</small>
                      {items.map(r => (
                        <button
                          key={r.id}
                          onClick={() => onSelectRisk(r)}
                          className="mk cursor-pointer"
                          style={{ ['--m' as any]: '#00FF66' }}
                          title={`${r.id}: ${r.n}`}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                })}

                <div className="al">I2 Menor</div>
                {[1, 2, 3, 4, 5].map(p => {
                  const items = risks.filter(r => r.p === p && r.i === 2);
                  const score = p * 2;
                  const c = score <= 4 ? '#00FF66' : '#c6ff00';
                  return (
                    <div key={p} className="rc" style={{ ['--c' as any]: c }}>
                      <small>{score}</small>
                      {items.map(r => (
                        <button
                          key={r.id}
                          onClick={() => onSelectRisk(r)}
                          className="mk cursor-pointer"
                          style={{ ['--m' as any]: '#00FF66' }}
                          title={`${r.id}: ${r.n}`}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                })}

                <div className="al">I1 Insignif.</div>
                {[1, 2, 3, 4, 5].map(p => {
                  const items = risks.filter(r => r.p === p && r.i === 1);
                  const score = p * 1;
                  return (
                    <div key={p} className="rc" style={{ ['--c' as any]: '#00FF66' }}>
                      <small>{score}</small>
                      {items.map(r => (
                        <button
                          key={r.id}
                          onClick={() => onSelectRisk(r)}
                          className="mk cursor-pointer"
                          style={{ ['--m' as any]: '#00FF66' }}
                          title={`${r.id}: ${r.n}`}
                        >
                          {r.id}
                        </button>
                      ))}
                    </div>
                  );
                })}

                {/* Bottom Header labels */}
                <div />
                <div className="al b">P1 Raro</div>
                <div className="al b">P2 Improb.</div>
                <div className="al b">P3 Posible</div>
                <div className="al b">P4 Probable</div>
                <div className="al b">P5 Casi seguro</div>
              </div>
            </div>
          </div>

          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                RESUMEN DE RIESGOS IDENTIFICADOS EN COORDENADA
              </h3>
            </header>
            <div className="body space-y-2">
              {risks.map(r => (
                <div
                  key={r.id}
                  onClick={() => onSelectRisk(r)}
                  className="p-2 border border-[#39A900]/30 bg-[#0d1424]/60 hover:border-[#00FF66] cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-[#ff3860]">{r.id}</span>
                    <span className="text-[#00E5FF] text-[11px]">{r.dep}</span>
                  </div>
                  <div className="text-xs text-[#d7ffe6] font-medium mt-0.5">{r.n}</div>
                  <div className="flex justify-between items-center text-[10px] text-[#7fa292] mt-1 pt-1 border-t border-[#39A900]/20">
                    <span>Inherente: {r.p * r.i} pts</span>
                    <span className="text-[#00FF66]">Residual: {(r.p * r.i * (1 - r.c)).toFixed(1)} pts</span>
                    <span className="text-[#00E5FF]">[{r.t}]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tratamiento & Planes */}
      {riskTab === 'controles' && (
        <div className="span2">
          <div className="cards">
            {risks.map(r => (
              <div key={r.id} className="card hl cursor-pointer" onClick={() => onSelectRisk(r)}>
                <div className="flex justify-between items-center mb-1">
                  <b className="text-[#ff3860]">{r.id}</b>
                  <span className="chip" style={{ ['--c' as any]: '#00E5FF' }}>{r.t}</span>
                </div>
                <div className="font-semibold text-xs text-[#d7ffe6] mb-1">{r.n}</div>
                <small className="text-[#7fa292]">{r.dep}</small>
                <div className="mt-2 pt-2 border-t border-[#39A900]/30 text-[11px] text-[#00FF66]">
                  Control: {(r.c * 100).toFixed(0)}% efectividad
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Apetito & Tolerancia */}
      {riskTab === 'apetito' && (
        <div className="span2">
          <div className="panel cyber-panel p-5 border border-[#39A900]/60 bg-[#080C16]">
            <header className="pb-3 mb-4 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                DECLARACIÓN INSTITUCIONAL DE APETITO AL RIESGO (SENA)
              </h3>
            </header>

            <div className="split">
              <div>
                <ul className="ul space-y-2">
                  <li>
                    <b>Pérdida de Patrimonio Documental (CT):</b> TOLERANCIA CERO.
                    <small>Ningún documento con valor histórico o probatorio pensional puede ser objeto de riesgo no mitigado.</small>
                  </li>
                  <li>
                    <b>Vulneración de Seguridad de Información (ISO 27001):</b> APETITO MUY BAJO.
                    <small>Cifrado obligatorio y trazabilidad con control de accesos biométrico y de doble factor.</small>
                  </li>
                  <li>
                    <b>Deterioro Físico en Depósito:</b> APETITO BAJO.
                    <small>Monitoreo termohigrométrico y fumigación semestral obligatoria.</small>
                  </li>
                </ul>
              </div>

              <div className="side">
                <div className="kc">
                  <small>Umbral Residual Máximo</small>
                  <b className="text-[#00FF66]">9.0 Pts</b>
                  <em>Nivel Tolerable Institucional</em>
                </div>
                <div className="steps text-[11px] text-[#7fa292] mt-3 space-y-1">
                  <div className="text-[#00FF66]">✔ 89% riesgos en zona verde</div>
                  <div className="text-[#00E5FF]">✔ Monitoreo trimestral</div>
                  <div className="text-[#ffb020]">◌ 1 riesgo en zona de atención</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================
     MÓDULO 04 · VENTANILLA ÚNICA & AUDITORÍA
     ========================================================= */
  const renderVentanillaModule = () => {
    const filteredFeed = docFeed.filter(doc => {
      const matchSearch =
        ventanillaSearch === '' ||
        doc.radicado.toLowerCase().includes(ventanillaSearch.toLowerCase()) ||
        doc.serie.toLowerCase().includes(ventanillaSearch.toLowerCase()) ||
        doc.dep.toLowerCase().includes(ventanillaSearch.toLowerCase());
      const matchType = ventanillaTypeFilter === 'all' || doc.tipo === ventanillaTypeFilter;
      return matchSearch && matchType;
    });

    return (
      <div className="vw">
        <div className="vh">
          <h2>04 · VENTANILLA ÚNICA DE CORRESPONDENCIA & TRAZABILIDAD</h2>
          <p>
            Registro oficial de comunicaciones recibidas, producidas e internas. Certificación criptográfica
            de ingreso con sellado de tiempo y asignación correlativa según Directiva Presidencial 04.
          </p>
        </div>

        {/* Action bar and search */}
        <div className="span2 flex flex-wrap items-center justify-between gap-3 p-3 border border-[#39A900]/40 bg-[#080C16]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative font-mono">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7fa292]" />
              <input
                type="text"
                placeholder="Buscar por radicado, serie o regional..."
                value={ventanillaSearch}
                onChange={e => setVentanillaSearch(e.target.value)}
                className="bg-[#0d1424] border border-[#39A900] text-xs text-[#00FF66] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#00FF66] w-64"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <label className="text-[#7fa292]">Tipo:</label>
              <select
                value={ventanillaTypeFilter}
                onChange={e => setVentanillaTypeFilter(e.target.value)}
                className="bg-[#0d1424] border border-[#39A900] text-xs text-[#00FF66] px-2 py-1 focus:outline-none"
              >
                <option value="all">Todos los tipos</option>
                <option value="Acta">Actas</option>
                <option value="Resolución">Resoluciones</option>
                <option value="Oficio">Oficios</option>
                <option value="Historia Laboral">Historias Laborales</option>
                <option value="Contrato">Contratos</option>
                <option value="Expediente Aprendiz">Expedientes Aprendiz</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRadicarModal}
            className="cbtn flex items-center gap-1.5 bg-[#00FF66] text-[#080C16] font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>RADICAR NUEVO DOCUMENTO</span>
          </button>
        </div>

        {/* Big Table of Radicados */}
        <div className="span2">
          <div className="panel cyber-panel p-4 border border-[#39A900]/60 bg-[#080C16]">
            <header className="flex justify-between items-center pb-2 mb-3 border-b border-[#39A900]/40">
              <h3 className="text-xs font-bold font-mono text-[#00FF66] uppercase">
                EXPEDIENTES REGISTRADOS EN SISTEMA ({filteredFeed.length})
              </h3>
              <span className="text-xs font-mono text-[#00E5FF]">CONSECUTIVO SENA-2026</span>
            </header>
            <div className="body overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#39A900] text-[#00E5FF]">
                    <th className="p-2">Radicado ID</th>
                    <th className="p-2">Fecha y Hora</th>
                    <th className="p-2">Serie / Asunto</th>
                    <th className="p-2">Dependencia</th>
                    <th className="p-2 text-center">Tipo</th>
                    <th className="p-2 text-center">Soporte</th>
                    <th className="p-2 text-center">Folios</th>
                    <th className="p-2">Integridad Hash</th>
                    <th className="p-2 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeed.map(doc => (
                    <tr key={doc.id} className="border-b border-[#39A900]/20 hover:bg-[#00FF66]/10">
                      <td className="p-2 font-bold text-[#00FF66]">{doc.radicado}</td>
                      <td className="p-2 text-[#7fa292] text-[11px]">{doc.fecha}</td>
                      <td className="p-2 text-[#d7ffe6] font-semibold">{doc.serie}</td>
                      <td className="p-2 text-[#7fa292]">{doc.dep}</td>
                      <td className="p-2 text-center">
                        <span className="chip" style={{ ['--c' as any]: '#00E5FF' }}>{doc.tipo}</span>
                      </td>
                      <td className="p-2 text-center">
                        <span className="chip" style={{ ['--c' as any]: '#ffb020' }}>{doc.soporte}</span>
                      </td>
                      <td className="p-2 text-center font-bold text-[#3EF5B5]">{doc.folios}</td>
                      <td className="p-2 text-[#7fa292] text-[10px] font-mono">{doc.hash}</td>
                      <td className="p-2 text-right">
                        <span className="chip" style={{ ['--c' as any]: '#00FF66' }}>{doc.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (currentMode) {
    case 'sgd':
      return renderSGDModule();
    case 'tvd':
      return renderTVDModule();
    case 'risks':
      return renderRisksModule();
    case 'ventanilla':
      return renderVentanillaModule();
    default:
      return null;
  }
};
