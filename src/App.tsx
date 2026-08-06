import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { OSWizard } from '@/pages/OSWizard';
import { OSDetails } from '@/pages/OSDetails';
import { ClientesPage } from '@/pages/ClientesPage';
import { EstoquePage } from '@/pages/EstoquePage';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/patio"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/os/nova"
          element={
            <ProtectedRoute>
              <OSWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/os/:id"
          element={
            <ProtectedRoute>
              <OSDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <ClientesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estoque"
          element={
            <ProtectedRoute>
              <EstoquePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
