import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Paso6Cobertura() {
  const navigate = useNavigate();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-6">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            6
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Visualiza la cobertura</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          {/* Heatmap simulation canvas */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="w-full max-w-2xl h-84 sm:h-96 rounded-3xl relative border-4 border-slate-800 overflow-hidden shadow-2xl">
              {/* Blueprint wall overlays */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 pointer-events-none z-10">
                <div className="border-r-2 border-b-2 border-slate-900/60 p-3 text-xs font-bold text-white drop-shadow">
                  Dormitorio 1
                </div>
                <div className="border-r-2 border-b-2 border-slate-900/60 p-3 text-xs font-bold text-white drop-shadow">
                  Sala
                </div>
                <div className="border-b-2 border-slate-900/60 p-3 text-xs font-bold text-white drop-shadow">
                  Cocina
                </div>
                <div className="border-r-2 border-slate-900/60 p-3 text-xs font-bold text-white drop-shadow">
                  Estudio
                </div>
                <div className="border-r-2 border-slate-900/60 p-3 text-xs font-bold text-white drop-shadow">
                  Pasillo
                </div>
                <div className="p-3 text-xs font-bold text-white drop-shadow">Dormitorio 2 / Baño</div>
              </div>

              {/* Multi-gradient wifi heatmap */}
              <div className="absolute inset-0 wifi-heatmap"></div>

              {/* Router in the exact center */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-slate-900 border-2 border-white px-4 py-2 rounded-2xl shadow-2xl flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black text-white tracking-wider">ROUTER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend + Alert Warning */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                Resumen de cobertura
              </span>
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                  <span>Excelente (100% velocidad)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-100"></span>
                  <span>Buena (Navegación fluida)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-orange-400 ring-4 ring-orange-100"></span>
                  <span>Regular (Pérdida de señal)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-100"></span>
                  <span>Sin señal (Zona ciega)</span>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className="bg-red-50 border border-red-200 rounded-3xl p-5 flex items-start space-x-3.5 text-xs text-rose-800">
              <span className="text-2xl">⚠️</span>
              <p className="leading-relaxed font-semibold">
                El segundo piso y las esquinas tienen zonas con baja señal o sin cobertura suficiente para streaming 4K y videollamadas.
              </p>
            </div>

            <button
              className="w-full py-4 bg-win-500 hover:bg-win-600 text-white font-bold text-sm rounded-full shadow-lg shadow-win-500/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              onClick={() => navigate('/paso-7')}
            >
              <span>Agregar repetidor Mesh</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-5')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-7')}
        >
          <span>Siguiente paso</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
