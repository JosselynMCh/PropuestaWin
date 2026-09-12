import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    id: 'inicio',
    label: 'Inicio',
    path: '/',
    activeSteps: [1],
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 011-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    id: 'pisos',
    label: 'Pisos',
    path: '/paso-2',
    activeSteps: [2],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'medidas',
    label: 'Medidas',
    path: '/paso-3',
    activeSteps: [3],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    id: 'diseno',
    label: 'Diseño',
    path: '/paso-4',
    activeSteps: [4, 5],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'cobertura',
    label: 'Cobertura',
    path: '/paso-6',
    activeSteps: [6, 7],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    id: 'resultado',
    label: 'Resultado',
    path: '/paso-8',
    activeSteps: [8, 9],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentStep = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isItemActive = (item) => {
    if (currentStep) {
      return item.activeSteps.includes(currentStep);
    }
    return location.pathname === item.path;
  };

  return (
    <aside
      className="w-full md:w-56 lg:w-60 bg-[#ff5500] text-white flex-shrink-0 flex flex-col justify-between p-5 md:p-6 select-none shadow-xl z-20"
      data-purpose="vertical-navigation-sidebar"
    >
      <div>
        {/* WIN Brandmark matching screenshot */}
        <div className="mb-8 md:mb-10 pt-1 cursor-pointer flex items-center" onClick={() => navigate('/')}>
          <img
            src="/img/logowin_Anaranjado_Sin_Fondo.png"
            alt="WIN"
            className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Flow Step Indicators */}
        <nav className="space-y-3 font-medium text-sm">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-[#ff5500] font-bold shadow-md shadow-black/10 translate-x-0.5'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </span>
                <span className="text-[14px] tracking-wide font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-white/20 text-xs text-white/80 flex items-center justify-between">
        <span>Fibra 100% simétrica</span>
        <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
      </div>
    </aside>
  );
}
