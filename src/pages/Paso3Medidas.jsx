
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

const PRESETS = [
  { label: 'Departamento (7 x 10 m)', w: 7, l: 10 },
  { label: 'Casa típica (8 x 15 m)', w: 8, l: 15 },
  { label: 'Casa amplia (10 x 20 m)', w: 10, l: 20 },
];

export default function Paso3Medidas() {
  const navigate = useNavigate();
  const { houseWidth, setHouseWidth, houseLength, setHouseLength } = useSimulator();

  // Local state for string inputs to allow fluid typing and validation feedback
  const [widthInput, setWidthInput] = useState(String(houseWidth || 10));
  const [lengthInput, setLengthInput] = useState(String(houseLength || 15));
  const [touched, setTouched] = useState(false);

  const numWidth = parseFloat(widthInput);
  const numLength = parseFloat(lengthInput);

  // Validations: must be present, positive, and within realistic limits (e.g. 2m to 50m)
  const isWidthValid = !isNaN(numWidth) && numWidth >= 2 && numWidth <= 60;
  const isLengthValid = !isNaN(numLength) && numLength >= 2 && numLength <= 60;
  const isValid = isWidthValid && isLengthValid;

  const totalArea = isValid ? (numWidth * numLength).toFixed(1).replace('.0', '') : '--';

  const handleNext = () => {
    setTouched(true);
    if (!isValid) return;
    setHouseWidth(numWidth);
    setHouseLength(numLength);
    navigate('/paso-4');
  };

  const applyPreset = (w, l) => {
    setWidthInput(String(w));
    setLengthInput(String(l));
    setHouseWidth(w);
    setHouseLength(l);
  };

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-3">
      <div>
        {/* Step Indicator Header matching WIN design system */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ingresa las medidas de tu hogar
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dimensiones de la vivienda
          </h2>
          <p className="text-slate-400 font-medium text-sm sm:text-base mt-1 mb-8">
            Indica el ancho y largo total de tu vivienda en metros para calcular el plano y la cobertura.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Inputs & Validation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input Ancho */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    touched && !isWidthValid
                      ? 'border-rose-400 bg-rose-50/50'
                      : isWidthValid
                      ? 'border-slate-200 focus-within:border-[#ff5500] bg-slate-50/50 focus-within:bg-[#FFF8F5]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="input-ancho" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Ancho (m)
                    </label>
                    <span className="text-xs font-semibold text-[#ff5500]">Frontis</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="input-ancho"
                      type="number"
                      step="0.5"
                      min="2"
                      max="60"
                      placeholder="Ej. 8"
                      value={widthInput}
                      onChange={(e) => {
                        setWidthInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) setHouseWidth(val);
                      }}
                      className="w-full bg-transparent font-extrabold text-2xl text-slate-900 outline-none pr-8"
                    />
                    <span className="text-slate-400 font-bold text-base select-none">m</span>
                  </div>
                  {touched && !isWidthValid && (
                    <p className="text-xs text-rose-500 font-semibold mt-2">
                      Ingresa un valor válido entre 2 y 60 metros.
                    </p>
                  )}
                </div>

                {/* Input Largo */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    touched && !isLengthValid
                      ? 'border-rose-400 bg-rose-50/50'
                      : isLengthValid
                      ? 'border-slate-200 focus-within:border-[#ff5500] bg-slate-50/50 focus-within:bg-[#FFF8F5]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="input-largo" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Largo (m)
                    </label>
                    <span className="text-xs font-semibold text-[#ff5500]">Fondo</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="input-largo"
                      type="number"
                      step="0.5"
                      min="2"
                      max="60"
                      placeholder="Ej. 15"
                      value={lengthInput}
                      onChange={(e) => {
                        setLengthInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) setHouseLength(val);
                      }}
                      className="w-full bg-transparent font-extrabold text-2xl text-slate-900 outline-none pr-8"
                    />
                    <span className="text-slate-400 font-bold text-base select-none">m</span>
                  </div>
                  {touched && !isLengthValid && (
                    <p className="text-xs text-rose-500 font-semibold mt-2">
                      Ingresa un valor válido entre 2 y 60 metros.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Presets for Ease of Use */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Medidas sugeridas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p.w, p.l)}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#FFF8F5] hover:border-[#ff5500] hover:text-[#ff5500] text-slate-600 transition cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative Note */}
              <div className="bg-[#FFF8F5] border border-[#ff5500]/20 rounded-2xl p-4 flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#ff5500] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">
                  i
                </div>
                <p>
                  Con estas medidas crearemos la maqueta a escala en el plano para calcular la propagación de la señal de fibra WIN.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Scale Visualizer & Area Badge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Vista previa a escala
              </span>

              {/* Dynamic Aspect Ratio Box */}
              <div className="w-full h-44 flex items-center justify-center relative p-2">
                <div
                  className="rounded-xl border-2 border-dashed border-[#ff5500] bg-white shadow-sm flex flex-col items-center justify-center p-3 transition-all duration-300 relative overflow-hidden"
                  style={{
                    width: isValid
                      ? `${Math.min(100, Math.max(38, (numWidth / (numWidth + numLength)) * 170))}%`
                      : '55%',
                    height: isValid
                      ? `${Math.min(100, Math.max(38, (numLength / (numWidth + numLength)) * 170))}%`
                      : '65%',
                  }}
                >
                  <span className="text-xs font-bold text-[#ff5500]">{isValid ? `${numWidth}m` : '--'}</span>
                  <div className="my-auto flex items-center justify-center text-slate-400">
                    <svg className="w-7 h-7 text-[#ff5500]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{isValid ? `${numLength}m` : '--'}</span>
                </div>
              </div>

              {/* Area Total Summary */}
              <div className="w-full mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Área total estimada:</span>
                <span className="text-xl font-extrabold text-[#ff5500]">{totalArea} m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pb-4">
        <button
          type="button"
          onClick={() => navigate('/paso-2')}
          className="px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center space-x-2 px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-base group"
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

