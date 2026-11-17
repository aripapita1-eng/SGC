import React, { useState } from 'react';
import { DocumentRecord, CCDNode } from '../types';
import { INITIAL_CCD } from '../data/mockData';
import { soundService } from '../services/soundService';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Play,
  Pause,
  FolderTree,
} from 'lucide-react';

interface Pillar1SGDProps {
  totalDocs: number;
  docFeed: DocumentRecord[];
  isFeedLive: boolean;
  onToggleFeedLive: () => void;
  onOpenRadicarModal: () => void;
}

export const Pillar1SGD: React.FC<Pillar1SGDProps> = ({
  totalDocs,
  docFeed,
  isFeedLive,
  onToggleFeedLive,
  onOpenRadicarModal,
}) => {
  const [ccdTree] = useState<CCDNode[]>(INITIAL_CCD);
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    '100': true,
    '200': false,
    '300': false,
  });
  const [searchCCD, setSearchCCD] = useState<string>('');

  const toggleNode = (code: string) => {
    soundService.playBlip(550);
    setOpenNodes(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const filteredCCD = ccdTree.filter(node => {
    if (!searchCCD) return true;
    const term = searchCCD.toLowerCase();
    const matchParent = node.nombre.toLowerCase().includes(term) || node.codigo.includes(term);
    const matchSub = node.subseries?.some(
      s => s.nombre.toLowerCase().includes(term) || s.codigo.includes(term)
    );
    return matchParent || matchSub;
  });

  return (
    <section className="flex flex-col gap-5">
      {/* Pillar Title */}
      <div className="border-l-4 border-[#00FF66] pl-3 py-1 bg-gradient-to-r from-[#00FF66]/10 to-transparent">
        <div className="text-[11px] font-mono text-[#00E5FF] tracking-widest uppercase">PILAR 01</div>
        <h2 className="text-base sm:text-lg font-bold text-[#00FF66] font-mono">
          SISTEMA DE GESTIÓN DOCUMENTAL (ISO 30301)
        </h2>
      </div>

      {/* PANEL 1: Captura y Registro */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Captura & Registro de Radicados
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFeedLive}
              title={isFeedLive ? 'Pausar flujo en tiempo real' : 'Reanudar flujo'}
              className={`p-1 border text-xs flex items-center gap-1 font-mono cursor-pointer transition-colors ${
                isFeedLive
                  ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/10'
                  : 'border-[#7fa292] text-[#7fa292]'
              }`}
            >
              {isFeedLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="text-[10px]">{isFeedLive ? 'EN VIVO' : 'PAUSADO'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenRadicarModal}
              className="p-1 border border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66] hover:bg-[#00FF66] hover:text-[#080C16] text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>NUEVO</span>
            </button>
          </div>
        </header>

        {/* Counter Block */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#00FF66] tracking-tight drop-shadow-[0_0_15px_rgba(0,255,102,0.7)]">
            {totalDocs.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-[#7fa292] font-mono mt-0.5">
            DOCUMENTOS CAPTURADOS · ID ÚNICO CRIPTOGRÁFICO
          </div>
        </div>

        {/* Compliance Progress Bar */}
        <div className="space-y-1.5 mb-4 font-mono text-xs">
          <div className="flex justify-between text-[#7fa292]">
            <span>Calidad Metadatos (Dublin Core / AGN)</span>
            <span className="text-[#00FF66] font-bold">96.4%</span>
          </div>
          <div className="h-2 w-full bg-[#080C16] border border-[#39A900]/70 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#39A900] to-[#00FF66] shadow-[0_0_10px_#00FF66]"
              style={{ width: '96.4%' }}
            />
          </div>
        </div>

        {/* Live Radicado Feed */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#7fa292] font-mono pb-1 border-b border-[#39A900]/20">
            <span>ÚLTIMOS MOVIMIENTOS EN VENTANILLA</span>
            <span className="text-[#00E5FF] text-[10px]">AUTO-REFRESH</span>
          </div>

          <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {docFeed.slice(0, 6).map((doc, idx) => (
              <li
                key={doc.id || idx}
                className="p-2 border border-[#39A900]/30 bg-[#0d1424]/60 font-mono text-xs transition-all hover:border-[#00FF66]/80"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#00E5FF]">{doc.radicado}</span>
                  <span className="text-[10px] text-[#7fa292]">{doc.fecha.split(' ')[1] || doc.fecha}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#d7ffe6] mt-0.5">
                  <span className="truncate pr-2">{doc.serie}</span>
                  <span className="text-[#00FF66] text-[10px] shrink-0">{doc.dep.split(' ').pop()}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#7fa292] mt-1 pt-1 border-t border-[#39A900]/20">
                  <span>{doc.tipo} · {doc.folios} folios</span>
                  <span className="text-[#3EF5B5]">{doc.estado}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* PANEL 2: Cuadro de Clasificación Documental (CCD) */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Cuadro de Clasificación (CCD)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00E5FF] px-1.5 py-0.5 border border-[#00E5FF]/40">
            OFICIAL AGN
          </span>
        </header>

        {/* Search filter for CCD */}
        <div className="relative mb-3 font-mono">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7fa292]" />
          <input
            type="text"
            placeholder="Buscar serie, subserie o código..."
            value={searchCCD}
            onChange={e => setSearchCCD(e.target.value)}
            className="w-full bg-[#080C16] border border-[#39A900]/60 text-xs text-[#00FF66] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#00FF66] placeholder:text-[#7fa292]/50"
          />
        </div>

        {/* Tree List */}
        <div className="space-y-2 font-mono text-xs">
          {filteredCCD.map(node => {
            const isOpen = openNodes[node.codigo] || searchCCD.length > 0;
            return (
              <div key={node.codigo} className="border border-[#39A900]/30 bg-[#080C16]/70">
                <button
                  type="button"
                  onClick={() => toggleNode(node.codigo)}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-[#39A900]/15 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#00FF66]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#7fa292]" />
                    )}
                    <span className="font-bold text-[#3EF5B5]">{node.codigo}</span>
                    <span className="text-[#d7ffe6] truncate">{node.nombre}</span>
                  </div>
                  <span className="text-[10px] text-[#00E5FF] px-1.5 py-0.2 border border-[#00E5FF]/30">
                    {node.version}
                  </span>
                </button>

                {isOpen && node.subseries && (
                  <div className="pl-6 pr-2 pb-2 space-y-1.5 border-t border-[#39A900]/20 pt-1.5 bg-[#0d1424]/40">
                    {node.subseries.map(sub => (
                      <div
                        key={sub.codigo}
                        className="flex items-center justify-between text-[11px] p-1.5 hover:bg-[#00FF66]/10 transition-colors border-l-2 border-[#00FF66]/60 pl-2"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-[#00E5FF] font-semibold">{sub.codigo}</span>
                          <span className="truncate">{sub.nombre}</span>
                        </div>
                        <span className="text-[10px] text-[#7fa292] shrink-0 pl-2 font-mono">
                          {sub.version}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>

      {/* PANEL 3: Radar de Mejora Continua */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Radar de Mejora Continua
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00FF66] font-bold">CICLO PHVA</span>
        </header>

        <div className="flex flex-wrap items-center gap-5">
          {/* SVG Donut Chart */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(57, 169, 0, 0.2)" strokeWidth="14" />
              {/* Closed: 12/20 = 60% */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#00FF66"
                strokeWidth="14"
                strokeDasharray="158.3 263.9"
                strokeDashoffset="0"
                className="drop-shadow-[0_0_6px_#00FF66]"
              />
              {/* In Progress: 5/20 = 25% */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="14"
                strokeDasharray="65.9 263.9"
                strokeDashoffset="-158.3"
                className="drop-shadow-[0_0_6px_#00E5FF]"
              />
              {/* Pending: 3/20 = 15% */}
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#ffb020"
                strokeWidth="14"
                strokeDasharray="39.6 263.9"
                strokeDashoffset="-224.2"
                className="drop-shadow-[0_0_6px_#ffb020]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-mono text-[#00FF66]">20</span>
              <span className="text-[8px] font-mono text-[#7fa292] uppercase">AUDITORÍAS</span>
            </div>
          </div>

          {/* Legend and Key Metrics */}
          <div className="flex-1 min-w-[140px] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00FF66] inline-block" />
                <span>Auditorías cerradas</span>
              </span>
              <b className="text-[#00FF66]">12</b>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#00E5FF] inline-block" />
                <span>En curso / revisión</span>
              </span>
              <b className="text-[#00E5FF]">5</b>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ffb020] inline-block" />
                <span>Pendientes</span>
              </span>
              <b className="text-[#ffb020]">3</b>
            </div>

            <div className="pt-2 border-t border-[#39A900]/30 space-y-1 text-[11px] text-[#7fa292]">
              <div className="flex justify-between">
                <span>No conformidades abiertas:</span>
                <span className="text-[#ff3860] font-bold">4</span>
              </div>
              <div className="flex justify-between">
                <span>Acciones correctivas en plazo:</span>
                <span className="text-[#00FF66] font-bold">9 / 11 (82%)</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
