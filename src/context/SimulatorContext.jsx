import React, { createContext, useContext, useState } from 'react';

const SimulatorContext = createContext();

const initialFloorData = {
  'Primer piso': { elements: [], walls: [] },
  'Segundo piso': { elements: [], walls: [] },
  'Tercer piso': { elements: [], walls: [] },
  'Cuarto piso': { elements: [], walls: [] },
};

export function SimulatorProvider({ children }) {
  const [selectedFloors, setSelectedFloors] = useState('2');
  const [houseWidth, setHouseWidth] = useState(10);
  const [houseLength, setHouseLength] = useState(15);
  const [currentFloorView, setCurrentFloorView] = useState('Primer piso');
  const [floorData, setFloorData] = useState(initialFloorData);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

  // Access point survey state
  const [hasAccessPoint, setHasAccessPoint] = useState(null); // null | 'yes' | 'no'
  const [accessPointRoomId, setAccessPointRoomId] = useState('');

  const unlockUpTo = (step) => {
    setMaxUnlockedStep((prev) => Math.max(prev, step));
  };

  // Safe accessor for current floor's elements
  const currentElements = floorData[currentFloorView]?.elements || [];
  const currentWalls = floorData[currentFloorView]?.walls || [];

  const setPlacedElements = (updater) => {
    setFloorData((prev) => {
      const activeFloor = currentFloorView;
      const prevElements = prev[activeFloor]?.elements || [];
      const newElements = typeof updater === 'function' ? updater(prevElements) : updater;
      return {
        ...prev,
        [activeFloor]: {
          ...(prev[activeFloor] || { walls: [] }),
          elements: newElements,
        },
      };
    });
  };

  const setPlacedWalls = (updater) => {
    setFloorData((prev) => {
      const activeFloor = currentFloorView;
      const prevWalls = prev[activeFloor]?.walls || [];
      const newWalls = typeof updater === 'function' ? updater(prevWalls) : updater;
      return {
        ...prev,
        [activeFloor]: {
          ...(prev[activeFloor] || { elements: [] }),
          walls: newWalls,
        },
      };
    });
  };

  // Clear current floor completely
  const clearCurrentFloor = () => {
    setFloorData((prev) => ({
      ...prev,
      [currentFloorView]: { elements: [], walls: [] },
    }));
  };

  // Clear walls and devices only, preserving rooms if wanted
  const clearCurrentFloorWallsAndDevices = () => {
    setFloorData((prev) => {
      const activeFloor = currentFloorView;
      const currentList = prev[activeFloor]?.elements || [];
      return {
        ...prev,
        [activeFloor]: {
          elements: currentList.filter((el) => el.type === 'room'),
          walls: [],
        },
      };
    });
  };

  // Available floors based on selectedFloors
  const getAvailableFloors = () => {
    if (selectedFloors === '1') return ['Primer piso'];
    if (selectedFloors === '2') return ['Primer piso', 'Segundo piso'];
    if (selectedFloors === '3') return ['Primer piso', 'Segundo piso', 'Tercer piso'];
    return ['Primer piso', 'Segundo piso', 'Tercer piso', 'Cuarto piso'];
  };

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
        floorData,
        setFloorData,
        placedElements: currentElements,
        setPlacedElements,
        placedWalls: currentWalls,
        setPlacedWalls,
        clearCurrentFloor,
        clearCurrentFloorWallsAndDevices,
        getAvailableFloors,
        hasAccessPoint,
        setHasAccessPoint,
        accessPointRoomId,
        setAccessPointRoomId,
        maxUnlockedStep,
        setMaxUnlockedStep,
        unlockUpTo,
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
