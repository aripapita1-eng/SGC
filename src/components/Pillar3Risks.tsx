import React, { useState } from 'react';
import { DocumentRisk } from '../types';
import { soundService } from '../services/soundService';
import {
  ShieldAlert,
  Flame,
  Sliders,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';

interface Pillar3RisksProps {
  risks: DocumentRisk[];
  onSelectRisk: (risk: DocumentRisk) => void;
}

export const Pillar3Risks: React.FC<Pillar3RisksProps> = ({
  risks,
  onSelectRisk,
}) => {
  const [selectedCoord, setSelectedCoord] = useState<{ p: number; i: number } | null>(null);

  // Score color helper based on P * I
  const getScoreColor = (score: number) => {
    if (score <= 4) return '#00FF66';
    if (score <= 9) return '#c6ff00';
    if (score <= 14) return '#ffb020';
    if (score <= 19) return '#ff7a1a';
    return '#ff3860';
  };

  const calculateResidual = (r: DocumentRisk) => {
    return r.p * r.i * (1 - r.c);
  };

  // Average Inherente and Residual
  const totalRisks = risks.length || 1;
  const avgInherente = risks.reduce((acc, r) => acc + r.p * r.i, 0) / totalRisks;
  const avgResidual = risks.reduce((acc, r) => acc + calculateResidual(r), 0) / totalRisks;

  // Filtered risks if a cell is selected
  const cellRisks = selectedCoord
    ? risks.filter(r => r.p === selectedCoord.p && r.i === selectedCoord.i)
    : risks;

  const handleCellClick = (p: number, i: number) => {
    soundService.playBlip(500 + p * 50 + i * 50);
    if (selectedCoord?.p === p && selectedCoord?.i === i) {
      setSelectedCoord(null); // toggle off
    } else {
      setSelectedCoord({ p, i });
    }
  };

  // Treatment strategies count
  const treatmentCounts = {
    Reducir: risks.filter(r => r.t === 'Reducir').length,
    Modificar: risks.filter(r => r.t === 'Modificar').length,
    Compartir: risks.filter(r => r.t === 'Compartir').length,
    Evitar: risks.filter(r => r.t === 'Evitar').length,
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Pillar Title */}
      <div className="border-l-4 border-[#ff3860] pl-3 py-1 bg-gradient-to-r from-[#ff3860]/10 to-transparent">
        <div className="text-[11px] font-mono text-[#00E5FF] tracking-widest uppercase">PILAR 03</div>
        <h2 className="text-base sm:text-lg font-bold text-[#ff3860] font-mono">
          GESTIÓN DE RIESGOS DOCUMENTALES (NTC-ISO 31000)
        </h2>
      </div>

      {/* PANEL 1: Mapa de Calor 5x5 */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff3860]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#ff3860] uppercase">
              Mapa de Calor 5×5 · Matriz NTC-ISO 31000
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00E5FF]">
            {selectedCoord ? `FILTRO: P${selectedCoord.p} × I${selectedCoord.i}` : 'TODAS LAS CELDAS'}
          </span>
        </header>

        {/* Heatmap header labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#7fa292] mb-1">
          <span>↑ IMPACTO (1 a 5)</span>
          <span>PROBABILIDAD (1 a 5) →</span>
        </div>

        {/* 5x5 Matrix Grid */}
        <div className="grid grid-cols-5 gap-1.5 my-2">
          {[5, 4, 3, 2, 1].map(impact =>
            [1, 2, 3, 4, 5].map(prob => {
              const count = risks.filter(r => r.p === prob && r.i === impact).length;
              const score = prob * impact;
              const color = getScoreColor(score);
              const isSelected = selectedCoord?.p === prob && selectedCoord?.i === impact;

              return (
                <button
                  key={`${prob}-${impact}`}
                  type="button"
                  onClick={() => handleCellClick(prob, impact)}
                  className={`aspect-square relative flex flex-col items-center justify-center font-mono text-xs font-bold transition-all border ${
                    isSelected
                      ? 'scale-105 z-10 border-white shadow-[0_0_15px_#fff]'
                      : 'border-white/10 hover:border-white/50'
                  }`}
                  style={{
                    backgroundColor: '#0b1220',
                    color: count > 0 ? '#fff' : 'rgba(255,255,255,0.25)',
                    boxShadow: isSelected
                      ? 'inset 0 0 16px rgba(255,255,255,0.5)'
                      : `inset 0 0 12px ${color}40`,
                    borderColor: isSelected ? '#ffffff' : `${color}80`,
                  }}
                  title={`Probabilidad: ${prob}, Impacto: ${impact} | Puntaje: ${score} (${count} riesgos)`}
                >
                  <span className="text-sm font-black drop-shadow-[0_0_6px_currentColor]">
                    {count > 0 ? count : ''}
                  </span>
                  <span className="text-[8px] opacity-40 absolute bottom-0.5 right-1">
                    {score}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Cell Info */}
        <div className="mt-3 p-2.5 bg-[#0d1424] border border-[#ff3860]/40 font-mono text-xs min-h-[58px]">
          {selectedCoord ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[#00E5FF] text-[11px] pb-1 border-b border-[#39A900]/30">
                <span>
                  COORDENADA: P{selectedCoord.p} × I{selectedCoord.i} = {selectedCoord.p * selectedCoord.i} pts
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCoord(null)}
                  className="text-[#ff3860] hover:underline cursor-pointer text-[10px]"
                >
                  [Limpiar filtro]
                </button>
              </div>
              <div className="text-[#d7ffe6] text-[11px] pt-1">
                {cellRisks.length > 0 ? (
                  <ul className="space-y-1">
                    {cellRisks.map(r => (
                      <li key={r.id} className="flex items-center justify-between">
                        <span>
                          <b className="text-[#ff3860]">{r.id}</b> {r.n}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectRisk(r)}
                          className="text-[#00FF66] hover:underline text-[10px] ml-2"
                        >
                          Ver
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[#7fa292]">No hay riesgos registrados en esta casilla.</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#7fa292] text-[11px]">
              <Info className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span>Haz clic en cualquier celda para inspeccionar los riesgos correspondientes.</span>
            </div>
          )}
        </div>
      </article>

      {/* PANEL 2: Riesgo Inherente vs Residual */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Riesgo Inherente vs Residual
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#3EF5B5]">MITIGACIÓN EFECTIVA</span>
        </header>

        {/* Twin Gauges */}
        <div className="flex items-center justify-around gap-4 font-mono">
          {/* Gauge 1: Inherente */}
          <div className="flex flex-col items-center text-center">
            <svg viewBox="0 0 120 78" className="w-28 sm:w-32">
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="rgba(57, 169, 0, 0.2)"
                strokeWidth="10"
              />
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="#ff7a1a"
                strokeWidth="10"
                strokeDasharray="150.8"
                strokeDashoffset={150.8 * (1 - avgInherente / 25)}
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#ff7a1a]"
              />
              <text
                x="60"
                y="54"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="Orbitron, sans-serif"
                fill="#ff7a1a"
              >
                {avgInherente.toFixed(1)}
              </text>
              <text
                x="60"
                y="70"
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="Share Tech Mono, monospace"
                fill="#7fa292"
              >
                ESCALA DE 25
              </text>
            </svg>
            <span className="text-xs font-bold text-[#ff7a1a] mt-1">INHERENTE (P×I)</span>
            <span className="text-[10px] text-[#7fa292]">Sin controles</span>
          </div>

          {/* Delta Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#00FF66] font-bold">
              -{(100 - (avgResidual / avgInherente) * 100).toFixed(0)}%
            </span>
            <span className="text-[9px] text-[#7fa292] uppercase">REDUCCIÓN</span>
          </div>

          {/* Gauge 2: Residual */}
          <div className="flex flex-col items-center text-center">
            <svg viewBox="0 0 120 78" className="w-28 sm:w-32">
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="rgba(57, 169, 0, 0.2)"
                strokeWidth="10"
              />
              <path
                d="M 12 64 A 48 48 0 0 1 108 64"
                fill="none"
                stroke="#00FF66"
                strokeWidth="10"
                strokeDasharray="150.8"
                strokeDashoffset={150.8 * (1 - avgResidual / 25)}
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#00FF66]"
              />
              <text
                x="60"
                y="54"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="Orbitron, sans-serif"
                fill="#00FF66"
              >
                {avgResidual.toFixed(1)}
              </text>
              <text
                x="60"
                y="70"
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="Share Tech Mono, monospace"
                fill="#7fa292"
              >
                ESCALA DE 25
              </text>
            </svg>
            <span className="text-xs font-bold text-[#00FF66] mt-1">RESIDUAL (P×I×(1-C))</span>
            <span className="text-[10px] text-[#7fa292]">Con controles</span>
          </div>
        </div>
      </article>

      {/* PANEL 3: Estrategias de Tratamiento */}
      <article className="border border-[#39A900]/60 bg-gradient-to-br from-[#39A900]/10 via-[#080C16] to-[#00E5FF]/5 p-4 cyber-panel shadow-[0_0_20px_rgba(57,169,0,0.15)]">
        <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#39A900]/40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00FF66]" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              Estrategias de Tratamiento
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00FF66]">{totalRisks} RIESGOS</span>
        </header>

        <div className="space-y-3 font-mono text-xs">
          {[
            { label: 'Reducir (Mitigar impacto/probabilidad)', key: 'Reducir', color: 'from-[#39A900] to-[#00FF66]' },
            { label: 'Modificar (Ajustar procedimientos)', key: 'Modificar', color: 'from-[#00E5FF] to-[#3EF5B5]' },
            { label: 'Compartir (Pólizas / Proveedores)', key: 'Compartir', color: 'from-[#ffb020] to-[#ff7a1a]' },
            { label: 'Evitar (Eliminar actividad de riesgo)', key: 'Evitar', color: 'from-[#ff7a1a] to-[#ff3860]' },
          ].map(strat => {
            const count = treatmentCounts[strat.key as keyof typeof treatmentCounts];
            const pct = Math.round((count / totalRisks) * 100);

            return (
              <div key={strat.key} className="space-y-1">
                <div className="flex justify-between text-[#7fa292]">
                  <span>{strat.label}</span>
                  <span className="text-[#00FF66] font-bold">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[#080C16] border border-[#39A900]/70">
                  <div
                    className={`h-full bg-gradient-to-r ${strat.color} transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,102,0.4)]`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick List of Risks */}
        <div className="mt-4 pt-3 border-t border-[#39A900]/30 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#7fa292]">
            <span>CATÁLOGO DE RIESGOS IDENTIFICADOS</span>
            <span className="text-[#00E5FF]">{risks.length} REGISTROS</span>
          </div>

          <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
            {risks.map(r => (
              <div
                key={r.id}
                onClick={() => onSelectRisk(r)}
                className="flex items-center justify-between p-2 border border-[#39A900]/30 bg-[#0d1424]/70 hover:border-[#00FF66] cursor-pointer transition-colors"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-[#ff3860] mr-2">{r.id}</span>
                  <span className="text-[#d7ffe6]">{r.n}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#00E5FF] px-1 py-0.5 border border-[#00E5FF]/30">
                    {r.t}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-[#00FF66]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
};
