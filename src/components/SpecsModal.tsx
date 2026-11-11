import React from 'react';
import { X, CheckCircle2, Cpu, Smartphone, Shield, Zap } from 'lucide-react';
import { SPECIFICATIONS } from '../constants/iphoneData';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUzbek: boolean;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose, isUzbek }) => {
  if (!isOpen) return null;

  const categoryIcons = [
    <Shield className="w-4 h-4 text-emerald-400" />,
    <Smartphone className="w-4 h-4 text-emerald-400" />,
    <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    <Cpu className="w-4 h-4 text-emerald-400" />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800/80 bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2E3D34] border border-emerald-500/50" />
              <h2 className="text-lg font-semibold tracking-tight">
                {isUzbek ? SPECIFICATIONS.titleUz : SPECIFICATIONS.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isUzbek ? SPECIFICATIONS.releaseDateUz : SPECIFICATIONS.releaseDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800/70 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {SPECIFICATIONS.items.map((cat, idx) => (
            <div key={idx} className="bg-neutral-900/40 border border-neutral-800/70 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {categoryIcons[idx % categoryIcons.length]}
                <h3 className="text-sm font-semibold text-neutral-200">
                  {isUzbek ? cat.categoryUz : cat.category}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cat.details.map((item, dIdx) => (
                  <div key={dIdx} className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/50">
                    <span className="block text-[11px] text-neutral-400">
                      {isUzbek ? item.labelUz : item.label}
                    </span>
                    <span className="block text-xs font-medium text-neutral-200 mt-0.5">
                      {isUzbek ? item.valueUz : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {isUzbek ? "Rasmiy Apple iPhone 13 texnik parametrlari" : "Official Apple iPhone 13 Technical Specifications"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            {isUzbek ? 'Tushunarli' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
