import React, { useEffect, useState } from 'react';
import { SenaLogo } from './SenaLogo';
import { soundService } from '../services/soundService';
import { PERIODS, DEPARTMENTS } from '../data/mockData';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Printer,
  FilePlus2,
  Lock,
  Tv,
  Radio,
} from 'lucide-react';

import { AppMode } from './V2ModulesView';

interface HudHeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  totalDocs: number;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  onOpenRadicarModal: () => void;
  onExportCSV: () => void;
  onPrintPDF: () => void;
  onRelock: () => void;
  scanlinesActive: boolean;
  onToggleScanlines: () => void;
  kpiMaturity: number;
  kpiCompliance: number;
  kpiRisksControlled: number;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  currentMode,
  onModeChange,
  totalDocs,
  selectedPeriod,
  onPeriodChange,
  selectedDept,
  onDeptChange,
  onOpenRadicarModal,
  onExportCSV,
  onPrintPDF,
  onRelock,
  scanlinesActive,
  onToggleScanlines,
  kpiMaturity,
  kpiCompliance,
  kpiRisksControlled,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    soundService.playBlip(750);
  };

  const handleTogglePlayMusic = () => {
    const active = soundService.toggleMusic();
    setIsPlaying(active);
    soundService.playBlip(active ? 880 : 440);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080C16]/95 backdrop-blur-md border-b border-[#39A900] shadow-[0_0_24px_rgba(57,169,0,0.35)] px-4 py-3 no-print">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-3">
        {/* Top row: Brand + KPIs + Audio Player */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <SenaLogo size={46} glow={true} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#00FF66] tracking-wider font-mono">
                  SENA · GESTIÓN DOCUMENTAL
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#00E5FF] border border-[#00E5FF]/40 bg-[#00E5FF]/10 uppercase">
                  OPERACIONAL
                </span>
              </div>
              <p className="text-[11px] text-[#7fa292] font-mono">
                SGD ISO 30301 · TVD / AGN · GESTIÓN DE RIESGOS NTC-ISO 31000
              </p>
            </div>
          </div>

          {/* Telemetry KPIs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="border border-[#39A900]/70 bg-[#080C16]/80 px-3 py-1.5 min-w-[125px]">
              <span className="block text-[10px] text-[#7fa292] uppercase font-mono">Madurez SGD</span>
              <div className="text-sm font-bold text-[#00FF66] font-mono">
                {kpiMaturity.toFixed(1)} <span className="text-[#7fa292] text-xs">/ 5.0</span>
              </div>
            </div>

            <div className="border border-[#39A900]/70 bg-[#080C16]/80 px-3 py-1.5 min-w-[125px]">
              <span className="block text-[10px] text-[#7fa292] uppercase font-mono">Conformidad TVD</span>
              <div className="text-sm font-bold text-[#00E5FF] font-mono">{kpiCompliance}%</div>
            </div>

            <div className="border border-[#39A900]/70 bg-[#080C16]/80 px-3 py-1.5 min-w-[125px]">
              <span className="block text-[10px] text-[#7fa292] uppercase font-mono">Riesgos Bajo Control</span>
              <div className="text-sm font-bold text-[#3EF5B5] font-mono">{kpiRisksControlled}%</div>
            </div>

            <div className="border border-[#39A900]/70 bg-[#080C16]/80 px-3 py-1.5 min-w-[135px]">
              <span className="block text-[10px] text-[#7fa292] uppercase font-mono">Total Custodiado</span>
              <div className="text-sm font-bold text-[#00FF66] font-mono">
                {totalDocs.toLocaleString('es-CO')} <span className="text-[10px] text-[#7fa292]">EXP</span>
              </div>
            </div>
          </div>

          {/* Cyber Synthwave Audio Player */}
          <div className="flex items-center gap-3 border border-[#00E5FF]/50 bg-[#00E5FF]/10 px-3 py-1.5 cyber-panel">
            {/* Equalizer Waveform animation */}
            <div className="flex items-end gap-[3px] h-5 w-6">
              {[0.1, 0.35, 0.2, 0.55, 0.4].map((delay, idx) => (
                <span
                  key={idx}
                  className={`w-1 bg-[#00FF66] rounded-t-sm transition-all ${
                    isPlaying && !isMuted ? 'animate-pulse' : 'h-1.5 opacity-30'
                  }`}
                  style={{
                    height: isPlaying && !isMuted ? `${40 + (idx * 15) % 60}%` : '4px',
                    animationDuration: `${0.6 + delay}s`,
                  }}
                />
              ))}
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5 text-[9px] text-[#00E5FF] font-mono uppercase tracking-widest">
                <Radio className="w-2.5 h-2.5 animate-spin" />
                <span>SYNTHWAVE HUD</span>
              </div>
              <div className="text-[11px] text-[#00FF66] font-mono font-bold truncate max-w-[150px]">
                Timecop1983 · On The Run
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleTogglePlayMusic}
                title={isPlaying ? 'Pausar música' : 'Reproducir música'}
                className="p-1 text-[#00FF66] hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                className={`p-1 transition-colors ${isMuted ? 'text-[#ff3860]' : 'text-[#00FF66] hover:text-white'}`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: System Clock, Filters, and HUD Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#39A900]/30 text-xs font-mono">
          {/* Clock & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#00E5FF]">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
              <span>SYS {currentTime} BOG</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[#7fa292] text-[11px]">
              <span>ENLACE AGN:</span>
              <span className="text-[#00FF66]">ACTIVO (99.8%)</span>
            </div>
          </div>

          {/* Filter selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="periodSelect" className="text-[#7fa292]">
                Periodo:
              </label>
              <select
                id="periodSelect"
                value={selectedPeriod}
                onChange={e => onPeriodChange(e.target.value)}
                className="bg-[#0d1424] border border-[#39A900] text-[#00FF66] px-2.5 py-1 text-xs focus:outline-none focus:border-[#00FF66] cursor-pointer"
              >
                {Object.entries(PERIODS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="deptSelect" className="text-[#7fa292]">
                Dependencia:
              </label>
              <select
                id="deptSelect"
                value={selectedDept}
                onChange={e => onDeptChange(e.target.value)}
                className="bg-[#0d1424] border border-[#39A900] text-[#00FF66] px-2.5 py-1 text-xs focus:outline-none focus:border-[#00FF66] cursor-pointer"
              >
                <option value="all">Todas las dependencias</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tactical action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenRadicarModal}
              className="cyber-btn flex items-center gap-1 px-3 py-1 bg-[#00FF66] text-[#080C16] font-bold hover:bg-[#3EF5B5] transition-all shadow-[0_0_12px_rgba(0,255,102,0.6)] cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>RADICAR</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              className="cyber-btn flex items-center gap-1 px-2.5 py-1 bg-[#39A900]/20 border border-[#39A900] text-[#00FF66] hover:bg-[#00FF66] hover:text-[#080C16] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={onPrintPDF}
              className="cyber-btn flex items-center gap-1 px-2.5 py-1 bg-[#39A900]/20 border border-[#39A900] text-[#00FF66] hover:bg-[#00FF66] hover:text-[#080C16] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={onToggleScanlines}
              title="Alternar filtro CRT Scanlines"
              className={`cyber-btn p-1 border transition-all ${
                scanlinesActive
                  ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/20'
                  : 'border-[#7fa292]/40 text-[#7fa292] hover:text-[#00E5FF]'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onRelock}
              title="Bloquear terminal y volver al acceso de seguridad"
              className="cyber-btn p-1 border border-[#ff3860]/70 text-[#ff3860] hover:bg-[#ff3860] hover:text-white transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* V2 · MENÚ DE MÓDULOS Y VISTAS NUEVAS */}
        <div className="modes no-print">
          <button
            type="button"
            onClick={() => {
              soundService.playBlip(750);
              onModeChange('overview');
            }}
            className={`cbtn ${currentMode === 'overview' ? 'on' : ''}`}
          >
            [00 · CENTRO DE CONTROL TÁCTICO (3 PILARES)]
          </button>
          <button
            type="button"
            onClick={() => {
              soundService.playBlip(750);
              onModeChange('sgd');
            }}
            className={`cbtn ${currentMode === 'sgd' ? 'on' : ''}`}
          >
            [01 · SGD - ISO 30301 DETALLADO]
          </button>
          <button
            type="button"
            onClick={() => {
              soundService.playBlip(750);
              onModeChange('tvd');
            }}
            className={`cbtn ${currentMode === 'tvd' ? 'on' : ''}`}
          >
            [02 · TVD & FONDO ACUMULADO AGN]
          </button>
          <button
            type="button"
            onClick={() => {
              soundService.playBlip(750);
              onModeChange('risks');
            }}
            className={`cbtn ${currentMode === 'risks' ? 'on' : ''}`}
          >
            [03 · MATRIZ DE RIESGO ISO 31000]
          </button>
          <button
            type="button"
            onClick={() => {
              soundService.playBlip(750);
              onModeChange('ventanilla');
            }}
            className={`cbtn ${currentMode === 'ventanilla' ? 'on' : ''}`}
          >
            [04 · VENTANILLA & TRAZABILIDAD]
          </button>
        </div>
      </div>
    </header>
  );
};
