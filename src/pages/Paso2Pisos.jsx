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
      icon: (
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      val: '2',
      label: '2 pisos',
      icon: (
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      val: '3',
      label: '3 pisos',
      icon: (
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      ),
    },
    {
      val: '4+',
      label: 'Más de 3',
      icon: <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />,
    },
  ];

  return (
    <article className="step-view flex-1 flex flex-col justify-between" id="step-view-2">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-win-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            2
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Selecciona la cantidad de pisos</h1>
        </div>

        <div className="mt-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">¿Cuántos pisos tiene tu hogar?</h2>
          <p className="text-slate-500 text-base mt-2">
            Selecciona el número de pisos de tu vivienda para calcular la distribución de la señal.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
          {floorOptions.map((card) => {
            const isChecked = selectedFloors === card.val;
            return (
              <div
                key={card.val}
                onClick={() => setSelectedFloors(card.val)}
                className={`cursor-pointer group border-2 rounded-2xl p-6 flex flex-col items-center justify-center transition text-center shadow-sm ${
                  isChecked
                    ? 'border-win-500 bg-win-50 shadow-md ring-2 ring-win-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`w-16 h-16 mb-4 flex items-center justify-center transition ${
                    isChecked ? 'text-win-500 scale-105' : 'text-slate-500 group-hover:text-win-500'
                  }`}
                >
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    {card.icon}
                  </svg>
                </div>
                <span className="font-bold text-slate-800 text-base">{card.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
        <button
          className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-full transition cursor-pointer"
          onClick={() => navigate('/')}
        >
          Atrás
        </button>
        <button
          className="px-8 py-3.5 bg-win-500 hover:bg-win-600 text-white font-semibold rounded-full shadow-md transition flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/paso-3')}
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
