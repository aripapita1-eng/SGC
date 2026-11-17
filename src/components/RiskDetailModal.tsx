import React from 'react';
import { DocumentRisk } from '../types';
import { ShieldAlert, X, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

interface RiskDetailModalProps {
  risk: DocumentRisk | null;
  onClose: () => void;
}

export const RiskDetailModal: React.FC<RiskDetailModalProps> = ({ risk, onClose }) => {
  if (!risk) return null;

  const inherente = risk.p * risk.i;
  const residual = (risk.p * risk.i * (1 - risk.c)).toFixed(1);

  const getSeverityBadge = (score: number) => {
    if (score <= 4) return { text: 'BAJO', color: '#00FF66' };
    if (score <= 9) return { text: 'TOLERABLE', color: '#c6ff00' };
    if (score <= 14) return { text: 'MODERADO', color: '#ffb020' };
    if (score <= 19) return { text: 'ALTO', color: '#ff7a1a' };
    return { text: 'EXTREMO', color: '#ff3860' };
  };

  const badgeInh = getSeverityBadge(inherente);
  const badgeRes = getSeverityBadge(Number(residual));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl border border-[#ff3860] bg-[#080C16] cyber-panel p-6 shadow-[0_0_40px_rgba(255,56,96,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ff3860]/40">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#ff3860]" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#ff3860]/20 text-[#ff3860] border border-[#ff3860] font-bold font-mono text-xs">
                {risk.id}
              </span>
              <h2 className="text-sm font-bold font-mono tracking-wider text-[#d7ffe6] uppercase">
                FICHA TÉCNICA DE RIESGO · NTC-ISO 31000
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7fa292] hover:text-[#ff3860] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-mono text-xs">
          <div>
            <span className="block text-[10px] text-[#7fa292] uppercase">Riesgo Identificado</span>
            <div className="text-sm font-bold text-[#ff3860] mt-0.5">{risk.n}</div>
            <div className="text-[11px] text-[#00E5FF] mt-0.5">Dependencia: {risk.dep}</div>
          </div>

          <div className="p-3 bg-[#0d1424] border border-[#39A900]/40 space-y-2">
            <span className="block text-[10px] text-[#7fa292] uppercase">Descripción Operacional</span>
            <p className="text-[11px] text-[#d7ffe6] leading-relaxed">{risk.descripcion}</p>
          </div>

          {/* Quantitative Matrix Evaluation */}
          <div className="grid grid-cols-2 gap-3">
            {/* Riesgo Inherente */}
            <div className="p-3 bg-[#080C16] border border-[#ff7a1a]/60 space-y-1.5">
              <span className="block text-[10px] text-[#7fa292] uppercase">Riesgo Inherente</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-[#ff7a1a]">{inherente} pts</span>
                <span
                  className="px-1.5 py-0.5 text-[9px] font-bold border"
                  style={{ color: badgeInh.color, borderColor: badgeInh.color }}
                >
                  {badgeInh.text}
                </span>
              </div>
              <div className="text-[10px] text-[#7fa292]">
                Probabilidad: P{risk.p} · Impacto: I{risk.i}
              </div>
            </div>

            {/* Riesgo Residual */}
            <div className="p-3 bg-[#080C16] border border-[#00FF66]/60 space-y-1.5">
              <span className="block text-[10px] text-[#7fa292] uppercase">Riesgo Residual</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-[#00FF66]">{residual} pts</span>
                <span
                  className="px-1.5 py-0.5 text-[9px] font-bold border"
                  style={{ color: badgeRes.color, borderColor: badgeRes.color }}
                >
                  {badgeRes.text}
                </span>
              </div>
              <div className="text-[10px] text-[#7fa292]">
                Eficacia del Control: {(risk.c * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Controls & Treatment */}
          <div className="space-y-3 pt-2 border-t border-[#39A900]/30">
            <div>
              <span className="block text-[10px] text-[#7fa292] uppercase">Control Actual Establecido</span>
              <div className="p-2 bg-[#0d1424] border border-[#39A900]/30 text-[11px] text-[#d7ffe6] mt-1">
                {risk.controlActual}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#7fa292] uppercase">Estrategia & Plan de Acción</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]">
                  {risk.t.toUpperCase()}
                </span>
              </div>
              <div className="p-2 bg-[#0d1424] border border-[#00FF66]/40 text-[11px] text-[#00FF66] leading-relaxed">
                {risk.planAccion}
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-3 border-t border-[#39A900]/30 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#39A900]/30 border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66] hover:text-[#080C16] font-bold transition-all cursor-pointer"
            >
              CERRAR FICHA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
