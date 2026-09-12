import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Paso8Diagnostico() {
  const navigate = useNavigate();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-8">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            8
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Diagnóstico y recomendación</h1>
        </div>

        {/* Problem identification banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center space-x-4 mb-6 max-w-3xl">
          <div className="w-10 h-10 rounded-2xl bg-win-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">
            ⚠️
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">Zona con baja señal detectada</h4>
            <p className="text-sm text-slate-600 mt-0.5">
              El dormitorio 2 (2° piso) presenta pérdida de paquetes para streaming en 4K y videollamadas fluidas.
            </p>
          </div>
        </div>

        {/* Recommendation Card and Hardware Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-lg">
            <span className="text-xs font-extrabold uppercase tracking-wider text-win-600">
              Te recomendamos
            </span>
            <div className="flex items-center space-x-4 my-4">
              <div className="p-3.5 bg-win-50 text-win-600 rounded-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Kit Familia WIN</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  (2 repetidores Mesh con tecnología Wi-Fi 6 de última generación)
                </p>
              </div>
            </div>

            {/* Feature bullet checklist */}
            <ul className="space-y-3 text-sm font-semibold text-slate-600 my-5">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-win-500"></span>
                <span>Mejora la cobertura en toda tu casa al 100%</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-win-500"></span>
                <span>Conexión roaming sin interrupciones al cambiar de piso o habitación</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-win-500"></span>
                <span>Instalación y optimización profesional incluida sin costo extra</span>
              </li>
            </ul>

            {/* Pricing and CTA */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Inversión única</span>
                <span className="text-3xl font-extrabold text-win-600">S/ 149</span>
              </div>
              <button
                className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-bold rounded-full shadow-lg shadow-win-500/30 transition flex items-center space-x-2.5 cursor-pointer text-base"
                onClick={() => navigate('/paso-9')}
              >
                <span>Quiero este kit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hardware Graphic Illustration */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-orange-50/50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              {/* Mesh Device 1 */}
              <div className="w-24 h-32 bg-white rounded-3xl shadow-md border border-slate-200 flex flex-col items-center justify-between p-3">
                <span className="text-[10px] font-black text-win-600">win</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                <span className="text-[10px] font-bold text-slate-400">Mesh 1</span>
              </div>
              {/* Mesh Device 2 */}
              <div className="w-24 h-32 bg-white rounded-3xl shadow-md border border-slate-200 flex flex-col items-center justify-between p-3">
                <span className="text-[10px] font-black text-win-600">win</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
                <span className="text-[10px] font-bold text-slate-400">Mesh 2</span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700">Cobertura inteligente 100% garantizada</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-7')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-9')}
        >
          <span>Continuar a registro</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
