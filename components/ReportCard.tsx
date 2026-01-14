import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

const ReportCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 ring-1 ring-black/5">
      {/* Header - More premium feel */}
      <div className="bg-stone-50/80 p-4 border-b border-gray-100 text-center relative backdrop-blur-sm">
        <div className="flex justify-center items-center gap-3 mb-1.5 opacity-80">
          <div className="h-px w-8 bg-slate-300"></div>
          <h2 className="text-lg font-bold tracking-[0.2em] text-slate-800 uppercase">Watch Match</h2>
          <div className="h-px w-8 bg-slate-300"></div>
        </div>
        <div className="flex items-center justify-center gap-2 text-emerald-800">
            <Award size={18} />
            <h3 className="text-xl font-bold">手錶鑑定報告</h3>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-mono tracking-wide">NO. #20250747-001 | AG LUXURY LAB</p>
      </div>

      <div className="p-5 relative">
        {/* Stamp - MOVED UP to avoid overlap */}
        <div className="absolute top-1 right-2 z-10 opacity-80 transform rotate-12 pointer-events-none">
            <div className="w-16 h-16 rounded-full border-4 border-double border-emerald-700 flex flex-col items-center justify-center bg-emerald-50/90 text-emerald-800 shadow-lg backdrop-blur-sm">
                <span className="text-[8px] font-black uppercase tracking-wider">Verified</span>
                <span className="text-sm font-black leading-none">正品</span>
                <div className="w-6 h-px bg-emerald-700 my-0.5"></div>
                <span className="text-[6px] font-bold">PASSED</span>
            </div>
        </div>

        {/* Watch Info */}
        <div className="mb-6 relative z-0 pr-12">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">ROLEX</h3>
          <h3 className="text-lg font-bold text-slate-700">GMT-MASTER II</h3>
          <div className="inline-block bg-gray-100 rounded px-2 py-0.5 mt-2">
            <p className="text-[10px] text-gray-500 font-mono">SN: CKD123******1234</p>
          </div>
        </div>

        {/* Grid of Checks */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: '外觀工藝', sub: '符合原廠標準' },
            { label: '內部機芯', sub: '符合原廠標準' },
            { label: '官方保卡', sub: '符合原廠標準' },
            { label: '附件鑑定', sub: '符合原廠標準' },
          ].map((item, idx) => (
            <div key={idx} className="bg-stone-50/50 p-3 rounded-lg border border-stone-100 flex flex-col justify-center items-center text-center">
              <CheckCircle2 size={16} className="text-emerald-500 mb-1" />
              <p className="text-sm font-bold text-slate-800">{item.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
            <h4 className="font-bold text-slate-800 text-sm">鑑定師附註</h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed text-justify bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
            "經實驗室精密檢測，此腕表所有外觀零件及機芯參數均符合原廠出廠工藝標準。表殼及表扣有極輕微使用痕跡（正常佩戴級別），整體品相評級為優異 (A+)，防水及走時功能運作正常。"
          </p>
        </div>

        {/* Photos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
            <h4 className="font-bold text-slate-800 text-sm">檢測影像留檔</h4>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             {[10,11,12,13].map((i) => (
                 <img key={i} src={`https://picsum.photos/150/150?random=${i}`} alt="part" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
             ))}
          </div>
        </div>

        {/* Appraiser */}
        <div className="bg-gradient-to-r from-stone-50 to-white border border-stone-100 p-4 rounded-xl flex items-center justify-between mb-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src="https://picsum.photos/50/50?random=50" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="Jacky" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] p-0.5 rounded-full border border-white">
                        <CheckCircle2 size={10} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">Jacky Lee</span>
                        <span className="bg-stone-200 text-stone-600 text-[9px] px-1 rounded font-medium">高級鑑定師</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">2025-12-30 12:53:51</p>
                </div>
            </div>
            <div className="font-handwriting text-2xl text-slate-400 pr-2 opacity-80 -rotate-6">
                Jack Lee
            </div>
        </div>
      </div>
       <div className="border-t border-gray-100 bg-gray-50/50 p-3 text-center">
           <button className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1 w-full">
               查看完整驗證流程與標準
               <ChevronCircleRightIcon />
           </button>
       </div>
    </div>
  );
};

// Simple icon component helper
const ChevronCircleRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m10 8 4 4-4 4"/></svg>
)

export default ReportCard;
