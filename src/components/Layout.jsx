import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useSimulator } from '../context/SimulatorContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { maxUnlockedStep, unlockUpTo } = useSimulator();

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

  // When visiting a valid step, unlock up to this step
  useEffect(() => {
    if (currentStep > maxUnlockedStep) {
      // If user directly typed URL of a future step they haven't unlocked yet, redirect to their max unlocked step
      const targetPath = maxUnlockedStep === 1 ? '/' : `/paso-${maxUnlockedStep}`;
      navigate(targetPath, { replace: true });
    } else {
      unlockUpTo(currentStep);
    }
  }, [currentStep, maxUnlockedStep, navigate, unlockUpTo]);

  const navigateToStep = (step) => {
    if (step === 1) navigate('/');
    else navigate(`/paso-${step}`);
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white text-slate-800 overflow-hidden select-none">
      {/* Base Sidebar that stays consistent across all pages */}
      <Sidebar currentStep={currentStep} />

      {/* Scrollable / Flexible Page Viewport */}
      <main className="flex-1 bg-white flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <Outlet />
          </div>

          {/* Footer Bar */}
          <footer className="bg-slate-50 px-8 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 flex-shrink-0">
            <span>© 2026 WIN Conectividad Residencial. Todos los derechos reservados.</span>
            <span className="font-semibold text-win-600">100% Fibra Óptica Simétrica</span>
          </footer>
        </main>
    </div>
  );
}
