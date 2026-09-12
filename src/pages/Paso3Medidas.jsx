import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso3Medidas() {
  const navigate = useNavigate();
  const { houseWidth, setHouseWidth, houseLength, setHouseLength } = useSimulator();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-3">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Ingresa las medidas de tu hogar</h1>
        </div>

        <div className="mt-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Ingresa las medidas de tu hogar</h2>
          <p className="text-slate-500 text-base mt-2">Indica el ancho y largo total de tu vivienda (en metros).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ancho (m)
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-win-500 focus:border-win-500 font-bold text-xl outline-none"
              id="input-ancho"
              type="number"
              min="1"
              max="100"
              value={houseWidth}
              onChange={(e) => setHouseWidth(Number(e.target.value))}
            />
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Largo (m)
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-win-500 focus:border-win-500 font-bold text-xl outline-none"
              id="input-largo"
              type="number"
              min="1"
              max="100"
              value={houseLength}
              onChange={(e) => setHouseLength(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Calculated Area Preview Card */}
        <div className="mt-6 max-w-xl flex items-center justify-between p-4 bg-win-50 rounded-2xl border border-win-100">
          <span className="text-sm font-semibold text-slate-700">Área total estimada:</span>
          <span className="text-xl font-extrabold text-win-600">{houseWidth * houseLength} m²</span>
        </div>

        {/* Informative Note */}
        <div className="mt-6 max-w-xl bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start space-x-3 text-sm text-slate-700">
          <div className="w-6 h-6 rounded-full bg-win-500 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
            i
          </div>
          <p>Con estas medidas generaremos el plano de tu casa para que puedas personalizarlo en los siguientes pasos.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-2')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-4')}
        >
          <span>Siguiente</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
