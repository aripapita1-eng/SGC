import React, { useEffect, useRef, useState } from 'react';
import { SenaLogo } from './SenaLogo';
import { soundService } from '../services/soundService';
import { ShieldCheck, Lock, Unlock, FastForward, Cpu, Database, AlertTriangle } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [charged, setCharged] = useState<number>(0);
  const [switchesState, setSwitchesState] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [statusMessage, setStatusMessage] = useState<string>('SISTEMA BLOQUEADO · ACTIVE LOS 3 NÚCLEOS EN SECUENCIA');
  const [grantedText, setGrantedText] = useState<string>('');
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Particles Canvas
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (cv.width = window.innerWidth);
    let height = (cv.height = window.innerHeight);

    const particles = Array.from({ length: Math.min(85, Math.floor((width * height) / 16000)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.15),
      r: Math.random() * 1.8 + 0.8,
    }));

    const handleResize = () => {
      width = cv.width = window.innerWidth;
      height = cv.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber Matrix Grid
      ctx.strokeStyle = 'rgba(57, 169, 0, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Glowing Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = 'rgba(0, 255, 102, 0.75)';
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!isOpening) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpening]);

  const handleActivateSwitch = (index: number) => {
    if (switchesState[index] || isOpening) return;
    if (index > 0 && !switchesState[index - 1]) return; // Must activate in order

    const nextSwitches: [boolean, boolean, boolean] = [...switchesState];
    nextSwitches[index] = true;
    setSwitchesState(nextSwitches);

    const newCharge = charged + 1;
    setCharged(newCharge);

    // Play sci-fi blip frequency
    soundService.playBlip(440 + newCharge * 220);

    setStatusMessage(`NÚCLEO 0${newCharge}/03 SINCRONIZADO · [${index === 0 ? 'SGD ISO 30301' : index === 1 ? 'TVD / AGN' : 'NTC-ISO 31000'}] EN LÍNEA`);

    if (newCharge === 3) {
      triggerUnlockSequence();
    }
  };

  const triggerUnlockSequence = () => {
    setStatusMessage('TODOS LOS NÚCLEOS EN LÍNEA · VALIDANDO CREDENCIALES CRIPTOGRÁFICAS…');
    soundService.playChirp();

    setTimeout(() => {
      const fullText = 'ACCESO CONCEDIDO: BIENVENIDO OPERADOR DOCUMENTAL DEL SENA';
      typeWriter(fullText);
      soundService.speak('Acceso concedido. Bienvenido, Operador Documental del SENA. Iniciando sistema de gestión documental.');
    }, 700);

    setTimeout(() => {
      openVaultDoors();
    }, 4500);
  };

  const typeWriter = (text: string) => {
    setGrantedText('');
    let i = 0;
    const interval = setInterval(() => {
      setGrantedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 32);
  };

  const openVaultDoors = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundService.playDoorHydraulics();

    setTimeout(() => {
      soundService.startSynthwave();
      onUnlock();
    }, 1200);
  };

  const circumference = 565.5; // 2 * PI * 90
  const ringOffset = circumference * (1 - charged / 3);

  const switchLabels = [
    { title: 'ACTIVAR NÚCLEO SGD - ISO 30301', desc: 'Sistema de Gestión de Documentos · Políticas y Metadatos', icon: Cpu },
    { title: 'CARGAR FONDOS TVD - RADICADO AGN', desc: 'Tablas de Valoración Documental · Fondos Acumulados', icon: Database },
    { title: 'CALIBRAR MATRIZ DE RIESGO - NTC-ISO 31000', desc: 'Mapa de Calor 5x5 · Tratamiento y Controles', icon: AlertTriangle },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#080C16] flex items-center justify-center transition-opacity duration-1000 ${
        isOpening ? 'pointer-events-none' : ''
      }`}
    >
      {/* Heavy Blast Doors */}
      {/* Left Door */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 z-10 border-r-2 border-[#00FF66] shadow-[4px_0_35px_rgba(0,255,102,0.4)] transition-transform duration-[1200ms] ease-out ${
          isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background: `
            repeating-linear-gradient(90deg, transparent 0 58px, rgba(57, 169, 0, 0.08) 58px 60px),
            radial-gradient(circle at 100% 50%, #0d1a2d, #080C16 85%)
          `,
        }}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-25">
          <div className="w-2 h-16 bg-[#00FF66]" />
          <div className="w-2 h-16 bg-[#00FF66]" />
          <div className="w-2 h-16 bg-[#00FF66]" />
        </div>
      </div>

      {/* Right Door */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 z-10 border-l-2 border-[#00FF66] shadow-[-4px_0_35px_rgba(0,255,102,0.4)] transition-transform duration-[1200ms] ease-out ${
          isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background: `
            repeating-linear-gradient(90deg, transparent 0 58px, rgba(57, 169, 0, 0.08) 58px 60px),
            radial-gradient(circle at 0% 50%, #0d1a2d, #080C16 85%)
          `,
        }}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-25">
          <div className="w-2 h-16 bg-[#00FF66]" />
          <div className="w-2 h-16 bg-[#00FF66]" />
          <div className="w-2 h-16 bg-[#00FF66]" />
        </div>
      </div>

      {/* Canvas particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Central Terminal Core UI */}
      <div
        className={`relative z-30 max-w-xl w-full mx-4 flex flex-col items-center text-center p-6 sm:p-8 border border-[#39A900]/40 bg-[#080C16]/90 backdrop-blur-md cyber-panel shadow-[0_0_50px_rgba(57,169,0,0.25)] transition-opacity duration-700 ${
          isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Top HUD badge */}
        <div className="flex items-center gap-2 mb-2 text-xs tracking-widest text-[#7fa292] uppercase">
          <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
          <span>SISTEMA DE SEGURIDAD OPERACIONAL SENA</span>
          <span className="text-[#00E5FF]">· V4.2</span>
        </div>

        {/* Dynamic Glowing Isotype with Charging Ring */}
        <div className="relative my-4 flex items-center justify-center">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
            {/* Background Track Ring */}
            <circle
              cx="50%"
              cy="50%"
              r="85"
              fill="none"
              stroke="rgba(57, 169, 0, 0.2)"
              strokeWidth="5"
            />
            {/* Neon Charging Arc Ring */}
            <circle
              cx="50%"
              cy="50%"
              r="85"
              fill="none"
              stroke="#00FF66"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
              className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_#00FF66]"
            />
          </svg>

          {/* Central Logo */}
          <div
            className={`absolute flex flex-col items-center justify-center transition-all duration-700 ${
              charged === 3 ? 'animate-flash' : ''
            }`}
            style={{
              filter: `grayscale(${1 - charged / 3}) drop-shadow(0 0 ${charged * 12}px #00FF66)`,
              opacity: 0.35 + (charged / 3) * 0.65,
            }}
          >
            <SenaLogo size={120} glow={charged > 0} />
          </div>
        </div>

        {/* Status ticker */}
        <div className="min-h-[28px] mb-6">
          <p className="text-sm font-semibold tracking-wider text-[#00E5FF] font-mono">
            {statusMessage}
          </p>
        </div>

        {/* 3 Sequential Core Switches */}
        <div className="w-full flex flex-col gap-3.5 mb-6">
          {switchLabels.map((item, idx) => {
            const isChecked = switchesState[idx];
            const isDisabled = idx > 0 && !switchesState[idx - 1];
            const isNextToClick = !isChecked && (idx === 0 || switchesState[idx - 1]);
            const Icon = item.icon;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleActivateSwitch(idx)}
                disabled={isDisabled || isChecked}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-left transition-all duration-300 border ${
                  isChecked
                    ? 'border-[#00FF66] bg-[#00FF66]/15 shadow-[0_0_16px_rgba(0,255,102,0.35)] cursor-default'
                    : isDisabled
                    ? 'border-[#39A900]/25 bg-[#080C16]/50 opacity-40 cursor-not-allowed text-[#7fa292]'
                    : isNextToClick
                    ? 'border-[#00FF66] bg-[#39A900]/20 animate-cyber-pulse text-[#d7ffe6] hover:bg-[#00FF66]/20 cursor-pointer'
                    : 'border-[#39A900]/50 bg-[#080C16] text-[#7fa292]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 border ${
                      isChecked
                        ? 'border-[#00FF66] text-[#00FF66] bg-[#00FF66]/20'
                        : isDisabled
                        ? 'border-[#7fa292]/30 text-[#7fa292]'
                        : 'border-[#00FF66]/70 text-[#00FF66]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs sm:text-sm tracking-wider text-[#00FF66]">
                      [{item.title}]
                    </div>
                    <div className="text-[11px] text-[#7fa292] font-mono mt-0.5">{item.desc}</div>
                  </div>
                </div>

                {/* Cyber Switch Toggle Pill */}
                <div
                  className={`w-12 h-6 rounded-full border relative transition-colors ${
                    isChecked
                      ? 'border-[#00FF66] bg-[#00FF66]/20'
                      : 'border-[#7fa292]/50 bg-black/40'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                      isChecked
                        ? 'left-6 bg-[#00FF66] shadow-[0_0_10px_#00FF66]'
                        : 'left-0.5 bg-[#7fa292]/70'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Granted announcement text */}
        <div className="min-h-[44px] flex items-center justify-center mb-4">
          {grantedText && (
            <h2 className="text-base sm:text-lg font-mono font-bold text-[#00FF66] tracking-widest drop-shadow-[0_0_12px_#00FF66] animate-pulse">
              {grantedText}
            </h2>
          )}
        </div>

        {/* Skip button for rapid access */}
        <div className="flex items-center justify-between w-full pt-4 border-t border-[#39A900]/30 text-xs text-[#7fa292]">
          <div className="flex items-center gap-1.5 font-mono">
            {charged === 3 ? (
              <Unlock className="w-3.5 h-3.5 text-[#00FF66]" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#ffb020]" />
            )}
            <span>{charged === 3 ? 'AUTORIZADO' : 'ACCESO RESTRINGIDO'}</span>
          </div>

          <button
            type="button"
            onClick={openVaultDoors}
            className="flex items-center gap-1 hover:text-[#00FF66] transition-colors underline cursor-pointer font-mono"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Omitir intro / Acceso Rápido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
