import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SimulatorProvider } from './context/SimulatorContext';
import Layout from './components/Layout';
import Principal from './pages/Principal';
import Paso2Pisos from './pages/Paso2Pisos';
import Paso3Medidas from './pages/Paso3Medidas';
import Paso4Plano from './pages/Paso4Plano';
import Paso5DisenoRouter from './pages/Paso5DisenoRouter';
import Paso6Cobertura from './pages/Paso6Cobertura';
import Paso7AjustaSimula from './pages/Paso7AjustaSimula';
import Paso8Diagnostico from './pages/Paso8Diagnostico';
import Paso9RegistroCierre from './pages/Paso9RegistroCierre';

export default function App() {
  return (
    <SimulatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Principal />} />
            <Route path="principal" element={<Navigate to="/" replace />} />
            <Route path="paso-2" element={<Paso2Pisos />} />
            <Route path="paso-3" element={<Paso3Medidas />} />
            <Route path="paso-4" element={<Paso4Plano />} />
            <Route path="paso-5" element={<Paso5DisenoRouter />} />
            <Route path="paso-6" element={<Paso6Cobertura />} />
            <Route path="paso-7" element={<Paso7AjustaSimula />} />
            <Route path="paso-8" element={<Paso8Diagnostico />} />
            <Route path="paso-9" element={<Paso9RegistroCierre />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SimulatorProvider>
  );
}
