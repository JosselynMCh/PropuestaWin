import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso5DisenoRouter() {
  const navigate = useNavigate();
  const { houseWidth, houseLength, currentFloorView, setCurrentFloorView } = useSimulator();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-5">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            5
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Diseña tu casa y coloca el router</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          {/* Architectural Layout with router */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 mb-2">{houseLength} m</span>
            <div className="w-full flex items-center">
              <span className="text-xs font-bold text-slate-500 -rotate-90 -mr-3">{houseWidth} m</span>
              <div className="flex-1 h-80 sm:h-96 rounded-3xl bg-stone-100 border-4 border-slate-700 relative overflow-hidden p-3 shadow-inner">
                {/* Rooms Grid */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-3 text-xs font-bold text-slate-600">
                  {/* Cocina */}
                  <div className="bg-amber-50/80 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col justify-between">
                    <span>Cocina</span>
                    <div className="w-10 h-5 border border-slate-400 bg-white/70 self-end rounded"></div>
                  </div>
                  {/* Comedor */}
                  <div className="bg-stone-50 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col justify-between items-center">
                    <span>Comedor</span>
                    <div className="w-14 h-7 border border-slate-400 bg-amber-100/70 rounded"></div>
                  </div>
                  {/* Dormitorio 1 */}
                  <div className="bg-blue-50/70 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col justify-between">
                    <span>Dormitorio 1</span>
                    <div className="w-9 h-12 border border-slate-400 bg-white rounded self-end"></div>
                  </div>
                  {/* Sala */}
                  <div className="bg-amber-50/80 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col justify-between">
                    <span>Sala</span>
                    <div className="w-12 h-10 border border-slate-400 bg-stone-200 rounded"></div>
                  </div>
                  {/* Hall Central con Router */}
                  <div className="bg-orange-50/60 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full bg-win-500/10 border border-win-500/30 animate-pulse"></div>
                    <div className="absolute w-18 h-18 rounded-full bg-win-500/20"></div>
                    {/* Draggable Router Node */}
                    <div className="z-10 bg-slate-900 text-white px-3 py-2 rounded-2xl shadow-xl flex flex-col items-center cursor-move hover:scale-105 transition">
                      <svg className="w-7 h-7 text-win-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span className="text-[11px] font-bold mt-1 text-white bg-win-600 px-2 py-0.5 rounded">Router</span>
                    </div>
                  </div>
                  {/* Dormitorio 2 */}
                  <div className="bg-blue-50/70 border-2 border-slate-400 rounded-xl p-3 relative flex flex-col justify-between">
                    <span>Dormitorio 2</span>
                    <div className="w-10 h-10 border border-slate-400 bg-white rounded self-end"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Coverage Legend */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Piso actual
              </label>
              <select
                value={currentFloorView}
                onChange={(e) => setCurrentFloorView(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-win-500 focus:border-win-500 outline-none"
              >
                <option>Primer piso</option>
                <option>Segundo piso</option>
              </select>
            </div>

            {/* Signal Legend */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-3">Cobertura de internet</span>
              <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                  <span>Excelente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400"></span>
                  <span>Buena</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-orange-400"></span>
                  <span>Regular</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
                  <span>Sin señal</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 border-2 border-dashed border-win-500 hover:border-win-600 text-win-600 font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 hover:bg-win-50 transition cursor-pointer"
              onClick={() => navigate('/paso-7')}
            >
              <span className="text-lg leading-none">+</span>
              <span>Agregar repetidor</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-4')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-6')}
        >
          <span>Simular Cobertura</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
