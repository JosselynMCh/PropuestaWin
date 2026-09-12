import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso4Plano() {
  const navigate = useNavigate();
  const { houseWidth, houseLength } = useSimulator();
  const [activeTab, setActiveTab] = useState('habitaciones');

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-4">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            4
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Vista del plano + elementos para colocar
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Dimensioned Canvas Area */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 mb-2">{houseLength} m</span>
            <div className="w-full flex items-center">
              <span className="text-xs font-bold text-slate-500 -rotate-90 -mr-3">{houseWidth} m</span>
              <div className="flex-1 h-80 sm:h-96 border-2 border-dashed border-win-500/60 rounded-3xl grid-pattern relative flex flex-col items-center justify-center p-6 bg-slate-50/50">
                <div className="w-14 h-14 text-win-500 mb-3 bg-white p-3 rounded-2xl shadow-sm border border-orange-100">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold text-center text-base max-w-sm">
                  Arrastra y suelta los elementos en el plano para diseñar tu casa
                </p>
                <span className="text-xs text-slate-400 mt-2">
                  Superficie: {houseWidth * houseLength} m² configurados
                </span>
              </div>
            </div>
          </div>

          {/* Available Room/Device Palette */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Elementos disponibles</h3>

            {/* Category Tabs */}
            <div className="flex space-x-2 text-xs font-bold mb-4">
              <button
                onClick={() => setActiveTab('habitaciones')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'habitaciones'
                    ? 'bg-white border border-slate-200 text-win-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Habitaciones
              </button>
              <button
                onClick={() => setActiveTab('dispositivos')}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'dispositivos'
                    ? 'bg-white border border-slate-200 text-win-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Dispositivos
              </button>
            </div>

            {/* Rooms Grid */}
            {activeTab === 'habitaciones' ? (
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                {[
                  { emoji: '🛋️', name: 'Sala' },
                  { emoji: '🍳', name: 'Cocina' },
                  { emoji: '🛏️', name: 'Dormitorio' },
                  { emoji: '🚿', name: 'Baño' },
                  { emoji: '💻', name: 'Estudio' },
                  { emoji: '🪑', name: 'Comedor' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col items-center hover:border-win-500 cursor-grab shadow-sm transition hover:shadow-md"
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col items-center cursor-grab hover:border-win-500 shadow-sm transition hover:shadow-md">
                  <span className="text-xl text-win-500 font-bold mb-1">📶</span>
                  <span>Router</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col items-center cursor-grab hover:border-win-500 shadow-sm transition hover:shadow-md">
                  <span className="text-xl text-slate-800 font-bold mb-1">📱</span>
                  <span>Repetidor</span>
                </div>
              </div>
            )}

            {activeTab === 'habitaciones' && (
              <>
                <h4 className="font-bold text-slate-800 text-xs mt-5 mb-3">Dispositivos</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center cursor-grab hover:border-win-500 shadow-sm transition">
                    <span className="text-lg text-win-500 font-bold mb-1">📶</span>
                    <span>Router</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center cursor-grab hover:border-win-500 shadow-sm transition">
                    <span className="text-lg text-slate-800 font-bold mb-1">📱</span>
                    <span>Repetidor</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-3')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-5')}
        >
          <span>Continuar con diseño</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
