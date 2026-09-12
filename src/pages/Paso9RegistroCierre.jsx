import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso9RegistroCierre() {
  const navigate = useNavigate();
  const { selectedFloors, houseWidth, houseLength } = useSimulator();

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-9">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            9
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Registro de datos y cierre</h1>
        </div>

        {/* Success Checkmark Banner */}
        <div className="text-center my-6">
          <div className="w-20 h-20 bg-win-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-win-500/30">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">¡Listo!</h2>
          <p className="text-slate-600 text-base max-w-md mx-auto mt-2">
            Tu configuración personalizada ha sido guardada exitosamente.
          </p>
        </div>

        {/* Summary Breakdown & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
          {/* Left: Home Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Resumen de tu hogar
            </h3>
            <div className="space-y-3 text-sm font-semibold text-slate-600">
              <div className="flex justify-between py-2 border-b border-slate-200/80">
                <span className="text-slate-500">Pisos:</span>
                <span className="text-slate-900 font-bold">{selectedFloors}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/80">
                <span className="text-slate-500">Medidas:</span>
                <span className="text-slate-900 font-bold">
                  {houseWidth} m × {houseLength} m ({houseWidth * houseLength} m²)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/80">
                <span className="text-slate-500">Zonas con baja señal:</span>
                <span className="text-win-600 font-bold">Dormitorio 2 (2° piso)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Kit sugerido:</span>
                <span className="text-win-600 font-bold">Kit Familia WIN (Wi-Fi 6)</span>
              </div>
            </div>
          </div>

          {/* Right: What's Next Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between shadow-md">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                ¿Qué sigue?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Un asesor especializado de WIN se pondrá en contacto contigo para validar la cobertura de fibra óptica en tu zona y coordinar la visita de instalación sin costo adicional.
              </p>
            </div>
            <div className="mt-6">
              <button
                className="w-full py-4 bg-win-500 hover:bg-win-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-win-500/25 transition cursor-pointer"
                onClick={() => navigate('/')}
              >
                Volver a la página Principal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/paso-8')}
        >
          Atrás
        </button>
      </div>
    </article>
  );
}
