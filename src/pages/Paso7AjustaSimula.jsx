import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Paso7AjustaSimula() {
  const navigate = useNavigate();
  const [deviceTab, setDeviceTab] = useState('dispositivos');

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-7">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            7
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Ajusta y simula con Repetidor</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          {/* Dual Heatmap coverage with Mesh Node */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="w-full max-w-2xl h-84 sm:h-96 rounded-3xl relative border-4 border-slate-800 overflow-hidden shadow-2xl">
              {/* Blueprint overlays */}
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

              {/* Mesh Heatmap (Balanced signal) */}
              <div className="absolute inset-0 wifi-mesh-heatmap"></div>

              {/* Router Node */}
              <div className="absolute bottom-16 left-28 z-20">
                <div className="bg-slate-900 border-2 border-white px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-white">Router WIN</span>
                </div>
              </div>

              {/* Repetidor Mesh Node */}
              <div className="absolute top-16 right-28 z-20">
                <div className="bg-win-600 border-2 border-white px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
                  <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  <span className="text-xs font-bold text-white">Repetidor Mesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Options right panel */}
          <div className="lg:col-span-4 space-y-5">
            <span className="text-base font-bold text-slate-900 block">¿Qué quieres hacer?</span>
            <div className="flex space-x-2 text-xs font-bold">
              <button
                onClick={() => setDeviceTab('dispositivos')}
                className={`px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  deviceTab === 'dispositivos'
                    ? 'bg-win-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dispositivos
              </button>
              <button
                onClick={() => setDeviceTab('habitaciones')}
                className={`px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  deviceTab === 'habitaciones'
                    ? 'bg-win-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Habitaciones
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center space-x-3.5 shadow-sm">
                <span className="text-2xl text-win-500">📡</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Router WIN</h4>
                  <p className="text-[11px] text-slate-500">Wi-Fi 6 de ultra alta potencia</p>
                </div>
              </div>
              <div className="p-4 bg-win-50 border border-win-200 rounded-2xl flex items-center space-x-3.5 shadow-sm">
                <span className="text-2xl text-win-600">📶</span>
                <div>
                  <h4 className="text-xs font-bold text-win-700">Repetidor Mesh WIN</h4>
                  <p className="text-[11px] text-win-600/90 font-medium">Cobertura inteligente continua en todo el hogar</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                className="w-full py-4 bg-win-500 hover:bg-win-600 text-white font-bold text-sm rounded-full shadow-lg shadow-win-500/25 transition flex items-center justify-center space-x-2 cursor-pointer"
                onClick={() => navigate('/paso-8')}
              >
                <span>Ver diagnóstico</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-6')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-8')}
        >
          <span>Continuar</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
