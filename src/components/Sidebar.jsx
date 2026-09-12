import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

const NAV_ITEMS = [
  {
    step: 1,
    id: 'inicio',
    label: '1. Inicio',
    path: '/',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 011-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    step: 2,
    id: 'pisos',
    label: '2. Pisos',
    path: '/paso-2',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    step: 3,
    id: 'medidas',
    label: '3. Medidas',
    path: '/paso-3',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    step: 4,
    id: 'plano',
    label: '4. Habitaciones',
    path: '/paso-4',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M12 4v16" />
      </svg>
    ),
  },
  {
    step: 5,
    id: 'paredes-router',
    label: '5. Paredes y Router',
    path: '/paso-5',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16" />
      </svg>
    ),
  },
  {
    step: 6,
    id: 'cobertura',
    label: '6. Cobertura Wi-Fi',
    path: '/paso-6',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    step: 7,
    id: 'ajustes-mesh',
    label: '7. Ajustes y Mesh',
    path: '/paso-7',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    step: 8,
    id: 'diagnostico',
    label: '8. Diagnóstico',
    path: '/paso-8',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    step: 9,
    id: 'propuesta',
    label: '9. Propuesta Final',
    path: '/paso-9',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentStep = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { maxUnlockedStep } = useSimulator();

  const isItemActive = (item) => {
    if (currentStep) {
      return item.step === currentStep;
    }
    return location.pathname === item.path;
  };

  return (
    <aside
      className="w-full md:w-60 lg:w-64 bg-[#ff5500] text-white flex-shrink-0 flex flex-col justify-between p-4 md:p-5 select-none shadow-xl z-20 overflow-y-auto"
      data-purpose="vertical-navigation-sidebar"
    >
      <div>
        {/* WIN Brandmark matching screenshot */}
        <div
          className="mb-5 pt-1 cursor-pointer flex items-center justify-between group"
          onClick={() => navigate('/')}
        >
          <img
            src="/img/logowin_Anaranjado_Sin_Fondo.png"
            alt="WIN"
            className="h-9 md:h-10 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform"
          />
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded-full text-white/95">
            Simulador
          </span>
        </div>

        {/* Step Navigation for Every Step */}
        <nav className="space-y-1.5 font-medium text-xs">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            const isUnlocked = item.step <= maxUnlockedStep;

            return (
              <button
                key={item.id}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) navigate(item.path);
                }}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                  !isUnlocked
                    ? 'opacity-40 cursor-not-allowed bg-black/5 text-white/60'
                    : active
                    ? 'bg-white text-[#ff5500] font-bold shadow-md shadow-black/10 translate-x-1 cursor-pointer'
                    : 'text-white/90 hover:text-white hover:bg-white/10 cursor-pointer'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      active
                        ? 'bg-[#ff5500] text-white'
                        : isUnlocked
                        ? 'bg-white/20 text-white'
                        : 'bg-black/15 text-white/60'
                    }`}
                  >
                    {item.step}
                  </span>
                  <span className="text-[13px] tracking-tight truncate font-semibold">
                    {item.label.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>

                {!isUnlocked && (
                  <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 pt-3 border-t border-white/20 text-[11px] text-white/85 flex items-center justify-between">
        <span className="font-semibold">Fibra 100% Simétrica</span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span className="text-[10px] text-emerald-200 font-bold">ONLINE</span>
        </span>
      </div>
    </aside>
  );
}
