import React, { createContext, useContext, useState } from 'react';

const SimulatorContext = createContext();

export function SimulatorProvider({ children }) {
  const [selectedFloors, setSelectedFloors] = useState('2');
  const [houseWidth, setHouseWidth] = useState(10);
  const [houseLength, setHouseLength] = useState(15);
  const [currentFloorView, setCurrentFloorView] = useState('Primer piso');
  const [placedElements, setPlacedElements] = useState([]);
  const [placedWalls, setPlacedWalls] = useState([]); // [{ id, x, y, w, h, orientation: 'horizontal'|'vertical', type: 'concreto'|'drywall'|'vidrio' }]

  return (
    <SimulatorContext.Provider
      value={{
        selectedFloors,
        setSelectedFloors,
        houseWidth,
        setHouseWidth,
        houseLength,
        setHouseLength,
        currentFloorView,
        setCurrentFloorView,
        placedElements,
        setPlacedElements,
        placedWalls,
        setPlacedWalls,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}
