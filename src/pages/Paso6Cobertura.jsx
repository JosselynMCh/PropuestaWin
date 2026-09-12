import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

export default function Paso6Cobertura() {
  const navigate = useNavigate();
  const {
    houseWidth,
    houseLength,
    selectedFloors,
    currentFloorView,
    setCurrentFloorView,
    getAvailableFloors,
    placedElements,
    placedWalls,
  } = useSimulator();

  // Proportional canvas sizing matching step 4 & 5
  const widthM = houseWidth && houseWidth > 0 ? houseWidth : 10;
  const lengthM = houseLength && houseLength > 0 ? houseLength : 15;

  const maxCanvasW = 580;
  const maxCanvasH = 410;
  const aspectRatio = widthM / lengthM;

  let canvasW = maxCanvasW;
  let canvasH = maxCanvasW / aspectRatio;
  if (canvasH > maxCanvasH) {
    canvasH = maxCanvasH;
    canvasW = maxCanvasH * aspectRatio;
  }

  // Find placed router and repeater
  const router = placedElements.find((el) => el.itemId === 'router');
  const routerX = router ? router.x + router.w / 2 : canvasW / 2;
  const routerY = router ? router.y + router.h / 2 : canvasH / 2;

  const repeater = placedElements.find((el) => el.itemId === 'mesh-repeater');
  const repeaterX = repeater ? repeater.x + repeater.w / 2 : null;
  const repeaterY = repeater ? repeater.y + repeater.h / 2 : null;

  // Filter room elements
  const rooms = placedElements.filter((el) => el.type === 'room');

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-6">
      <div>
        <div className="flex items-center space-x-3 mb-5">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            6
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Visualiza la cobertura de internet
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Mapa de calor Wi-Fi en tu hogar
              </h2>
              <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                Simulación en tiempo real de la propagación de la señal de fibra según tus paredes y ubicación del router.
              </p>
            </div>

            {selectedFloors !== '1' && (
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl">
                {getAvailableFloors().map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setCurrentFloorView(floor)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                      currentFloorView === floor
                        ? 'bg-white text-[#ff5500] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Custom Blueprint & Wi-Fi Heatmap */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium mb-2 px-1">
                <span>Plano calculado: <b>{widthM}m × {lengthM}m</b> ({widthM * lengthM} m²)</span>
                <span className="text-[#ff5500] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
                  Señal activa 100% Fibra Óptica
                </span>
              </div>

              <div className="w-full flex items-center justify-center p-3 sm:p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-auto">
                <div
                  style={{ width: `${canvasW}px`, height: `${canvasH}px` }}
                  className="relative rounded-2xl border-2 border-slate-300 bg-white shadow-md overflow-hidden flex-shrink-0 select-none"
                >
                  {/* Heatmap radial gradient centered on Router */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle 380px at ${routerX}px ${routerY}px, 
                        rgba(34, 197, 94, 0.42) 0%, 
                        rgba(34, 197, 94, 0.28) 35%, 
                        rgba(234, 179, 8, 0.24) 60%, 
                        rgba(239, 68, 68, 0.28) 85%, 
                        rgba(148, 163, 184, 0.35) 100%)`,
                    }}
                  />

                  {/* Additional Heatmap radial gradient centered on Repeater (if placed) */}
                  {repeater && repeaterX !== null && (
                    <div
                      className="absolute inset-0 pointer-events-none z-12 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle 350px at ${repeaterX}px ${repeaterY}px, 
                          rgba(16, 185, 129, 0.48) 0%, 
                          rgba(16, 185, 129, 0.32) 40%, 
                          rgba(234, 179, 8, 0.18) 75%, 
                          transparent 100%)`,
                      }}
                    />
                  )}

                  {/* Signal Pulse Rings at Router coordinates */}
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${routerX}px`, top: `${routerY}px` }}
                  >
                    <div className="w-24 h-24 rounded-full border-2 border-emerald-500/60 animate-ping" />
                  </div>
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${routerX}px`, top: `${routerY}px` }}
                  >
                    <div className="w-48 h-48 rounded-full border border-emerald-400/40" />
                  </div>
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${routerX}px`, top: `${routerY}px` }}
                  >
                    <div className="w-72 h-72 rounded-full border border-amber-400/30" />
                  </div>

                  {/* Signal Pulse Rings at Repeater coordinates */}
                  {repeater && repeaterX !== null && (
                    <div
                      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ left: `${repeaterX}px`, top: `${repeaterY}px` }}
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-emerald-400/70 animate-ping" />
                      <div className="w-40 h-40 rounded-full border border-emerald-400/50" />
                    </div>
                  )}

                  {/* User Placed Rooms */}
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      style={{
                        left: `${room.x}px`,
                        top: `${room.y}px`,
                        width: `${room.w}px`,
                        height: `${room.h}px`,
                      }}
                      className={`absolute rounded-xl border border-dashed ${room.border} ${room.bg} flex flex-col justify-between p-2 shadow-xs`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-base">{room.emoji}</span>
                        <span className="font-bold text-[11px] text-slate-800 truncate">{room.name}</span>
                      </div>
                    </div>
                  ))}

                  {/* User Placed Walls */}
                  {placedWalls.map((wall) => {
                    const isConcrete = wall.material === 'concreto';
                    const isDrywall = wall.material === 'drywall';
                    const wallColor = isConcrete
                      ? 'bg-slate-800'
                      : isDrywall
                      ? 'bg-amber-700'
                      : 'bg-cyan-500/80';

                    return (
                      <div
                        key={wall.id}
                        style={{
                          left: `${wall.x}px`,
                          top: `${wall.y}px`,
                          width: `${wall.w}px`,
                          height: `${wall.h}px`,
                        }}
                        className={`absolute rounded-sm ${wallColor} shadow-md z-20 pointer-events-none`}
                      />
                    );
                  })}

                  {/* Router Indicator */}
                  <div
                    style={{
                      left: `${routerX - 22}px`,
                      top: `${routerY - 22}px`,
                    }}
                    className="absolute z-30 w-11 h-11 bg-white rounded-2xl border-2 border-[#ff5500] shadow-xl flex items-center justify-center pointer-events-none"
                    title="Router WIN"
                  >
                    <span className="text-xl">📡</span>
                  </div>

                  {/* Repeater Indicator (if placed) */}
                  {repeater && repeaterX !== null && (
                    <div
                      style={{
                        left: `${repeaterX - 20}px`,
                        top: `${repeaterY - 20}px`,
                      }}
                      className="absolute z-30 w-10 h-10 bg-emerald-950 text-white rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center justify-center pointer-events-none text-lg"
                      title="Repetidor Mesh WIN"
                    >
                      <span>🔁</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2 w-full px-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-700">📌 Router WIN:</span>
                  <span>{router ? (router.snappedWall || `En ${router.roomName || 'plano'}`) : 'Centro de la vivienda'}</span>
                </div>
                {repeater && (
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                    <span>🔁 Repetidor Mesh:</span>
                    <span>{repeater.snappedWall || `En ${repeater.roomName || 'plano'}`} {repeater.hasEthernet ? '(Cable Ethernet)' : '(Wi-Fi)'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Legend & Diagnostics */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Nivel de Cobertura Wi-Fi</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
                      <span className="font-bold text-emerald-900">Excelente (5 GHz)</span>
                    </div>
                    <span className="text-emerald-700 font-extrabold">&gt; 300 Mbps</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
                      <span className="font-bold text-amber-900">Buena / Estable</span>
                    </div>
                    <span className="text-amber-700 font-extrabold">100 - 300 Mbps</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
                      <span className="font-bold text-rose-900">Débil / Zona Muerta</span>
                    </div>
                    <span className="text-rose-700 font-extrabold">&lt; 30 Mbps</span>
                  </div>
                </div>
              </div>

              {/* Repeater Card (Adaptive if already active vs suggested) */}
              {repeater ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✨</span>
                    <h4 className="font-bold text-emerald-950 text-xs">Repetidor Mesh WIN Conectado</h4>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    La señal se encuentra amplificada al 100% de cobertura simétrica en todas las áreas previamente lejanas.
                    {repeater.hasEthernet && ' Conexión por cable Ethernet (Backhaul) habilitada.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/paso-7')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Ajustar parámetros Mesh</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#ff5500]/30 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🚀</span>
                    <h4 className="font-bold text-slate-900 text-xs">¿Tienes esquinas con señal débil?</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Para casas de {selectedFloors} piso(s) o paredes gruesas, recomendamos conectar un Repetidor Mesh WIN para llevar la señal al 100%.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/paso-7')}
                    className="w-full py-3 bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold text-xs rounded-full shadow-md shadow-[#ff5500]/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Ver recomendación Mesh WIN</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-8 pb-4">
        <button
          type="button"
          className="px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
          onClick={() => navigate('/paso-5')}
        >
          Atrás (Paredes y Router)
        </button>
        <button
          type="button"
          className="inline-flex items-center space-x-2 px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-base group"
          onClick={() => navigate('/paso-7')}
        >
          <span>Siguiente paso</span>
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
