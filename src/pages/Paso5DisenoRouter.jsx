import React, { useState, useRef, useEffect } from 'react';
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
    getAvailableFloors,
    placedElements,
    setPlacedElements,
    placedWalls,
    setPlacedWalls,
    clearCurrentFloor,
    clearCurrentFloorWallsAndDevices,
  } = useSimulator();

  const [selectedWallMaterial, setSelectedWallMaterial] = useState('concreto');
  const [wallOrientation, setWallOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedWallId, setSelectedWallId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const activeInteractionRef = useRef(null);

  // Canvas scaling according to Paso 3 measurements
  const widthM = houseWidth && houseWidth > 0 ? houseWidth : 10;
  const lengthM = houseLength && houseLength > 0 ? houseLength : 15;

  // Responsive canvas sizing
  const [containerWidth, setContainerWidth] = useState(600);
  React.useLayoutEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const w = canvasContainerRef.current.clientWidth - 48;
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

  // Rooms and Router
  const rooms = placedElements.filter((el) => el.type === 'room');
  const routerDevice = placedElements.find((el) => el.itemId === 'router');

  // --- Automatic Wall Snapping Algorithm ---
  // When placing or moving a router/repeater in a room, snaps it flush against the closest wall
  const snapDeviceToWall = (devX, devY, devW, devH) => {
    const centerX = devX + devW / 2;
    const centerY = devY + devH / 2;

    // 1. Find containing room or closest room
    let targetRoom = rooms.find(
      (r) => centerX >= r.x && centerX <= r.x + r.w && centerY >= r.y && centerY <= r.y + r.h
    );

    if (!targetRoom && rooms.length > 0) {
      let minDist = Infinity;
      rooms.forEach((r) => {
        const rcx = r.x + r.w / 2;
        const rcy = r.y + r.h / 2;
        const d = Math.hypot(centerX - rcx, centerY - rcy);
        if (d < minDist) {
          minDist = d;
          targetRoom = r;
        }
      });
    }

    if (targetRoom) {
      const dTop = Math.abs(centerY - targetRoom.y);
      const dBottom = Math.abs(centerY - (targetRoom.y + targetRoom.h));
      const dLeft = Math.abs(centerX - targetRoom.x);
      const dRight = Math.abs(centerX - (targetRoom.x + targetRoom.w));

      const minEdge = Math.min(dTop, dBottom, dLeft, dRight);
      let snappedX = devX;
      let snappedY = devY;
      let wallDesc = '';

      if (minEdge === dTop) {
        snappedY = Math.max(0, targetRoom.y + 4);
        snappedX = Math.max(targetRoom.x + 4, Math.min(targetRoom.x + targetRoom.w - devW - 4, devX));
        wallDesc = `Pared superior (${targetRoom.name})`;
      } else if (minEdge === dBottom) {
        snappedY = Math.min(canvasH - devH, targetRoom.y + targetRoom.h - devH - 4);
        snappedX = Math.max(targetRoom.x + 4, Math.min(targetRoom.x + targetRoom.w - devW - 4, devX));
        wallDesc = `Pared inferior (${targetRoom.name})`;
      } else if (minEdge === dLeft) {
        snappedX = Math.max(0, targetRoom.x + 4);
        snappedY = Math.max(targetRoom.y + 4, Math.min(targetRoom.y + targetRoom.h - devH - 4, devY));
        wallDesc = `Pared izquierda (${targetRoom.name})`;
      } else {
        snappedX = Math.min(canvasW - devW, targetRoom.x + targetRoom.w - devW - 4);
        snappedY = Math.max(targetRoom.y + 4, Math.min(targetRoom.y + targetRoom.h - devH - 4, devY));
        wallDesc = `Pared derecha (${targetRoom.name})`;
      }

      return {
        x: Math.round(snappedX),
        y: Math.round(snappedY),
        roomName: targetRoom.name,
        wallDesc,
        roomId: targetRoom.id,
      };
    }

    // 2. Fallback: Snap to nearest canvas border if no room exists
    const dTop = devY;
    const dBottom = canvasH - (devY + devH);
    const dLeft = devX;
    const dRight = canvasW - (devX + devW);
    const minC = Math.min(dTop, dBottom, dLeft, dRight);

    if (minC === dTop) return { x: Math.round(devX), y: 4, roomName: 'Perímetro', wallDesc: 'Pared norte' };
    if (minC === dBottom) return { x: Math.round(devX), y: Math.round(canvasH - devH - 4), roomName: 'Perímetro', wallDesc: 'Pared sur' };
    if (minC === dLeft) return { x: 4, y: Math.round(devY), roomName: 'Perímetro', wallDesc: 'Pared oeste' };
    return { x: Math.round(canvasW - devW - 4), y: Math.round(devY), roomName: 'Perímetro', wallDesc: 'Pared este' };
  };

  // --- Add Router with automatic Wall Snapping ---
  const handleAddRouter = (preferredRoom = null) => {
    const existingRouter = placedElements.find((el) => el.itemId === 'router');
    const targetRoom = preferredRoom || rooms.find((r) => r.itemId === 'sala') || rooms[0];
    const devW = 44;
    const devH = 44;

    // Specific placement: aligned flush against the bottom wall of the target room (e.g. Sala)
    let initialX, initialY;
    if (targetRoom) {
      initialX = targetRoom.x + Math.max(2, Math.round((targetRoom.w - devW) / 2));
      initialY = targetRoom.y + targetRoom.h - devH - 2;
    } else {
      initialX = Math.round((canvasW - devW) / 2);
      initialY = canvasH - devH - 4;
    }

    const snapped = snapDeviceToWall(initialX, initialY, devW, devH);

    if (existingRouter) {
      setPlacedElements((prev) =>
        prev.map((el) =>
          el.id === existingRouter.id
            ? { ...el, x: snapped.x, y: snapped.y, w: devW, h: devH, snappedWall: snapped.wallDesc, roomName: snapped.roomName }
            : el
        )
      );
      setSelectedElementId(existingRouter.id);
      showFeedback(`Router ubicado en la pared de ${snapped.roomName}`);
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
      x: snapped.x,
      y: snapped.y,
      w: devW,
      h: devH,
      snappedWall: snapped.wallDesc,
      roomName: snapped.roomName,
    };

    setPlacedElements((prev) => [...prev, newRouter]);
    setSelectedElementId(newRouter.id);
    showFeedback(`Router ubicado en la pared de ${snapped.roomName}`);
  };

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  // --- Clear Floor Handler ---
  const handleClearFloor = (clearAll = false) => {
    if (clearAll) {
      clearCurrentFloor();
      showFeedback('Plano de este piso limpiado completamente');
    } else {
      clearCurrentFloorWallsAndDevices();
      showFeedback('Paredes y Router limpiados de este piso');
    }
    setSelectedElementId(null);
    setSelectedWallId(null);
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

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    activeInteractionRef.current = {
      type,
      id: item.id,
      startX: clientX,
      startY: clientY,
      origX: item.x,
      origY: item.y,
      origW: item.w,
      origH: item.h,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleMouseMoveInternal(t.clientX, t.clientY);
  };

  const handleMouseMove = (e) => {
    handleMouseMoveInternal(e.clientX, e.clientY);
  };

  const handleMouseMoveInternal = (clientX, clientY) => {
    const inter = activeInteractionRef.current;
    if (!inter) return;

    const dx = clientX - inter.startX;
    const dy = clientY - inter.startY;

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
    const inter = activeInteractionRef.current;
    if (inter && inter.type === 'element') {
      setPlacedElements((prev) =>
        prev.map((el) => {
          if (el.id === inter.id && el.type === 'device') {
            const snapped = snapDeviceToWall(el.x, el.y, el.w, el.h);
            showFeedback(`${el.name} pegado a la pared de ${snapped.roomName}`);
            return {
              ...el,
              x: snapped.x,
              y: snapped.y,
              snappedWall: snapped.wallDesc,
              roomName: snapped.roomName,
            };
          }
          return el;
        })
      );
    }

    activeInteractionRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleMouseUp);
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


  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-0 sm:px-2 py-2" id="step-view-5">
      <div>
        {/* Step Indicator Header */}
        <div className="flex items-center space-x-3 mb-5 px-2 sm:px-0">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm flex-shrink-0">
            5
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Coloca tus paredes y tu Router WIN
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-8 shadow-sm border border-slate-100 mx-1 sm:mx-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Paredes y ubicación del Router
              </h2>
              <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                Haz un clic en cualquier borde para colocar una pared y ubica tu <b>Router WIN</b> en la pared de la habitación deseada.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Floor selector if more than 1 floor */}
              {selectedFloors !== '1' && (
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl">
                  {getAvailableFloors().map((floor) => (
                    <button
                      key={floor}
                      type="button"
                      onClick={() => {
                        setSelectedElementId(null);
                        setSelectedWallId(null);
                        setCurrentFloorView(floor);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
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

              {/* Botón Limpiar Plano */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleClearFloor(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  title="Limpiar paredes y dispositivos de este piso"
                >
                  <span>🧹</span>
                  <span>Limpiar plano</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic feedback toast / notification */}
          {feedbackMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300/80 rounded-2xl flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                <span className="text-base">✨</span>
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

          <div className="flex flex-col-reverse lg:flex-row lg:gap-6 gap-4 items-start">
            {/* Left Blueprint */}
            <div ref={canvasContainerRef} className="lg:flex-[2] w-full flex flex-col items-center justify-center p-2 sm:p-3 bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200/80 select-none overflow-x-auto">
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
                  className="relative rounded-xl sm:rounded-2xl border-2 border-slate-400 bg-white grid-pattern shadow-inner overflow-hidden flex-shrink-0 touch-none"
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
                          onTouchStart={(e) => handleMouseDown(e, el, 'element')}
                          style={{
                            left: `${el.x}px`,
                            top: `${el.y}px`,
                            width: `${el.w}px`,
                            height: `${el.h}px`,
                          }}
                          className={`group absolute rounded-lg sm:rounded-xl border-2 flex flex-col justify-between p-1 sm:p-2 cursor-move select-none transition-shadow touch-none ${
                            el.bg
                          } ${el.border} ${
                            isSel ? 'ring-2 ring-[#ff5500] shadow-md z-20' : 'shadow-xs z-10'
                          }`}
                        >
                          <span className="font-extrabold text-[9px] sm:text-xs text-slate-800 tracking-tight truncate pointer-events-none">
                            <span>{el.name}</span>
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
                            className="absolute -top-2.5 sm:-top-1.5 left-2 right-2 h-5 sm:h-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
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
                            className="absolute -bottom-2.5 sm:-bottom-1.5 left-2 right-2 h-5 sm:h-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
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
                            className="absolute -left-2.5 sm:-left-1.5 top-2 bottom-2 w-5 sm:w-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
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
                            className="absolute -right-2.5 sm:-right-1.5 top-2 bottom-2 w-5 sm:w-3.5 bg-slate-400/0 hover:bg-[#ff5500]/60 rounded-full cursor-pointer flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30"
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
                        onTouchStart={(e) => handleMouseDown(e, wall, 'wall')}
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

                  {/* 3. Render Router WIN (Compact Wall-Mounted Hardware) */}
                  {placedElements
                    .filter((el) => el.type === 'device')
                    .map((dev) => {
                      const isSel = dev.id === selectedElementId;

                      return (
                        <div
                          key={dev.id}
                          onMouseDown={(e) => handleMouseDown(e, dev, 'element')}
                          onTouchStart={(e) => handleMouseDown(e, dev, 'element')}
                          style={{
                            left: `${dev.x}px`,
                            top: `${dev.y}px`,
                            width: `${dev.w}px`,
                            height: `${dev.h}px`,
                          }}
                          className={`absolute rounded-xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all z-40 border-2 shadow-md bg-slate-900 border-white text-white ${
                            isSel ? 'ring-2 ring-[#ff5500] ring-offset-1 scale-105 shadow-xl' : 'hover:scale-105'
                          }`}
                          title={`${dev.name} (${dev.snappedWall || 'en pared'})`}
                        >
                          {/* Pulsing signal halo */}
                          <div className="absolute -inset-1.5 rounded-full pointer-events-none animate-ping opacity-25 bg-[#ff5500]" />

                          <div className="flex items-center space-x-0.5 pointer-events-none -mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                            <span className="text-[7px] font-black uppercase tracking-tight">
                              ROUTER
                            </span>
                          </div>
                          <span className="text-sm pointer-events-none leading-none mt-0.5">
                            <span className="font-bold">Router</span>
                          </span>

                          {/* Wall Snapped badge */}
                          {dev.snappedWall && (
                            <div className="absolute -bottom-3.5 bg-slate-900/90 text-white text-[7px] font-bold px-1 rounded whitespace-nowrap shadow-xs pointer-events-none flex items-center space-x-0.5">
                              <span>🧱</span>
                              <span className="truncate max-w-[60px]">{dev.roomName || 'Pared'}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Canvas controls & tip */}
              <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-500 px-2 flex-wrap gap-2">
                <span>Arrastra el <b>Router</b> o las <b>Paredes</b> para ubicarlos libremente.</span>
                {selectedWallId && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleRotateSelectedWall}
                      className="px-2.5 py-1 bg-white border border-slate-300 hover:border-[#ff5500] rounded-lg font-bold text-[#ff5500] cursor-pointer"
                    >
                      Girar pared
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelectedWall}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg font-bold text-rose-600 cursor-pointer"
                    >
                      Quitar pared
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Unified, Modern & Structured Control Panel */}
            <div className="lg:flex-1 w-full bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 flex flex-col">
              
              {/* Header of the unified block */}
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500]"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Herramientas de Instalación
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Paso 5
                </span>
              </div>

              {/* SECTION 1: Router WIN (Ubicación en Pared) */}
              <div className="p-4 space-y-3 bg-[#FFFBF9]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Router WIN Fibra
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Adherido automáticamente a la pared
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition-colors ${
                      routerDevice
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {routerDevice ? '✓ En pared' : 'Pendiente'}
                  </span>
                </div>

                {routerDevice ? (
                  <div className="bg-white border border-[#ff5500]/30 rounded-xl p-2.5 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {routerDevice.snappedWall || `Pared de ${routerDevice.roomName || 'Habitación'}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPlacedElements((prev) => prev.filter((el) => el.id !== routerDevice.id));
                        setSelectedElementId(null);
                        showFeedback('Router retirado del plano');
                      }}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition"
                      title="Quitar router"
                    >
                      Quitar ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddRouter()}
                    className="w-full py-2.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.99] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-sm shadow-[#ff5500]/25"
                  >
                    <span>+ Colocar Router WIN en pared</span>
                  </button>
                )}

                {/* Ubicación rápida en habitación */}
                {rooms.length > 0 && (
                  <div className="pt-2 border-t border-[#ff5500]/10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Fijar rápido en ambiente:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rooms.map((room) => {
                        const isCurrentRoom = routerDevice?.roomName === room.name;
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => handleAddRouter(room)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center space-x-1 ${
                              isCurrentRoom
                                ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#ff5500] hover:bg-amber-50/50'
                            }`}
                          >
                            <span>{room.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Material de Paredes */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">
                        Material de Paredes
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Nivel de impacto en la señal Wi-Fi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {WALL_MATERIALS.map((mat) => {
                    const isSel = selectedWallMaterial === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setSelectedWallMaterial(mat.id)}
                        className={`p-2 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                          isSel
                            ? 'border-[#ff5500] bg-orange-50/40 ring-1 ring-[#ff5500] shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-end w-full mb-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${mat.color}`} />
                        </div>
                        <div>
                          <span className="font-bold text-[11px] text-slate-900 block leading-tight">
                            {mat.name.split(' / ')[0]}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                            {mat.id === 'concreto' ? '-12 dB' : mat.id === 'drywall' ? '-6 dB' : '-3 dB'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Formas de agregar paredes */}
              <div className="p-4 space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Colocar Paredes
                  </span>
                  <span className="text-[10px] font-bold text-[#ff5500]">
                    Total: {placedWalls.length}
                  </span>
                </div>

                {/* 1-Click Fast Recommendation */}
                {placedElements.filter((el) => el.type === 'room').length > 0 && (
                  <button
                    type="button"
                    onClick={handleAutoBorderRooms}
                    className="w-full py-2.5 px-3 bg-white border border-[#ff5500] hover:bg-[#ff5500] text-[#ff5500] hover:text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-2 shadow-2xs group"
                  >
                    <span>Paredes a todas las habitaciones (1 clic)</span>
                  </button>
                )}

                {/* Manual Wall Addition */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex rounded-xl bg-slate-200/80 p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setWallOrientation('horizontal')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                        wallOrientation === 'horizontal'
                          ? 'bg-white text-[#ff5500] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Horiz. ━
                    </button>
                    <button
                      type="button"
                      onClick={() => setWallOrientation('vertical')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                        wallOrientation === 'vertical'
                          ? 'bg-white text-[#ff5500] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vert. ┃
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddWall}
                    className="py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <span>+ Añadir libre</span>
                  </button>
                </div>

                {/* Quick Hint Banner */}
                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 flex items-start space-x-2 text-[11px] text-amber-900">
                  <p className="leading-snug">
                    <b>Tip directo:</b> Pasa el cursor por cualquier borde de una habitación en el plano y haz clic en <b>+ pared</b> para ponerla o quitarla al instante.
                  </p>
                </div>
              </div>

              {/* Panel Footer / Quick Stats */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Ambientes: <b>{rooms.length}</b></span>
                </span>
                <span>Paredes: <b className="text-slate-800">{placedWalls.length}</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 sm:mt-8 pb-4 px-2 sm:px-0 gap-3 sm:gap-2">
        <button
          type="button"
          onClick={() => navigate('/paso-4')}
          className="w-full sm:w-auto px-4 sm:px-7 py-2.5 sm:py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-xs sm:text-sm"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={() => navigate('/paso-6')}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 sm:space-x-2 px-5 sm:px-9 py-2.5 sm:py-3.5 bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white font-bold rounded-full shadow-lg shadow-[#ff5500]/25 transition duration-200 cursor-pointer text-sm sm:text-base group"
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

