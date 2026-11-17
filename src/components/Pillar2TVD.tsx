import React, { useState } from 'react';
import { TVDRow, HistoricalMilestone, DispositionType } from '../types';
import { HISTORICAL_MILESTONES } from '../data/mockData';
import { soundService } from '../services/soundService';
import {
  FileSpreadsheet,
  Clock,
  Layers,
  Award,
  CheckCircle,
  HelpCircle,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface Pillar2TVDProps {
  rows: TVDRow[];
  selectedPeriod: string;
  onSelectMilestoneYear?: (year: number) => void;
}

export const Pillar2TVD: React.FC<Pillar2TVDProps> = ({
  rows,
  selectedPeriod,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<HistoricalMilestone | null>(
    HISTORICAL_MILESTONES[3]
  );
  const [selectedRowDetail, setSelectedRowDetail] = useState<TVDRow | null>(null);

  const dispositionBadges: Record<DispositionType, { label: string; color: string; bg: string }> = {
    CT: { label: 'Conservación Total', color: '#00FF66', bg: 'rgba(0, 255, 102, 0.12)' },
    E: { label: 'Eliminación', color: '#ff3860', bg: 'rgba(255, 56, 96, 0.12)' },
    S: { label: 'Selección', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.12)' },
    D: { label: 'Digitalización', color: '#ffb020', bg: 'rgba(255, 176, 32, 0.12)' },
  };

  const handleMilestoneClick = (item: HistoricalMilestone) => {
    soundService.playBlip(600);
    setSelectedMilestone(item);
  };

  const handleRowClick = (r: TVDRow) => {
    soundService.playBlip(700);
    setSelectedRowDetail(r);
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Pillar Title */}
      <div className="border-l-4 border-[#00E5FF] pl-3 py-1 bg-gradient-to-r from-[#00E5FF]/10 to-transparent">
        <div className="text-[11px] font-mono text-[#00FF66] tracking-widest uppercase">PILAR 02</div>
        <h2 className="text-base sm:text-lg font-bold text-[#00E5FF] font-mono">
          TABLAS DE VALORACIÓN DOCUMENTAL · TVD (AGN)
        </h2>
      </div>

      {/* PANEL 1: Historia Institucional y Fondo Acumulado */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00E5FF] uppercase">
              Historia Institucional · Fondo Acumulado
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7fa292]">1957 – 2026</span>
        </header>

        {/* Timeline milestones */}
        <div className="space-y-2 font-mono text-xs">
          {HISTORICAL_MILESTONES.map(item => {
            const isSelected = selectedMilestone?.y === item.y;
            const matchesPeriod = selectedPeriod === 'all' || item.per === selectedPeriod;

            return (
              <div
                key={item.y}
                onClick={() => handleMilestoneClick(item)}
                className={`p-2.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#00FF66] bg-[#00FF66]/15 shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                    : matchesPeriod
                    ? 'border-[#39A900]/40 bg-[#080C16]/80 hover:border-[#00E5FF]'
                    : 'border-[#39A900]/20 bg-[#080C16]/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-[#00FF66] font-mono tracking-wider">
                    {item.y}
                  </span>
                  <span className="text-[10px] text-[#00E5FF] px-1.5 py-0.5 border border-[#00E5FF]/30">
                    {item.d}
                  </span>
                </div>
                <div className="text-xs text-[#d7ffe6] font-semibold mt-1">{item.t}</div>
                <div className="text-[11px] text-[#7fa292] mt-0.5">{item.marcoLegal}</div>
              </div>
            );
          })}
        </div>

        {/* Milestone Detail Card */}
        {selectedMilestone && (
          <div className="mt-3 p-2.5 bg-[#0d1424] border border-[#00E5FF]/40 text-xs font-mono text-[#d7ffe6] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#00E5FF] pb-1 border-b border-[#00E5FF]/20">
              <span>DETALLES HISTÓRICO-ARCHIVÍSTICOS ({selectedMilestone.y})</span>
              <span className="text-[#3EF5B5]">Fondo {selectedMilestone.per.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-[#d7ffe6] leading-relaxed pt-1">
              {selectedMilestone.detalles}
            </p>
          </div>
        )}
      </article>

      {/* PANEL 2: Monitor de Intervención Documental */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Monitor de Intervención Documental
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00FF66]">FASE OPERATIVA</span>
        </header>

        <div className="space-y-3 font-mono text-xs">
          {[
            { label: 'Depuración y Limpieza Física', val: 72, color: 'from-[#39A900] to-[#00FF66]' },
            { label: 'Foliación Técnica Continua', val: 58, color: 'from-[#00E5FF] to-[#3EF5B5]' },
            { label: 'Control Deterioro Biológico', val: 41, color: 'from-[#ffb020] to-[#ff3860]' },
            { label: 'Inventario FUID Registrado', val: 85, color: 'from-[#39A900] to-[#00FF66]' },
          ].map(bar => (
            <div key={bar.label} className="space-y-1">
              <div className="flex justify-between text-[#7fa292]">
                <span>{bar.label}</span>
                <span className="text-[#00FF66] font-bold">{bar.val}%</span>
              </div>
              <div className="h-2 w-full bg-[#080C16] border border-[#39A900]/70">
                <div
                  className={`h-full bg-gradient-to-r ${bar.color} transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,102,0.4)]`}
                  style={{ width: `${bar.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* PANEL 3: Matriz TVD Dinámica y Disposición Final */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Matriz TVD y Disposición Final
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7fa292]">
            {rows.length} SERIES
          </span>
        </header>

        {/* Table view */}
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="sticky top-0 bg-[#080C16] border-b border-[#39A900]">
              <tr className="text-[#00E5FF] text-[11px]">
                <th className="py-1.5 px-2">Dependencia</th>
                <th className="py-1.5 px-2">Serie / Asunto</th>
                <th className="py-1.5 px-1 text-center">A.C.</th>
                <th className="py-1.5 px-2 text-right">Disposición</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#7fa292]">
                    No se encontraron series para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                rows.map(r => {
                  const badge = dispositionBadges[r.disp];
                  const isSelected = selectedRowDetail?.id === r.id;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleRowClick(r)}
                      className={`border-b border-[#39A900]/20 hover:bg-[#00FF66]/10 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#00FF66]/15' : ''
                      }`}
                    >
                      <td className="py-2 px-2 text-[#7fa292] text-[11px]">
                        {r.dep.replace('Regional ', 'Reg. ')}
                      </td>
                      <td className="py-2 px-2 text-[#d7ffe6] font-medium truncate max-w-[170px]" title={r.serie}>
                        {r.serie}
                      </td>
                      <td className="py-2 px-1 text-center text-[#00E5FF] font-bold">
                        {r.ac}a
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span
                          className="px-1.5 py-0.5 text-[10px] border font-bold"
                          style={{
                            borderColor: badge.color,
                            color: badge.color,
                            backgroundColor: badge.bg,
                          }}
                        >
                          {r.disp}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Row Technical Justification */}
        {selectedRowDetail && (
          <div className="mt-3 p-2.5 bg-[#0d1424] border border-[#00FF66]/50 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#00FF66] pb-1 border-b border-[#39A900]/30">
              <span>JUSTIFICACIÓN TÉCNICA · {selectedRowDetail.codigo}</span>
              <span>{dispositionBadges[selectedRowDetail.disp].label}</span>
            </div>
            <div className="text-[#d7ffe6] font-semibold">{selectedRowDetail.serie}</div>
            <p className="text-[11px] text-[#7fa292] leading-relaxed">
              {selectedRowDetail.justificacion}
            </p>
          </div>
        )}
      </article>

      {/* PANEL 4: Convalidación Externa AGN */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00E5FF] uppercase">
              Convalidación Externa (AGN)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00FF66]">EXP. 2026-AGN-TVD</span>
        </header>

        <div className="flex flex-wrap items-center gap-4">
          {/* Semi-circular gauge (34/90 days) */}
          <div className="w-32 flex flex-col items-center justify-center shrink-0">
            <svg viewBox="0 0 120 78" className="w-full">
              {/* Background Arch */}
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="rgba(57, 169, 0, 0.2)"
                strokeWidth="10"
              />
              {/* Value Arch (34 of 90 days = ~37.7%) */}
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="10"
                strokeDasharray="150.8"
                strokeDashoffset={150.8 * (1 - 34 / 90)}
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#00E5FF]"
              />
              <text
                x="60"
                y="54"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="Orbitron, sans-serif"
                fill="#00E5FF"
              >
                34
              </text>
              <text
                x="60"
                y="70"
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="Share Tech Mono, monospace"
                fill="#7fa292"
              >
                DÍAS DE 90
              </text>
            </svg>
            <span className="text-[10px] font-mono text-[#7fa292] mt-0.5">TÉRMINO LEGAL</span>
          </div>

          {/* Checklist of external validation */}
          <div className="flex-1 min-w-[150px] space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#00FF66]">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Acto administrativo de adopción</span>
            </div>
            <div className="flex items-center gap-2 text-[#00FF66]">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Acta Comité Gestión y Desempeño</span>
            </div>
            <div className="flex items-center gap-2 text-[#00FF66]">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Radicado ante Consejo Departamental</span>
            </div>
            <div className="flex items-center gap-2 text-[#ffb020] animate-pulse">
              <span className="w-3.5 h-3.5 flex items-center justify-center border border-[#ffb020] text-[9px] rounded-full shrink-0">
                ●
              </span>
              <span>Revisión técnica AGN en curso</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
