import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { OSWizard } from '@/pages/OSWizard';
import { OSDetails } from '@/pages/OSDetails';
import { ClientesPage } from '@/pages/ClientesPage';
import { EstoquePage } from '@/pages/EstoquePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patio" element={<Dashboard />} />
        <Route path="/os/nova" element={<OSWizard />} />
        <Route path="/os/:id" element={<OSDetails />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
