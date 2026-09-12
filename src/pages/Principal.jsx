import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Principal() {
  const navigate = useNavigate();
  const { unlockUpTo } = useSimulator();

  const handleStart = () => {
    unlockUpTo(2);
    navigate('/paso-2');
  };

  return (
    <article className="step-view flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-4 md:py-6" id="step-view-1">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center flex-1 my-auto">
        {/* Left Column: Headline, Description & CTA */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6 z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Conecta tu hogar <br />
            con la mejor{' '}
            <span className="text-[#ff5500]">cobertura de internet</span>
          </h2>

          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-md leading-relaxed">
            Diseña tu casa, coloca tus dispositivos y descubre hasta dónde llega la señal de WIN.
          </p>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center space-x-2.5 px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-base group"
            >
              <span>Comenzar</span>
              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: House with warm halo and Wi-Fi signal icon */}
        <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[540px] xl:max-w-[620px] flex items-center justify-center">
            {/* Warm circular gradient aura behind house */}
            <div
              className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full -top-6 -right-6 md:right-4 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,140,40,0.18) 0%, rgba(255,220,190,0.12) 50%, rgba(255,255,255,0) 72%)',
              }}
            />

            {/* Glowing Wi-Fi Beacon Icon at the top */}
            <div className="absolute top-0 right-14 sm:right-24 md:right-28 lg:right-32 z-20 pointer-events-none drop-shadow-md">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#ff5500]" viewBox="0 0 24 24" fill="currentColor">
                {/* Dot */}
                <circle cx="12" cy="19" r="1.6" />
                {/* Lower arc */}
                <path
                  d="M8.2 15.2a5.4 5.4 0 0 1 7.6 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Middle arc */}
                <path
                  d="M5 12a9.9 9.9 0 0 1 14 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Outer arc */}
                <path
                  d="M1.8 8.8a14.4 14.4 0 0 1 20.4 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* House Image (public/img/casa_inicio.png) */}
            <div className="relative z-10 w-full pt-8 sm:pt-10 flex justify-center">
              <img
                src="/img/casa_inicio.png"
                alt="Casa moderna WIN"
                className="w-full h-auto object-contain max-h-[380px] sm:max-h-[440px] xl:max-h-[480px] filter drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

