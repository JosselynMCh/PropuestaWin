import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Principal() {
  const navigate = useNavigate();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-1">
      <div className="flex items-center space-x-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
          1
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Ingresa al sistema</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto py-6">
        <div className="lg:col-span-7 spa ce-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Conecta tu hogar con la mejor{' '}
            <span className="text-win-500 block sm:inline">cobertura de internet</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed">
            Diseña tu casa, coloca tus dispositivos y descubre hasta dónde llega la señal de WIN con fibra 100% simétrica.
          </p>
          <div className="pt-2">
            <button
              className="px-8 py-4 bg-win-500 hover:bg-win-600 text-white font-bold rounded-full shadow-lg shadow-win-500/30 flex items-center space-x-3 transition transform hover:-translate-y-0.5 cursor-pointer text-base"
              onClick={() => navigate('/paso-2')}
            >
              <span>Comenzar</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hero House Visual with Wi-Fi signal beacon */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-gradient-to-tr from-amber-50 to-orange-100 p-4">
            {/* Wi-Fi beacon float */}
            <div className="absolute top-6 right-6 z-10 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-win-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>

            {/* Modern Home Graphic SVG */}
            <div className="w-full h-72 sm:h-80 bg-slate-800 rounded-2xl relative overflow-hidden flex items-end justify-center">
              <svg className="w-full h-full object-cover" viewBox="0 0 320 220">
                <rect fill="#1e293b" height="220" width="320" />
                <rect fill="#0f172a" height="50" width="320" y="170" />
                <rect fill="#f8fafc" height="110" rx="4" width="220" x="50" y="70" />
                <rect fill="#e2e8f0" height="50" rx="4" width="140" x="70" y="40" />
                <rect fill="#ff6200" height="8" rx="2" width="180" x="40" y="65" />
                <rect fill="#38bdf8" fillOpacity="0.8" height="40" rx="2" width="60" x="80" y="85" />
                <rect fill="#38bdf8" fillOpacity="0.6" height="60" rx="2" width="70" x="180" y="85" />
                <rect fill="#ff6200" fillOpacity="0.9" height="40" width="40" x="85" y="140" />
                <rect fill="#64748b" height="2" width="150" x="65" y="60" />
                <line stroke="#64748b" strokeWidth="2" x1="80" x2="80" y1="50" y2="65" />
                <line stroke="#64748b" strokeWidth="2" x1="120" x2="120" y1="50" y2="65" />
                <line stroke="#64748b" strokeWidth="2" x1="160" x2="160" y1="50" y2="65" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
