import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

const WALL_MATERIALS = [
  { id: 'concreto', name: 'Concreto / Ladrillo', color: 'bg-slate-700', border: 'border-slate-800', attenuation: 'Alta absorción Wi-Fi (-12 dB)', icon: '🧱' },
  { id: 'drywall', name: 'Drywall / Tabique', color: 'bg-amber-600', border: 'border-amber-700', attenuation: 'Media absorción Wi-Fi (-6 dB)', icon: '🪵' },
  { id: 'vidrio', name: 'Vidrio / Mampara', color: 'bg-cyan-500', border: 'border-cyan-600', attenuation: 'Baja absorción Wi-Fi (-3 dB)', icon: '🪟' },
];

export default function Paso5DisenoRouter() {
  const navigate = useNavigate();
  const {
    houseWidth,
    houseLength,
    selectedFloors,
    currentFloorView,
    setCurrentFloorView,
    placedElements,
    setPlacedElements,
    placedWalls,
    setPlacedWalls,
  } = useSimulator();

  const [selectedWallMaterial, setSelectedWallMaterial] = useState('concreto');
  const [wallOrientation, setWallOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedWallId, setSelectedWallId] = useState(null);

  const canvasRef = useRef(null);
  const activeInteractionRef = useRef(null); // { type: 'moveElement' | 'moveWall', id, startX, startY, origX, origY }

  // Canvas scaling according to Paso 3 measurements
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

  // --- 1-Click Wall Placement on a Room's Border or Canvas Edge ---
  const handleToggleRoomEdgeWall = (element, side) => {
    // side: 'top' | 'bottom' | 'left' | 'right'
    const wallThick = 9;
    let wallX = element.x;
    let wallY = element.y;
    let wallW = element.w;
    let wallH = element.h;
    let orientation = 'horizontal';

    if (side === 'top') {
      wallY = Math.max(0, element.y - wallThick / 2);
      wallH = wallThick;
      orientation = 'horizontal';
    } else if (side === 'bottom') {
      wallY = Math.min(canvasH - wallThick, element.y + element.h - wallThick / 2);
      wallH = wallThick;
      orientation = 'horizontal';
    } else if (side === 'left') {
      wallX = Math.max(0, element.x - wallThick / 2);
      wallW = wallThick;
      orientation = 'vertical';
    } else if (side === 'right') {
      wallX = Math.min(canvasW - wallThick, element.x + element.w - wallThick / 2);
      wallW = wallThick;
      orientation = 'vertical';
    }

    // Check if a wall is already placed on this exact border
    const existingIndex = placedWalls.findIndex(
      (w) =>
        Math.abs(w.x - wallX) < 15 &&
        Math.abs(w.y - wallY) < 15 &&
        w.orientation === orientation
    );

    if (existingIndex >= 0) {
      // Toggle off (remove)
      setPlacedWalls((prev) => prev.filter((_, idx) => idx !== existingIndex));
      setSelectedWallId(null);
    } else {
      // Add new wall
      const newWall = {
        id: `wall-${Date.now()}-${side}`,
        roomId: element.id,
        side,
        material: selectedWallMaterial,
        orientation,
        x: wallX,
        y: wallY,
        w: wallW,
        h: wallH,
      };
      setPlacedWalls((prev) => [...prev, newWall]);
      setSelectedWallId(newWall.id);
    }
  };

  // Add perimeter walls around all rooms with one click
  const handleAutoBorderRooms = () => {
    const rooms = placedElements.filter((el) => el.type === 'room');
    if (rooms.length === 0) return;

    const wallThick = 9;
    const newWalls = [];

    rooms.forEach((r, idx) => {
      // Top
      newWalls.push({
        id: `wall-auto-${idx}-t-${Date.now()}`,
        material: selectedWallMaterial,
        orientation: 'horizontal',
        x: r.x,
        y: Math.max(0, r.y - wallThick / 2),
        w: r.w,
        h: wallThick,
      });
      // Bottom
      newWalls.push({
        id: `wall-auto-${idx}-b-${Date.now()}`,
        material: selectedWallMaterial,
        orientation: 'horizontal',
        x: r.x,
        y: Math.min(canvasH - wallThick, r.y + r.h - wallThick / 2),
        w: r.w,
        h: wallThick,
      });
      // Left
      newWalls.push({
        id: `wall-auto-${idx}-l-${Date.now()}`,
        material: selectedWallMaterial,
        orientation: 'vertical',
        x: Math.max(0, r.x - wallThick / 2),
        y: r.y,
        w: wallThick,
        h: r.h,
      });
      // Right
      newWalls.push({
        id: `wall-auto-${idx}-r-${Date.now()}`,
        material: selectedWallMaterial,
        orientation: 'vertical',
        x: Math.min(canvasW - wallThick, r.x + r.w - wallThick / 2),
        y: r.y,
        w: wallThick,
        h: r.h,
      });
    });

    setPlacedWalls((prev) => [...prev, ...newWalls]);
  };

  // --- Add a manual wall ---
  const handleAddWall = () => {
    const isHoriz = wallOrientation === 'horizontal';
    const wallW = isHoriz ? Math.min(140, canvasW * 0.35) : 9;
    const wallH = isHoriz ? 9 : Math.min(140, canvasH * 0.35);

    const newWall = {
      id: `wall-${Date.now()}`,
      material: selectedWallMaterial,
      orientation: wallOrientation,
      x: Math.max(10, (canvasW - wallW) / 2 + (Math.random() * 30 - 15)),
      y: Math.max(10, (canvasH - wallH) / 2 + (Math.random() * 30 - 15)),
      w: wallW,
      h: wallH,
    };

    setPlacedWalls((prev) => [...prev, newWall]);
    setSelectedWallId(newWall.id);
    setSelectedElementId(null);
  };

  // --- Add Router if none exists ---
  const handleAddRouter = () => {
    const existingRouter = placedElements.find((el) => el.itemId === 'router');
    if (existingRouter) {
      setSelectedElementId(existingRouter.id);
      return;
    }
    const newRouter = {
      id: `router-${Date.now()}`,
      itemId: 'router',
      name: 'Router WIN',
      emoji: '📶',
      type: 'device',
      bg: 'bg-[#ff5500]/15',
      border: 'border-[#ff5500]',
      x: (canvasW - 75) / 2,
      y: (canvasH - 75) / 2,
      w: 75,
      h: 75,
    };
    setPlacedElements((prev) => [...prev, newRouter]);
    setSelectedElementId(newRouter.id);
  };

  // --- Move Handlers ---
  const handleMouseDown = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === 'element') {
      setSelectedElementId(item.id);
      setSelectedWallId(null);
    } else {
      setSelectedWallId(item.id);
      setSelectedElementId(null);
    }

    activeInteractionRef.current = {
      type, // 'element' | 'wall'
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      origW: item.w,
      origH: item.h,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const inter = activeInteractionRef.current;
    if (!inter) return;

    const dx = e.clientX - inter.startX;
    const dy = e.clientY - inter.startY;

    if (inter.type === 'element') {
      setPlacedElements((prev) =>
        prev.map((el) => {
          if (el.id !== inter.id) return el;
          const newX = Math.max(0, Math.min(canvasW - el.w, inter.origX + dx));
          const newY = Math.max(0, Math.min(canvasH - el.h, inter.origY + dy));
          return { ...el, x: newX, y: newY };
        })
      );
    } else if (inter.type === 'wall') {
      setPlacedWalls((prev) =>
        prev.map((w) => {
          if (w.id !== inter.id) return w;
          const newX = Math.max(0, Math.min(canvasW - w.w, inter.origX + dx));
          const newY = Math.max(0, Math.min(canvasH - w.h, inter.origY + dy));
          return { ...w, x: newX, y: newY };
        })
      );
    }
  };

  const handleMouseUp = () => {
    activeInteractionRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteSelectedWall = () => {
    if (!selectedWallId) return;
    setPlacedWalls((prev) => prev.filter((w) => w.id !== selectedWallId));
    setSelectedWallId(null);
  };

  const handleRotateSelectedWall = () => {
    if (!selectedWallId) return;
    setPlacedWalls((prev) =>
      prev.map((w) => {
        if (w.id !== selectedWallId) return w;
        const newOrientation = w.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        return {
          ...w,
          orientation: newOrientation,
          w: w.h,
          h: w.w,
        };
      })
    );
  };

  // Check if router is placed
  const routerCount = placedElements.filter((el) => el.itemId === 'router').length;

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-5">
      <div>
        {/* Step Indicator Header matching WIN design system */}
        <div className="flex items-center space-x-3 mb-5">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            5
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Coloca tus paredes y tu Router WIN
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Paredes y ubicación del Router
              </h2>
              <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                Haz un clic en cualquier borde para colocar una pared y ubica tu <b>Router WIN</b> en la habitación deseada.
              </p>
            </div>

            {/* Floor selector if more than 1 floor */}
            {selectedFloors !== '1' && (
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
                {['Primer piso', 'Segundo piso'].map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setCurrentFloorView(floor)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Blueprint: Shows rooms from Step 4 + Walls + Routers */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-2xl border border-slate-200/80 select-none">
              {/* Length indicator (Top) */}
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#ff5500] mb-1.5">
                <span>← {lengthM} m de fondo →</span>
              </div>

              <div className="flex items-center justify-center w-full">
                {/* Width indicator (Left) */}
                <div className="text-xs font-extrabold text-[#ff5500] -rotate-90 -mr-6 whitespace-nowrap">
                  ← {widthM} m frontis →
                </div>

                {/* Blueprint Canvas */}
                <div
                  ref={canvasRef}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setSelectedElementId(null);
                      setSelectedWallId(null);
                    }
                  }}
                  style={{
                    width: `${canvasW}px`,
                    height: `${canvasH}px`,
                  }}
                  className="relative rounded-2xl border-2 border-slate-400 bg-white grid-pattern shadow-inner overflow-hidden flex-shrink-0"
                >
                  {/* Empty warning if step 4 had no elements */}
                  {placedElements.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-60">
                      <span className="text-3xl mb-2">💡</span>
                      <p className="font-bold text-slate-700 text-xs">
                        No colocaste ambientes en el paso 4, puedes añadir paredes y tu Router directamente aquí.
                      </p>
                    </div>
                  )}

                  {/* 1. Render Placed Rooms from Step 4 with Clickable Edges */}
                  {placedElements
                    .filter((el) => el.type === 'room')
                    .map((el) => {
                      const isSel = el.id === selectedElementId;
                      return (
                        <div
                          key={el.id}
                          onMouseDown={(e) => handleMouseDown(e, el, 'element')}
                          style={{
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.w}px`,
                            height: `${el.h}px`,
                          }}
                          className={`group absolute rounded-xl border-2 flex flex-col justify-between p-2 cursor-move select-none transition-shadow ${
                            el.bg
                          } ${el.border} ${
                            isSel ? 'ring-2 ring-[#ff5500] shadow-md z-20' : 'shadow-xs z-10'
                          }`}
                        >
                          <span className="font-extrabold text-xs text-slate-800 tracking-tight truncate pointer-events-none">
                            {el.emoji} {el.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 text-center pointer-events-none">
                            {Math.round((el.w / canvasW) * widthM)}x{Math.round((el.h / canvasH) * lengthM)}m
                          </span>

                          {/* 1-Click Interactive Wall Edges: Top */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRoomEdgeWall(el, 'top');
                            }}
                            title="Haz clic para agregar o quitar pared en este borde"
                            className="absolute -top-1.5 left-2 right-2 h-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
                          >
                            <span className="text-[9px] font-black text-white bg-slate-900 px-1 rounded shadow-xs">
                              + pared
                            </span>
                          </div>

                          {/* 1-Click Interactive Wall Edges: Bottom */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRoomEdgeWall(el, 'bottom');
                            }}
                            title="Haz clic para agregar o quitar pared en este borde"
                            className="absolute -bottom-1.5 left-2 right-2 h-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
                          >
                            <span className="text-[9px] font-black text-white bg-slate-900 px-1 rounded shadow-xs">
                              + pared
                            </span>
                          </div>

                          {/* 1-Click Interactive Wall Edges: Left */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRoomEdgeWall(el, 'left');
                            }}
                            title="Haz clic para agregar o quitar pared en este borde"
                            className="absolute -left-1.5 top-2 bottom-2 w-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
                          >
                            <span className="text-[8px] font-black text-white bg-slate-900 px-0.5 rounded shadow-xs rotate-90">
                              + pared
                            </span>
                          </div>

                          {/* 1-Click Interactive Wall Edges: Right */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRoomEdgeWall(el, 'right');
                            }}
                            title="Haz clic para agregar o quitar pared en este borde"
                            className="absolute -right-1.5 top-2 bottom-2 w-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
                          >
                            <span className="text-[8px] font-black text-white bg-slate-900 px-0.5 rounded shadow-xs rotate-90">
                              + pared
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* 2. Render Placed Walls (Interactive obstacles) */}
                  {placedWalls.map((wall) => {
                    const isSel = wall.id === selectedWallId;
                    const mat = WALL_MATERIALS.find((m) => m.id === wall.material) || WALL_MATERIALS[0];

                    return (
                      <div
                        key={wall.id}
                        onMouseDown={(e) => handleMouseDown(e, wall, 'wall')}
                        style={{
                          left: `${wall.x}px`,
                          top: `${wall.y}px`,
                          width: `${wall.w}px`,
                          height: `${wall.h}px`,
                        }}
                        className={`absolute rounded-sm cursor-grab active:cursor-grabbing transition-all z-30 ${
                          mat.color
                        } ${
                          isSel
                            ? 'ring-3 ring-[#ff5500] shadow-lg scale-105'
                            : 'shadow-md hover:brightness-110'
                        }`}
                        title={`Muro de ${mat.name} (${mat.attenuation})`}
                      />
                    );
                  })}

                  {/* 3. Render Routers and Devices (Top z-index with pulse wave) */}
                  {placedElements
                    .filter((el) => el.type === 'device')
                    .map((dev) => {
                      const isSel = dev.id === selectedElementId;
                      return (
                        <div
                          key={dev.id}
                          onMouseDown={(e) => handleMouseDown(e, dev, 'element')}
                          style={{
                            left: `${dev.x}px`,
                            top: `${dev.y}px`,
                            width: `${dev.w}px`,
                            height: `${dev.h}px`,
                          }}
                          className={`absolute rounded-2xl flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing transition-all z-40 bg-slate-900 border-2 border-white shadow-xl ${
                            isSel ? 'ring-3 ring-[#ff5500] ring-offset-2' : ''
                          }`}
                        >
                          {/* Pulsing signal halo */}
                          <div className="absolute -inset-3 rounded-full bg-[#ff5500]/20 animate-ping pointer-events-none"></div>

                          <div className="flex items-center space-x-1 mb-1 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">
                              {dev.name.includes('Router') ? 'ROUTER' : 'MESH'}
                            </span>
                          </div>
                          <span className="text-xl pointer-events-none">📶</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Canvas controls & tip */}
              <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-500 px-2 flex-wrap gap-2">
                <span>💡 Arrastra el <b>Router</b> o las <b>Paredes</b> para ubicarlos libremente.</span>
                {selectedWallId && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleRotateSelectedWall}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:border-[#ff5500] rounded-lg font-bold text-[#ff5500] cursor-pointer"
                    >
                      🔄 Girar pared
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelectedWall}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg font-bold text-rose-600 cursor-pointer"
                    >
                      🗑️ Quitar pared
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Wall Generator & Router Management */}
            <div className="lg:col-span-4 space-y-4">
              {/* Add Router Card if none placed */}
              <div className="bg-[#FFF8F5] border border-[#ff5500]/25 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <span>📡</span>
                    <span>Router Fibra WIN</span>
                  </h3>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 bg-[#ff5500] text-white rounded-full">
                    {routerCount > 0 ? '1 colocado' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  {routerCount > 0
                    ? 'Tu Router está activo en el plano. Puedes moverlo arrastrándolo a la habitación deseada.'
                    : 'Coloca tu router en el centro de tu casa para maximizar la cobertura.'}
                </p>
                {routerCount === 0 && (
                  <button
                    type="button"
                    onClick={handleAddRouter}
                    className="w-full py-2.5 bg-[#ff5500] hover:bg-[#e64d00] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-[#ff5500]/20"
                  >
                    <span>+ Colocar Router WIN en plano</span>
                  </button>
                )}
              </div>

              {/* Add Walls Tool */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <span>🧱</span>
                    <span>Añadir Paredes / Muros</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Las paredes atenúan la señal Wi-Fi. Dibuja las divisiones de tu casa:
                  </p>
                </div>

                {/* Wall Material Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Material de la pared
                  </label>
                  <div className="space-y-1.5">
                    {WALL_MATERIALS.map((mat) => {
                      const isSel = selectedWallMaterial === mat.id;
                      return (
                        <div
                          key={mat.id}
                          onClick={() => setSelectedWallMaterial(mat.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                            isSel
                              ? 'border-[#ff5500] bg-white ring-2 ring-[#ff5500]/20 shadow-xs'
                              : 'border-slate-200 bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{mat.icon}</span>
                            <span className="font-bold text-slate-800">{mat.name}</span>
                          </div>
                          <span className={`w-3.5 h-3.5 rounded-full ${mat.color}`}></span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wall Orientation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Orientación
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWallOrientation('horizontal')}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        wallOrientation === 'horizontal'
                          ? 'border-[#ff5500] bg-[#FFF8F5] text-[#ff5500]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Horizontal ━
                    </button>
                    <button
                      type="button"
                      onClick={() => setWallOrientation('vertical')}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        wallOrientation === 'vertical'
                          ? 'border-[#ff5500] bg-[#FFF8F5] text-[#ff5500]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Vertical ┃
                    </button>
                  </div>
                </div>

                {/* Add Wall Button */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleAddWall}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <span>+ Agregar pared individual</span>
                  </button>

                  {placedElements.filter((el) => el.type === 'room').length > 0 && (
                    <button
                      type="button"
                      onClick={handleAutoBorderRooms}
                      className="w-full py-2 bg-[#FFF8F5] border border-[#ff5500] hover:bg-[#ff5500] text-[#ff5500] hover:text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>⚡ Paredes a todas las habitaciones (1 clic)</span>
                    </button>
                  )}
                </div>

                {/* Direct 1-Click Instructions */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <span>👆</span>
                    <span>1 solo clic en el borde:</span>
                  </div>
                  <p>
                    Pasa el cursor sobre cualquier borde de una habitación en el plano y haz clic en <b>+ pared</b> para ponerla o quitarla al instante.
                  </p>
                </div>

                {/* Wall count summary */}
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Paredes agregadas:</span>
                  <span className="font-extrabold text-slate-900">{placedWalls.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pb-4">
        <button
          type="button"
          onClick={() => navigate('/paso-4')}
          className="px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={() => navigate('/paso-6')}
          className="inline-flex items-center space-x-2 px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-base group"
        >
          <span>Simular Cobertura</span>
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

