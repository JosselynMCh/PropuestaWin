import React, { createContext, useContext, useState } from 'react';

const SimulatorContext = createContext();

export function SimulatorProvider({ children }) {
  const [selectedFloors, setSelectedFloors] = useState('2');
  const [houseWidth, setHouseWidth] = useState(10);
  const [houseLength, setHouseLength] = useState(15);
  const [currentFloorView, setCurrentFloorView] = useState('Primer piso');
  const [placedElements, setPlacedElements] = useState([]);

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
