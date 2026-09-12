import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../context/SimulatorContext';

const AVAILABLE_ITEMS = [
  { type: 'room', id: 'sala', name: 'Sala', emoji: '🛋️', defaultW: 130, defaultH: 110, bg: 'bg-amber-50/90', border: 'border-amber-400' },
  { type: 'room', id: 'cocina', name: 'Cocina', emoji: '🍳', defaultW: 110, defaultH: 95, bg: 'bg-orange-50/90', border: 'border-orange-400' },
  { type: 'room', id: 'dormitorio', name: 'Dormitorio', emoji: '🛏️', defaultW: 120, defaultH: 110, bg: 'bg-blue-50/90', border: 'border-blue-400' },
  { type: 'room', id: 'bano', name: 'Baño', emoji: '🚿', defaultW: 85, defaultH: 80, bg: 'bg-cyan-50/90', border: 'border-cyan-400' },
  { type: 'room', id: 'estudio', name: 'Estudio', emoji: '💻', defaultW: 110, defaultH: 95, bg: 'bg-purple-50/90', border: 'border-purple-400' },
  { type: 'room', id: 'comedor', name: 'Comedor', emoji: '🪑', defaultW: 120, defaultH: 100, bg: 'bg-emerald-50/90', border: 'border-emerald-400' },
  { type: 'device', id: 'router', name: 'Router WIN', emoji: '📶', defaultW: 80, defaultH: 80, bg: 'bg-[#ff5500]/10', border: 'border-[#ff5500]' },
  { type: 'device', id: 'repetidor', name: 'Repetidor Mesh', emoji: '📡', defaultW: 75, defaultH: 75, bg: 'bg-slate-100', border: 'border-slate-400' },
];

export default function Paso4Plano() {
  const navigate = useNavigate();
  const { houseWidth, houseLength, placedElements, setPlacedElements } = useSimulator();

  const [activeTab, setActiveTab] = useState('habitaciones');
  const [selectedId, setSelectedId] = useState(null);

  const canvasRef = useRef(null);
  const dragItemRef = useRef(null); // Type being dragged from palette
  const activeInteractionRef = useRef(null); // { type: 'move'|'resize', id, startX, startY, origX, origY, origW, origH, corner }

  // Safe fallback measurements from Paso 3
  const widthM = houseWidth && houseWidth > 0 ? houseWidth : 10;
  const lengthM = houseLength && houseLength > 0 ? houseLength : 15;

  // Calculate proportional canvas dimensions (max canvas width ~ 640px)
  const maxCanvasW = 600;
  const maxCanvasH = 430;
  const aspectRatio = widthM / lengthM; // width / length

  let canvasW = maxCanvasW;
  let canvasH = maxCanvasW / aspectRatio;
  if (canvasH > maxCanvasH) {
    canvasH = maxCanvasH;
    canvasW = maxCanvasH * aspectRatio;
  }

  // --- Drag from Palette to Canvas ---
  const handleDragStartFromPalette = (item) => {
    dragItemRef.current = item;
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (!dragItemRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const item = dragItemRef.current;
    const newW = item.defaultW;
    const newH = item.defaultH;

    const clampedX = Math.max(0, Math.min(canvasW - newW, dropX - newW / 2));
    const clampedY = Math.max(0, Math.min(canvasH - newH, dropY - newH / 2));

    const newElement = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      type: item.type,
      bg: item.bg,
      border: item.border,
      x: clampedX,
      y: clampedY,
      w: newW,
      h: newH,
    };

    setPlacedElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
    dragItemRef.current = null;
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  // Add click to quickly place element in center
  const handleQuickAdd = (item) => {
    const newW = item.defaultW;
    const newH = item.defaultH;
    const newElement = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      type: item.type,
      bg: item.bg,
      border: item.border,
      x: Math.max(10, (canvasW - newW) / 2 + (Math.random() * 40 - 20)),
      y: Math.max(10, (canvasH - newH) / 2 + (Math.random() * 40 - 20)),
      w: newW,
      h: newH,
    };
    setPlacedElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  // --- Element Move & Corner Resizing Handlers ---
  const handleMouseDown = (e, element, actionType, corner = null) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(element.id);

    activeInteractionRef.current = {
      type: actionType, // 'move' | 'resize'
      id: element.id,
      corner: corner,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.w,
      origH: element.h,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const inter = activeInteractionRef.current;
    if (!inter) return;

    const dx = e.clientX - inter.startX;
    const dy = e.clientY - inter.startY;

    setPlacedElements((prev) =>
      prev.map((el) => {
        if (el.id !== inter.id) return el;

        if (inter.type === 'move') {
          const newX = Math.max(0, Math.min(canvasW - el.w, inter.origX + dx));
          const newY = Math.max(0, Math.min(canvasH - el.h, inter.origY + dy));
          return { ...el, x: newX, y: newY };
        }

        if (inter.type === 'resize') {
          let newX = inter.origX;
          let newY = inter.origY;
          let newW = inter.origW;
          let newH = inter.origH;
          const minSize = 45;

          if (inter.corner === 'se') {
            // Can grow to the right and bottom up to canvas limits
            newW = Math.max(minSize, Math.min(canvasW - inter.origX, inter.origW + dx));
            newH = Math.max(minSize, Math.min(canvasH - inter.origY, inter.origH + dy));
          } else if (inter.corner === 'sw') {
            // Can grow left down to 0, and bottom down to canvasH
            const maxAllowedW = inter.origX + inter.origW; // left boundary is 0
            const proposedW = Math.max(minSize, Math.min(maxAllowedW, inter.origW - dx));
            newX = inter.origX + (inter.origW - proposedW);
            newW = proposedW;
            newH = Math.max(minSize, Math.min(canvasH - inter.origY, inter.origH + dy));
          } else if (inter.corner === 'ne') {
            // Can grow top down to 0, and right up to canvasW
            const maxAllowedH = inter.origY + inter.origH; // top boundary is 0
            const proposedH = Math.max(minSize, Math.min(maxAllowedH, inter.origH - dy));
            newY = inter.origY + (inter.origH - proposedH);
            newW = Math.max(minSize, Math.min(canvasW - inter.origX, inter.origW + dx));
            newH = proposedH;
          } else if (inter.corner === 'nw') {
            // Can grow left and top down to 0
            const maxAllowedW = inter.origX + inter.origW;
            const maxAllowedH = inter.origY + inter.origH;
            const proposedW = Math.max(minSize, Math.min(maxAllowedW, inter.origW - dx));
            const proposedH = Math.max(minSize, Math.min(maxAllowedH, inter.origH - dy));
            newX = inter.origX + (inter.origW - proposedW);
            newY = inter.origY + (inter.origH - proposedH);
            newW = proposedW;
            newH = proposedH;
          }

          // Safety clamp within canvas
          newX = Math.max(0, Math.min(canvasW - minSize, newX));
          newY = Math.max(0, Math.min(canvasH - minSize, newY));
          newW = Math.min(canvasW - newX, Math.max(minSize, newW));
          newH = Math.min(canvasH - newY, Math.max(minSize, newH));

          return { ...el, x: newX, y: newY, w: newW, h: newH };
        }

        return el;
      })
    );
  };

  const handleMouseUp = () => {
    activeInteractionRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setPlacedElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleClearAll = () => {
    setPlacedElements([]);
    setSelectedId(null);
  };

  // --- Overlap Detection between components ---
  const checkOverlap = (el1, el2) => {
    return (
      el1.x < el2.x + el2.w &&
      el1.x + el1.w > el2.x &&
      el1.y < el2.y + el2.h &&
      el1.y + el1.h > el2.y
    );
  };

  // Set of element IDs that are currently overlapping another element
  const overlappingIds = new Set();
  for (let i = 0; i < placedElements.length; i++) {
    for (let j = i + 1; j < placedElements.length; j++) {
      if (checkOverlap(placedElements[i], placedElements[j])) {
        overlappingIds.add(placedElements[i].id);
        overlappingIds.add(placedElements[j].id);
      }
    }
  }

  const hasOverlaps = overlappingIds.size > 0;

  const filteredPalette = AVAILABLE_ITEMS.filter((item) =>
    activeTab === 'habitaciones' ? item.type === 'room' : item.type === 'device'
  );

  return (
    <article className="step-view flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-2 sm:px-4 py-2" id="step-view-4">
      <div>
        {/* Step Indicator Header matching WIN design system */}
        <div className="flex items-center space-x-3 mb-5">
          <span className="w-9 h-9 rounded-full bg-[#ff5500] text-white font-extrabold flex items-center justify-center text-base shadow-sm">
            4
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Diseño del plano + elementos para colocar
          </h1>
        </div>

        {/* Overlap Warning Banner */}
        {hasOverlaps && (
          <div className="mb-4 bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  ¡Atención! Hay componentes superpuestos en el plano
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Dos o más habitaciones o dispositivos están ocupando el mismo espacio. Por favor, arrastra o redimensiona los elementos marcados en rojo para separarlos.
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full">
              {overlappingIds.size} superpuestos
            </span>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Plano interactivo a escala
              </h2>
              <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                Arrastra los ambientes o dispositivos al plano. Haz clic en uno para redimensionarlo desde las 4 esquinas.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {selectedId && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-full text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>Eliminar selección 🗑️</span>
                </button>
              )}
              {placedElements.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-full text-xs transition cursor-pointer"
                >
                  Limpiar plano
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Scaled Blueprint Canvas with measurements */}
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
                  onDrop={handleCanvasDrop}
                  onDragOver={handleCanvasDragOver}
                  onClick={(e) => {
                    // Only clear selection if clicking directly on the canvas background
                    if (e.target === e.currentTarget) {
                      setSelectedId(null);
                    }
                  }}
                  style={{
                    width: `${canvasW}px`,
                    height: `${canvasH}px`,
                  }}
                  className={`relative rounded-2xl border-2 border-dashed ${
                    hasOverlaps ? 'border-amber-400 bg-amber-50/10' : 'border-[#ff5500]/70 bg-white'
                  } grid-pattern shadow-inner overflow-hidden flex-shrink-0 cursor-crosshair`}
                >
                  {/* Empty state hint */}
                  {placedElements.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none opacity-60">
                      <span className="text-4xl mb-2">📐</span>
                      <p className="font-bold text-slate-700 text-sm">
                        Arrastra aquí las habitaciones desde la derecha
                      </p>
                      <span className="text-xs text-slate-400 mt-1">
                        Área total: {widthM * lengthM} m²
                      </span>
                    </div>
                  )}

                  {/* Placed Interactive Elements */}
                  {placedElements.map((el) => {
                    const isSel = el.id === selectedId;
                    const isOverlapping = overlappingIds.has(el.id);

                    return (
                      <div
                        key={el.id}
                        onMouseDown={(e) => handleMouseDown(e, el, 'move')}
                        style={{
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          width: `${el.w}px`,
                          height: `${el.h}px`,
                        }}
                        className={`absolute rounded-xl border-2 flex flex-col justify-between p-2 cursor-grab active:cursor-grabbing transition-shadow select-none ${
                          isOverlapping
                            ? 'border-rose-500 bg-rose-50/90 shadow-md ring-2 ring-rose-400'
                            : `${el.bg} ${el.border}`
                        } ${
                          isSel
                            ? 'ring-3 ring-[#ff5500] ring-offset-1 shadow-xl z-30'
                            : 'shadow-sm hover:shadow-md z-10'
                        }`}
                      >
                        {/* Element Title & Emoji */}
                        <div className="flex items-center justify-between pointer-events-none">
                          <span className="font-extrabold text-xs text-slate-800 tracking-tight truncate flex items-center space-x-1">
                            {isOverlapping && <span className="text-rose-600 font-black">⚠️</span>}
                            <span>{el.emoji} {el.name}</span>
                          </span>
                          {el.type === 'device' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                        </div>

                        {/* Element Center Indicator */}
                        <div className="my-auto flex items-center justify-center pointer-events-none">
                          {isOverlapping ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                              Superpuesto
                            </span>
                          ) : el.type === 'device' ? (
                            <div className="w-8 h-8 rounded-full bg-[#ff5500]/20 flex items-center justify-center">
                              <span className="text-lg">📡</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500">
                              {Math.round((el.w / canvasW) * widthM)}x{Math.round((el.h / canvasH) * lengthM)}m
                            </span>
                          )}
                        </div>

                        {/* Resize Handles on 4 Corners when selected */}
                        {isSel && (
                          <>
                            {/* Top Left */}
                            <div
                              onMouseDown={(e) => handleMouseDown(e, el, 'resize', 'nw')}
                              className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#ff5500] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-40 flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 bg-[#ff5500] rounded-full"></div>
                            </div>
                            {/* Top Right */}
                            <div
                              onMouseDown={(e) => handleMouseDown(e, el, 'resize', 'ne')}
                              className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#ff5500] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-40 flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 bg-[#ff5500] rounded-full"></div>
                            </div>
                            {/* Bottom Left */}
                            <div
                              onMouseDown={(e) => handleMouseDown(e, el, 'resize', 'sw')}
                              className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-[#ff5500] rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-40 flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 bg-[#ff5500] rounded-full"></div>
                            </div>
                            {/* Bottom Right */}
                            <div
                              onMouseDown={(e) => handleMouseDown(e, el, 'resize', 'se')}
                              className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#ff5500] rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-40 flex items-center justify-center"
                            >
                              <div className="w-1.5 h-1.5 bg-[#ff5500] rounded-full"></div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500">
                <span className="font-semibold">💡 Tip:</span>
                <span>Haz clic en un ambiente y arrastra sus esquinas para agrandarlo o achicarlo.</span>
              </div>
            </div>

            {/* Right: Draggable Elements Palette */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Elementos disponibles</h3>
                <span className="text-[11px] text-slate-400 font-semibold">Arrastra o clic</span>
              </div>

              {/* Palette Tabs */}
              <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-bold mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('habitaciones')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                    activeTab === 'habitaciones'
                      ? 'bg-white text-[#ff5500] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Habitaciones
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dispositivos')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
                    activeTab === 'dispositivos'
                      ? 'bg-white text-[#ff5500] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dispositivos
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {filteredPalette.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStartFromPalette(item)}
                    onClick={() => handleQuickAdd(item)}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 hover:border-[#ff5500] hover:shadow-md flex flex-col items-center text-center cursor-grab active:cursor-grabbing transition-all group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">+ Agregar</span>
                  </div>
                ))}
              </div>

              {/* Quick Instructions Badge */}
              <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-600">
                <span className="text-sm">✨</span>
                <p className="leading-snug">
                  Coloca al menos tu <b>Sala</b> y tu <b>Router WIN</b> para simular la cobertura en el siguiente paso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-8 pb-4">
        <button
          type="button"
          onClick={() => navigate('/paso-3')}
          className="px-7 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 font-bold rounded-full transition cursor-pointer text-sm"
        >
          Atrás
        </button>

        <div className="flex items-center space-x-3">
          {hasOverlaps && (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              Separa los componentes superpuestos para continuar
            </span>
          )}
          <button
            type="button"
            disabled={hasOverlaps}
            onClick={() => {
              if (hasOverlaps) return;
              navigate('/paso-5');
            }}
            className={`inline-flex items-center space-x-2 px-9 py-3.5 font-bold rounded-full shadow-lg transition duration-200 text-base group ${
              hasOverlaps
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#ff5500] hover:bg-[#e64d00] active:scale-[0.98] text-white shadow-[#ff5500]/25 cursor-pointer'
            }`}
          >
            <span>Continuar con diseño</span>
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
      </div>
    </article>
  );
}

