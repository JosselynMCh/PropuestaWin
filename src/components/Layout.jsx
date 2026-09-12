import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map route to step number for quick jump selector and sidebar state
  const getStepFromPath = (pathname) => {
    switch (pathname) {
      case '/':
      case '/principal':
        return 1;
      case '/paso-2':
        return 2;
      case '/paso-3':
        return 3;
      case '/paso-4':
        return 4;
      case '/paso-5':
        return 5;
      case '/paso-6':
        return 6;
      case '/paso-7':
        return 7;
      case '/paso-8':
        return 8;
      case '/paso-9':
        return 9;
      default:
        return 1;
    }
  };

  const currentStep = getStepFromPath(location.pathname);

  const navigateToStep = (step) => {
    if (step === 1) navigate('/');
    else navigate(`/paso-${step}`);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#EEF1F5] text-slate-800 overflow-hidden select-none">
      {/* Top Header */}
      <header className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between border-b border-slate-800 gap-3 flex-shrink-0 z-30">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-black tracking-tighter text-win-500">
            win
            <span className="text-white text-xs font-semibold px-2 py-0.5 ml-2 bg-win-600 rounded-full">
              Simulador Wi-Fi
            </span>
          </span>
        </div>

        {/* Quick Step Jump Selector */}
        <div className="flex items-center space-x-2 text-xs font-medium overflow-x-auto py-1">
          <span className="text-slate-400 mr-1 text-[11px] uppercase tracking-wider hidden sm:inline">
            Paso Rápido:
          </span>
          <div className="flex space-x-1.5" id="step-jump-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`step-nav-pill px-3 py-1 rounded transition cursor-pointer font-bold ${
                  currentStep === num
                    ? 'bg-win-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                onClick={() => navigateToStep(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Full-Screen Layout: Sidebar + Dynamic Page Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Base Sidebar that stays consistent across all pages */}
        <Sidebar currentStep={currentStep} />

        {/* Scrollable / Flexible Page Viewport */}
        <main className="flex-1 bg-white flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            <Outlet />
          </div>

          {/* Footer Bar */}
          <footer className="bg-slate-50 px-8 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 flex-shrink-0">
            <span>© 2026 WIN Conectividad Residencial. Todos los derechos reservados.</span>
            <span className="font-semibold text-win-600">100% Fibra Óptica Simétrica</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
