import React, { useState } from 'react';
import { DocumentRecord } from '../types';
import { DEPARTMENTS } from '../data/mockData';
import { soundService } from '../services/soundService';
import { FilePlus2, X, ShieldCheck, Check, Sparkles, Hash } from 'lucide-react';

interface RadicarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterDocument: (doc: DocumentRecord) => void;
  nextRadicadoNumber: number;
}

export const RadicarModal: React.FC<RadicarModalProps> = ({
  isOpen,
  onClose,
  onRegisterDocument,
  nextRadicadoNumber,
}) => {
  const [serie, setSerie] = useState<string>('Actas de Consejo Directivo');
  const [dep, setDep] = useState<string>(DEPARTMENTS[0]);
  const [tipo, setTipo] = useState<DocumentRecord['tipo']>('Acta');
  const [soporte, setSoporte] = useState<DocumentRecord['soporte']>('Híbrido');
  const [folios, setFolios] = useState<number>(12);
  const [asunto, setAsunto] = useState<string>('');

  if (!isOpen) return null;

  const generatedRadicado = `SENA-2026-${String(nextRadicadoNumber).padStart(6, '0')}`;
  const generatedHash = `SHA256:${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playChirp();

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('es-CO')}`;

    const newDoc: DocumentRecord = {
      id: `DOC-${nextRadicadoNumber}`,
      radicado: generatedRadicado,
      serie,
      dep,
      fecha: formattedDate,
      folios: Number(folios) || 1,
      tipo,
      soporte,
      hash: generatedHash,
      estado: 'Radicado',
    };

    onRegisterDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg border border-[#00FF66] bg-[#080C16] cyber-panel p-6 shadow-[0_0_40px_rgba(0,255,102,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#39A900]/50">
          <div className="flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-[#00FF66]" />
            <h2 className="text-sm font-bold font-mono tracking-wider text-[#00FF66] uppercase">
              RADICACIÓN EN LÍNEA DE DOCUMENTOS (SGD)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7fa292] hover:text-[#ff3860] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Radicado Auto-ID Banner */}
          <div className="p-3 bg-[#00FF66]/10 border border-[#00FF66]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#00FF66]" />
              <div>
                <span className="block text-[10px] text-[#7fa292]">RADICADO ÚNICO ASIGNADO</span>
                <span className="text-sm font-black text-[#00FF66] tracking-wider">
                  {generatedRadicado}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-[#7fa292]">INTEGRIDAD</span>
              <span className="text-[10px] text-[#00E5FF]">{generatedHash}</span>
            </div>
          </div>

          {/* Serie / Asunto */}
          <div>
            <label className="block text-[#7fa292] mb-1">Serie Documental / Asunto</label>
            <select
              value={serie}
              onChange={e => setSerie(e.target.value)}
              className="w-full bg-[#0d1424] border border-[#39A900] text-[#00FF66] p-2 focus:outline-none focus:border-[#00FF66]"
            >
              <option value="Actas de Consejo Directivo">Actas de Consejo Directivo (100.01)</option>
              <option value="Resoluciones de Dirección">Resoluciones de Dirección (100.02)</option>
              <option value="Historias Laborales">Historias Laborales (200.01)</option>
              <option value="Contratos de Prestación">Contratos de Prestación (200.02)</option>
              <option value="Expedientes de Aprendices">Expedientes de Aprendices (300.01)</option>
              <option value="Informes de Gestión">Informes de Gestión (300.02)</option>
              <option value="Convenios Interinstitucionales">Convenios Interinstitucionales (300.05)</option>
            </select>
          </div>

          {/* Dependencia */}
          <div>
            <label className="block text-[#7fa292] mb-1">Dependencia Productora</label>
            <select
              value={dep}
              onChange={e => setDep(e.target.value)}
              className="w-full bg-[#0d1424] border border-[#39A900] text-[#00FF66] p-2 focus:outline-none focus:border-[#00FF66]"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo, Soporte, Folios */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#7fa292] mb-1">Tipo Documental</label>
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value as DocumentRecord['tipo'])}
                className="w-full bg-[#0d1424] border border-[#39A900] text-[#00FF66] p-2 focus:outline-none focus:border-[#00FF66]"
              >
                <option value="Acta">Acta</option>
                <option value="Resolución">Resolución</option>
                <option value="Oficio">Oficio</option>
                <option value="Historia Laboral">Historia Laboral</option>
                <option value="Contrato">Contrato</option>
                <option value="Expediente Aprendiz">Expediente Aprendiz</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7fa292] mb-1">Soporte</label>
              <select
                value={soporte}
                onChange={e => setSoporte(e.target.value as DocumentRecord['soporte'])}
                className="w-full bg-[#0d1424] border border-[#39A900] text-[#00FF66] p-2 focus:outline-none focus:border-[#00FF66]"
              >
                <option value="Electrónico">Electrónico</option>
                <option value="Físico">Físico</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7fa292] mb-1">N° Folios</label>
              <input
                type="number"
                min="1"
                max="5000"
                value={folios}
                onChange={e => setFolios(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0d1424] border border-[#39A900] text-[#00FF66] p-2 focus:outline-none focus:border-[#00FF66]"
              />
            </div>
          </div>

          {/* Asunto detallado */}
          <div>
            <label className="block text-[#7fa292] mb-1">Descripción del Asunto</label>
            <input
              type="text"
              placeholder="Ej. Incorporación de lineamientos curriculares 2026..."
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              className="w-full bg-[#0d1424] border border-[#39A900] text-[#d7ffe6] p-2 focus:outline-none focus:border-[#00FF66] placeholder:text-[#7fa292]/50"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#39A900]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#7fa292]/50 text-[#7fa292] hover:text-white transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="cyber-btn flex items-center gap-1.5 px-5 py-2 bg-[#00FF66] text-[#080C16] font-bold hover:bg-[#3EF5B5] transition-all shadow-[0_0_15px_rgba(0,255,102,0.6)] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>RADICAR DOCUMENTO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
