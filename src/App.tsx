import React, { useState, useEffect, useRef } from 'react';
import { LockScreen } from './components/LockScreen';
import { HudHeader } from './components/HudHeader';
import { Pillar1SGD } from './components/Pillar1SGD';
import { Pillar2TVD } from './components/Pillar2TVD';
import { Pillar3Risks } from './components/Pillar3Risks';
import { V2ModulesView, AppMode } from './components/V2ModulesView';
import { RadicarModal } from './components/RadicarModal';
import { RiskDetailModal } from './components/RiskDetailModal';
import { DocumentRecord, DocumentRisk, TVDRow } from './types';
import {
  INITIAL_TVD_ROWS,
  INITIAL_RISKS,
  INITIAL_DOCS,
  PERIODS,
} from './data/mockData';
import { soundService } from './services/soundService';

export default function App() {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [currentMode, setCurrentMode] = useState<AppMode>('overview');
  const [totalDocs, setTotalDocs] = useState<number>(128430);
  const [docFeed, setDocFeed] = useState<DocumentRecord[]>(INITIAL_DOCS);
  const [isFeedLive, setIsFeedLive] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [tvdRows, setTvdRows] = useState<TVDRow[]>(INITIAL_TVD_ROWS);
  const [risksList, setRisksList] = useState<DocumentRisk[]>(INITIAL_RISKS);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);

  // Modals
  const [isRadicarModalOpen, setIsRadicarModalOpen] = useState<boolean>(false);
  const [selectedRiskForModal, setSelectedRiskForModal] = useState<DocumentRisk | null>(null);

  // Counter and live feed generation
  useEffect(() => {
    if (isLocked || !isFeedLive) return;

    const interval = setInterval(() => {
      setTotalDocs(prev => {
        const next = prev + 1;
        const randomTvd = tvdRows[Math.floor(Math.random() * tvdRows.length)];
        const now = new Date();
        const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('es-CO')}`;

        const newDoc: DocumentRecord = {
          id: `DOC-${next}`,
          radicado: `SENA-2026-${String(next).padStart(6, '0')}`,
          serie: randomTvd?.serie || 'Correspondencia Oficial',
          dep: randomTvd?.dep || 'Dirección General',
          fecha: formattedDate,
          folios: Math.floor(Math.random() * 45) + 4,
          tipo: ['Acta', 'Resolución', 'Oficio', 'Contrato'][Math.floor(Math.random() * 4)] as DocumentRecord['tipo'],
          soporte: ['Electrónico', 'Híbrido', 'Físico'][Math.floor(Math.random() * 3)] as DocumentRecord['soporte'],
          hash: `SHA256:${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
          estado: 'Radicado',
        };

        setDocFeed(currentFeed => [newDoc, ...currentFeed.slice(0, 19)]);
        return next;
      });
    }, 3600);

    return () => clearInterval(interval);
  }, [isLocked, isFeedLive, tvdRows]);

  // Filtered rows for TVD
  const filteredTvdRows = tvdRows.filter(row => {
    const matchesPeriod = selectedPeriod === 'all' || row.per === selectedPeriod;
    const matchesDept = selectedDept === 'all' || row.dep === selectedDept;
    return matchesPeriod && matchesDept;
  });

  // Filtered risks
  const filteredRisks = risksList.filter(risk => {
    return selectedDept === 'all' || risk.dep === selectedDept;
  });

  // Calculate dynamic KPIs
  const controlledRisksCount = filteredRisks.filter(
    r => r.p * r.i * (1 - r.c) <= 9
  ).length;
  const kpiRisksControlledPct = filteredRisks.length
    ? Math.round((controlledRisksCount / filteredRisks.length) * 100)
    : 89;

  // Handlers
  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleRelock = () => {
    soundService.playBlip(320);
    soundService.stopSynthwave();
    setIsLocked(true);
  };

  const handleRegisterDocument = (newDoc: DocumentRecord) => {
    setTotalDocs(prev => prev + 1);
    setDocFeed(prev => [newDoc, ...prev.slice(0, 19)]);
  };

  // Export to CSV
  const handleExportCSV = () => {
    soundService.playBlip(880);
    const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

    const lines: string[][] = [
      ['SENA - SISTEMA DE GESTIÓN DOCUMENTAL INTEGRADA'],
      [`Reporte generado: ${new Date().toLocaleString('es-CO')}`],
      [`Filtro Periodo: ${PERIODS[selectedPeriod] || selectedPeriod}`],
      [`Filtro Dependencia: ${selectedDept}`],
      [],
      ['TABLAS DE VALORACIÓN DOCUMENTAL (TVD / AGN)'],
      ['Código', 'Dependencia', 'Serie / Asunto', 'Años Archivo Central (A.C.)', 'Disposición Final', 'Periodo', 'Justificación Legal'],
    ];

    filteredTvdRows.forEach(r => {
      lines.push([
        r.codigo,
        r.dep,
        r.serie,
        String(r.ac),
        r.disp,
        PERIODS[r.per] || r.per,
        r.justificacion,
      ]);
    });

    lines.push(
      [],
      ['MATRIZ DE RIESGOS DOCUMENTALES (NTC-ISO 31000)'],
      ['ID', 'Riesgo', 'Dependencia', 'Probabilidad (1-5)', 'Impacto (1-5)', 'Inherente', 'Eficacia Control', 'Residual', 'Estrategia', 'Plan de Acción']
    );

    filteredRisks.forEach(r => {
      lines.push([
        r.id,
        r.n,
        r.dep,
        String(r.p),
        String(r.i),
        String(r.p * r.i),
        `${(r.c * 100).toFixed(0)}%`,
        (r.p * r.i * (1 - r.c)).toFixed(1),
        r.t,
        r.planAccion,
      ]);
    });

    const csvContent = '\uFEFF' + lines.map(row => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SENA_SGD_TVD_RIESGOS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    soundService.playBlip(750);
    window.print();
  };

  return (
    <div
      className={`min-h-screen bg-[#080C16] text-[#d7ffe6] font-mono relative ${
        scanlinesActive ? 'scanlines' : ''
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 12% 10%, rgba(57, 169, 0, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 88% 90%, rgba(0, 229, 255, 0.07) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(13, 20, 36, 0.8) 0%, #080C16 100%)
        `,
      }}
    >
      {/* Air-lock Security Screen */}
      {isLocked && <LockScreen onUnlock={handleUnlock} />}

      {/* Main HUD Dashboard */}
      <div className={`transition-opacity duration-1000 ${isLocked ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {/* HUD Navigation Bar */}
        <HudHeader
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          totalDocs={totalDocs}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          onOpenRadicarModal={() => {
            soundService.playBlip(700);
            setIsRadicarModalOpen(true);
          }}
          onExportCSV={handleExportCSV}
          onPrintPDF={handlePrintPDF}
          onRelock={handleRelock}
          scanlinesActive={scanlinesActive}
          onToggleScanlines={() => setScanlinesActive(prev => !prev)}
          kpiMaturity={3.6}
          kpiCompliance={87}
          kpiRisksControlled={kpiRisksControlledPct}
        />

        {/* Dynamic View: Overview (3 Pillars Grid) vs V2 Dedicated Module View */}
        {currentMode === 'overview' ? (
          <main className="max-w-[1720px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PILAR 01 */}
            <Pillar1SGD
              totalDocs={totalDocs}
              docFeed={docFeed}
              isFeedLive={isFeedLive}
              onToggleFeedLive={() => setIsFeedLive(prev => !prev)}
              onOpenRadicarModal={() => {
                soundService.playBlip(700);
                setIsRadicarModalOpen(true);
              }}
            />

            {/* PILAR 02 */}
            <Pillar2TVD
              rows={filteredTvdRows}
              selectedPeriod={selectedPeriod}
            />

            {/* PILAR 03 */}
            <Pillar3Risks
              risks={filteredRisks}
              onSelectRisk={risk => {
                soundService.playBlip(650);
                setSelectedRiskForModal(risk);
              }}
            />
          </main>
        ) : (
          <main className="max-w-[1720px] mx-auto">
            <V2ModulesView
              currentMode={currentMode}
              onModeChange={setCurrentMode}
              totalDocs={totalDocs}
              docFeed={docFeed}
              tvdRows={filteredTvdRows}
              risks={filteredRisks}
              onOpenRadicarModal={() => {
                soundService.playBlip(700);
                setIsRadicarModalOpen(true);
              }}
              onSelectRisk={risk => {
                soundService.playBlip(650);
                setSelectedRiskForModal(risk);
              }}
            />
          </main>
        )}

        {/* Operational Footer */}
        <footer className="max-w-[1720px] mx-auto px-4 py-6 border-t border-[#39A900]/30 text-center text-xs text-[#7fa292] font-mono no-print">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
            <span>SISTEMA INTEGRADO DE GESTIÓN ARCHIVÍSTICA SENA</span>
            <span>·</span>
            <span>NORMATIVA AGN ACUERDO 004/2019</span>
            <span>·</span>
            <span>ISO 30301 RECORDKEEPING</span>
            <span>·</span>
            <span>NTC-ISO 31000 RISK MANAGEMENT</span>
          </div>
          <p className="text-[11px] text-[#7fa292]/70">
            Despliegue Operacional SENA · Bogotá D.C., Colombia · Dirección General - Secretaría General
          </p>
        </footer>
      </div>

      {/* Radication Modal */}
      <RadicarModal
        isOpen={isRadicarModalOpen}
        onClose={() => setIsRadicarModalOpen(false)}
        onRegisterDocument={handleRegisterDocument}
        nextRadicadoNumber={totalDocs + 1}
      />

      {/* Risk Inspection Modal */}
      <RiskDetailModal
        risk={selectedRiskForModal}
        onClose={() => setSelectedRiskForModal(null)}
      />
    </div>
  );
}
