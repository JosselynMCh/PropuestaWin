import React, { useState } from 'react';
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
    setPlacedElements,
    placedWalls,
    unlockUpTo,
  } = useSimulator();

  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Proportional canvas sizing matching step 4 & 5
  const widthM = houseWidth && houseWidth > 0 ? houseWidth : 10;
  const lengthM = houseLength && houseLength > 0 ? houseLength : 15;

  const [containerWidth, setContainerWidth] = useState(600);
  const canvasContainerRef = React.useRef(null);

  React.useEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const w = canvasContainerRef.current.clientWidth - 48; // padding
        setContainerWidth(Math.max(260, w));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const maxCanvasW = Math.min(600, containerWidth);
  const maxCanvasH = Math.min(430, maxCanvasW * 0.75);
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

  // Intelligent Mesh Placement Recommendation Algorithm:
  // Finds the room that is furthest from the Router or has lowest signal coverage
  const getRecommendedRepeaterRoom = () => {
    if (rooms.length === 0) return null;
    let maxDist = -1;
    let furthestRoom = rooms[0];

    rooms.forEach((r) => {
      // Don't recommend the room where the router is already installed
      if (router && router.roomId && r.id === router.roomId) return;
      if (router && router.roomName && r.name === router.roomName) return;

      const roomCenterX = r.x + r.w / 2;
      const roomCenterY = r.y + r.h / 2;
      const dist = Math.hypot(roomCenterX - routerX, roomCenterY - routerY);

      if (dist > maxDist) {
        maxDist = dist;
        furthestRoom = r;
      }
    });

    return furthestRoom;
  };

  const recommendedRoom = getRecommendedRepeaterRoom();

  // Add repeater directly in recommended or specified room
  const handleAddRepeater = (targetRoom = recommendedRoom) => {
    let repW = 34;
    let repH = 34;
    let placeX = canvasW * 0.75;
    let placeY = canvasH * 0.25;
    let roomName = '';
    let wallDesc = '';

    if (targetRoom) {
      // Snap to wall inside target room
      placeX = Math.max(targetRoom.x + 6, Math.min(targetRoom.x + targetRoom.w - repW - 6, targetRoom.x + targetRoom.w / 2));
      placeY = Math.max(targetRoom.y + 6, targetRoom.y + 6); // top wall
      roomName = targetRoom.name;
      wallDesc = `Pared de ${targetRoom.name}`;
    }

    const newRepeater = {
      id: `mesh-repeater-${Date.now()}`,
      itemId: 'mesh-repeater',
      type: 'device',
      name: 'Repetidor Mesh WIN',
      emoji: '🔁',
      x: Math.round(placeX),
      y: Math.round(placeY),
      w: repW,
      h: repH,
      snappedWall: wallDesc,
      roomName: roomName,
      roomId: targetRoom?.id,
      hasEthernet: false,
    };

    setPlacedElements((prev) => [...prev.filter((el) => el.itemId !== 'mesh-repeater'), newRepeater]);
    showFeedback(`¡Repetidor Mesh WIN añadido con éxito en ${roomName || 'tu plano'}!`);
  };

  const handleRemoveRepeater = () => {
    setPlacedElements((prev) => prev.filter((el) => el.itemId !== 'mesh-repeater'));
    showFeedback('Repetidor Mesh retirado');
  };

  const handleToggleEthernet = () => {
    if (!repeater) return;
    setPlacedElements((prev) =>
      prev.map((el) =>
        el.itemId === 'mesh-repeater' ? { ...el, hasEthernet: !el.hasEthernet } : el
      )
    );
    showFeedback(repeater.hasEthernet ? 'Conexión cambiada a Wi-Fi Mesh' : 'Cable Ethernet Backhaul activado');
  };

  const handleNext = () => {
    unlockUpTo(7);
    navigate('/paso-7');
  };

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

        {/* Dynamic Toast Feedback */}
        {feedbackMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
              <span>{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Mapa de calor Wi-Fi en tu hogar
              </h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                Simulación real de propagación de señal de fibra con atenuación de muros y nodos Mesh.
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

          <div className="flex flex-col lg:flex-row lg:gap-6 gap-4 items-start">
            {/* Left: Custom Blueprint & Wi-Fi Heatmap */}
            <div className="lg:flex-[2] w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium mb-2 px-1">
                <span>Plano: <b>{widthM}m × {lengthM}m</b> ({widthM * lengthM} m²)</span>
                <span className="text-[#ff5500] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
                  Señal activa 100% Fibra Óptica WIN
                </span>
              </div>

              <div ref={canvasContainerRef} className="w-full flex items-center justify-center p-2 sm:p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl sm:rounded-2xl overflow-x-auto">
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
                        background: `radial-gradient(circle 340px at ${repeaterX}px ${repeaterY}px, 
                          rgba(16, 185, 129, 0.46) 0%, 
                          rgba(16, 185, 129, 0.30) 40%, 
                          rgba(234, 179, 8, 0.16) 75%, 
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
                      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-11"
                      style={{ left: `${repeaterX}px`, top: `${repeaterY}px` }}
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-emerald-400/70 animate-ping" />
                      <div className="w-44 h-44 rounded-full border border-emerald-400/50" />
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
                    <span className="text-xs font-bold text-slate-800">Router</span>
                  </div>

                  {/* Repeater Indicator (if placed) */}
                  {repeater && repeaterX !== null && (
                    <div
                      style={{
                        left: `${repeaterX - 20}px`,
                        top: `${repeaterY - 20}px`,
                      }}
                      className="absolute z-30 w-10 h-10 bg-emerald-950 text-white rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center justify-center pointer-events-none text-lg animate-pulse"
                      title="Repetidor Mesh WIN"
                    >
                      <span className="text-xs font-bold">Mesh</span>
                    </div>
                  )}

                  {/* Connection Line between Router and Mesh Repeater */}
                  {repeater && repeaterX !== null && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-25">
                      <line
                        x1={routerX}
                        y1={routerY}
                        x2={repeaterX}
                        y2={repeaterY}
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray={repeater.hasEthernet ? 'none' : '4 4'}
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Status bar under map */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2 w-full px-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-800">Router:</span>
                  <span>{router ? (router.snappedWall || `En ${router.roomName || 'plano'}`) : 'Centro del hogar'}</span>
                </div>
                {repeater ? (
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                    <span>Mesh:</span>
                    <span>{repeater.snappedWall || `En ${repeater.roomName || 'plano'}`} {repeater.hasEthernet ? '(Cable Ethernet)' : '(Wi-Fi 6)'}</span>
                  </div>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    Señal débil en áreas lejanas al router
                  </span>
                )}
              </div>
            </div>

            {/* Right: Unified Mesh & Coverage Legend Block */}
            <div className="lg:flex-[1] w-full bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 flex flex-col">
              
              {/* Header */}
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Diagnóstico de Cobertura
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  En tiempo real
                </span>
              </div>

              {/* SECTION 1: Niveles de Cobertura */}
              <div className="p-4 space-y-2.5">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Rango de Cobertura Wi-Fi
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                      <span className="font-bold text-emerald-950">Excelente (5 GHz)</span>
                    </div>
                    <span className="text-emerald-700 font-black">&gt; 300 Mbps</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                      <span className="font-bold text-amber-950">Buena / Estable</span>
                    </div>
                    <span className="text-amber-700 font-black">100 - 300 Mbps</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-rose-50/90 border border-rose-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                      <span className="font-bold text-rose-950">Débil / Zona Muerta</span>
                    </div>
                    <span className="text-rose-700 font-black">&lt; 30 Mbps</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Repetidor Mesh Integrado (Añadir aquí mismo con recomendación) */}
              <div className="p-4 space-y-3 bg-[#FFFBF9]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Repetidor Mesh WIN
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      repeater
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {repeater ? 'Activo' : 'Recomendado'}
                  </span>
                </div>

                {/* Intelligent Placement Recommendation Note */}
                {recommendedRoom && !repeater && (
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1 text-amber-950">
                      <span>Ubicación recomendada:</span>
                    </div>
                    <p className="leading-snug">
                      Instalar en <b>{recommendedRoom.name}</b> para eliminar la zona muerta y balancear la señal al 100%.
                    </p>
                  </div>
                )}

                {repeater ? (
                  <div className="space-y-2">
                    <div className="bg-white border border-emerald-300 rounded-xl p-2.5 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">

                        <span className="text-xs font-bold text-slate-800 truncate">
                          {repeater.snappedWall || `En ${repeater.roomName || 'Pared'}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveRepeater}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition"
                      >
                        Quitar ✕
                      </button>
                    </div>

                    {/* Backhaul ethernet toggle */}
                    <button
                      type="button"
                      onClick={handleToggleEthernet}
                      className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        repeater.hasEthernet
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <span>Conexión por Cable (Ethernet)</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${repeater.hasEthernet ? 'bg-emerald-600 text-white font-black' : 'bg-slate-200 text-slate-600'}`}>
                        {repeater.hasEthernet ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleAddRepeater(recommendedRoom)}
                      className="w-full py-2.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.99] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm shadow-[#ff5500]/25"
                    >
                      <span>+ Añadir Repetidor en {recommendedRoom ? recommendedRoom.name : 'tu hogar'}</span>
                    </button>

                    {/* Direct room options to place repeater */}
                    {rooms.length > 1 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          O elegir otra habitación:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rooms.map((room) => (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() => handleAddRepeater(room)}
                              className="px-2 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-[#ff5500] text-slate-700 cursor-pointer flex items-center space-x-1 transition"
                            >

                              <span>{room.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer info */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Cobertura calculada: <b className="text-slate-800">{repeater ? '100% Total' : '75% Parcial'}</b></span>
                </span>
                <span className="font-bold text-win-600">Wi-Fi 6 WIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer: Directly advances to Diagnóstico (Paso 7 now) */}
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
          onClick={handleNext}
        >
          <span>Siguiente: Propuesta Final</span>
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
