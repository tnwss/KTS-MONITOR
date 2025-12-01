import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alarm } from '../types';

interface AlarmModalProps {
  alarm: Alarm | null;
  onClose: () => void;
  labels?: {
    alarmCode: string;
    warningCode: string;
    alarmInfo: string;
    warningInfo: string;
    acknowledge: string;
  };
}

export const AlarmModal: React.FC<AlarmModalProps> = ({ alarm, onClose, labels }) => {
  if (!alarm) return null;

  const isWarning = alarm.type === 'WARNING';

  const l = labels || {
    alarmCode: 'Alarm Cod',
    warningCode: 'Warning Cod',
    alarmInfo: 'Alarm Information',
    warningInfo: 'Warning Information',
    acknowledge: 'ACKNOWLEDGE'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      {/* 修改宽度为 95% 并在大屏限制宽度 */}
      <div className="relative w-[95%] md:w-[600px] bg-[#2a2a2a] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border-2 border-gray-600 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Bar */}
        <div className="flex justify-between items-start p-2 bg-[#1f2937] border-b border-gray-600">
            <span className="text-gray-400 text-xs font-mono px-2 pt-1">SYSTEM ALERT</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="px-4 py-6 md:px-8 md:pb-10 md:pt-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Warning Icon */}
            <div className="shrink-0 pt-2">
                <div className="relative">
                    <AlertTriangle 
                        size={80} 
                        className={`
                            ${isWarning ? "text-yellow-400" : "text-red-600"} 
                            drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]
                            animate-blink-fast
                        `}
                        fill={isWarning ? "#facc15" : "#dc2626"}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 w-full">
                <div className="text-gray-300 font-mono text-sm mb-2 text-center md:text-left">
                    {isWarning ? l.warningCode : l.alarmCode}: <span className="text-white font-bold tracking-wider">{alarm.code}</span>
                </div>

                <div className="bg-white rounded p-4 min-h-[100px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-l-4 border-gray-300">
                    <h3 className={`font-bold mb-2 text-lg ${isWarning ? 'text-yellow-600' : 'text-red-600'}`}>
                        {isWarning ? l.warningInfo : l.alarmInfo}:
                    </h3>
                    <p className="text-black font-semibold text-sm leading-relaxed">
                        {alarm.message}
                    </p>
                </div>
                
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 md:py-2 rounded text-sm font-bold shadow-lg transition-colors border border-gray-500"
                    >
                        {l.acknowledge}
                    </button>
                </div>
            </div>
        </div>
        
        <div className={`h-2 w-full ${isWarning ? 'bg-yellow-500' : 'bg-red-600'}`}></div>
      </div>
    </div>
  );
};