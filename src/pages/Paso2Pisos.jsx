import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso2Pisos() {
  const navigate = useNavigate();
  const { selectedFloors, setSelectedFloors } = useSimulator();

  const floorOptions = [
    {
      val: '1',
      label: '1 piso',
      description: 'Casas de un nivel o departamentos',
      recommendation: '1 Router WIN cubre todo',
      icon: (
        <svg className="w-16 h-16 text-[#ff5500]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <path d="M12 30L32 14L52 30" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 22V16H47V26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 28V50H48V28" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 50V38H37V50" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      val: '2',
      label: '2 pisos',
      description: 'Viviendas familiares estándar',
      recommendation: 'Recomendado MESH para piso 2',
      badge: 'Más común',
      icon: (
        <svg className="w-16 h-16 text-[#ff5500]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <path d="M12 30L32 14L52 30" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 22V16H47V26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 28V50H48V28" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 50V38H37V50" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="36" x2="48" y2="36" strokeWidth="2" strokeDasharray="2 2" />
          <rect x="20" y="27" width="8" height="6" strokeWidth="2" rx="1" />
          <rect x="36" y="27" width="8" height="6" strokeWidth="2" rx="1" />
        </svg>
      ),
    },
    {
      val: '3',
      label: '3 pisos',
      description: 'Hogares amplios de varios niveles',
      recommendation: 'Cobertura vertical con 2 MESH',
      icon: (
        <svg className="w-16 h-16 text-[#ff5500]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <path d="M12 28L32 12L52 28" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 20V14H47V24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 26V52H48V26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 52V42H36V52" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="20" y="34" width="7" height="6" strokeWidth="2" rx="1" />
          <rect x="37" y="34" width="7" height="6" strokeWidth="2" rx="1" />
          <rect x="20" y="23" width="7" height="6" strokeWidth="2" rx="1" />
          <rect x="37" y="23" width="7" height="6" strokeWidth="2" rx="1" />
        </svg>
      ),
    },
    {
      val: '4+',
      label: 'Más de 3',
      description: 'Edificios residenciales o multifamiliar',
      recommendation: 'Solución Mesh integral WIN',
      icon: (
        <svg className="w-16 h-16 text-[#ff5500]" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <path d="M12 28L32 12L52 28" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 20V14H47V24" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 26V52H48V26" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 52V42H36V52" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="19" y="34" width="6" height="5" strokeWidth="1.8" rx="1" />
          <rect x="29" y="34" width="6" height="5" strokeWidth="1.8" rx="1" />
          <rect x="39" y="34" width="6" height="5" strokeWidth="1.8" rx="1" />
          <rect x="19" y="24" width="6" height="5" strokeWidth="1.8" rx="1" />
          <rect x="29" y="24" width="6" height="5" strokeWidth="1.8" rx="1" />
          <rect x="39" y="24" width="6" height="5" strokeWidth="1.8" rx="1" />
        </svg>
      ),
    },
  ];

  const currentSelection = floorOptions.find((f) => f.val === selectedFloors) || floorOptions[1];

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-2">
      <div>
        {/* Step Indicator Header matching WIN design system */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            2
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Selecciona la cantidad de pisos
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                ¿Cuántos pisos tiene tu hogar?
              </h2>
              <p className="text-slate-400 font-medium text-sm sm:text-base mt-1">
                Selecciona el número de pisos de tu vivienda para simular la señal vertical.
              </p>
            </div>
            {currentSelection?.badge && (
              <span className="self-start sm:self-center px-3 py-1 bg-[#FFF8F5] text-[#ff5500] text-xs font-bold rounded-full border border-[#ff5500]/20">
                ⭐ {currentSelection.badge}
              </span>
            )}
          </div>

          {/* Grid of 4 Floor Cards with Friendly Micro-interactions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {floorOptions.map((card) => {
              const isChecked = selectedFloors === card.val;
              return (
                <button
                  key={card.val}
                  type="button"
                  onClick={() => setSelectedFloors(card.val)}
                  className={`group relative cursor-pointer rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-between transition-all duration-200 text-center ${
                    isChecked
                      ? 'border-2 border-[#ff5500] bg-[#FFF8F5] shadow-md shadow-[#ff5500]/15 scale-[1.03]'
                      : 'border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 hover:shadow-sm'
                  }`}
                >
                  {/* Selected check pill */}
                  {isChecked && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#ff5500] text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}

                  {/* House Illustration */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center my-2 transition-transform duration-200 group-hover:scale-105">
                    {card.icon}
                  </div>

                  <div>
                    <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight block">
                      {card.label}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium block mt-1 line-clamp-2">
                      {card.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Friendly Contextual Tip */}
          <div className="mt-8 bg-[#FFF8F5] border border-[#ff5500]/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#ff5500] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
                💡
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900">Configuración recomendada para {currentSelection.label}: </span>
                <span>{currentSelection.recommendation}</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#ff5500] bg-white px-3 py-1 rounded-full border border-[#ff5500]/20">
              Fibra simétrica WIN
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-8 pb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={() => navigate('/paso-3')}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-base group"
        >
          <span>Siguiente</span>
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}

