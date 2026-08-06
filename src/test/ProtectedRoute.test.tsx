import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { osService } from '@/services/osService';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve redirecionar para a landing page (/) quando o usuário não estiver logado', () => {
    render(
      <MemoryRouter initialEntries={['/patio']}>
        <Routes>
          <Route path="/" element={<div>Página Inicial / Landing Page</div>} />
          <Route
            path="/patio"
            element={
              <ProtectedRoute>
                <div>Conteúdo Protegido do Pátio</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página Inicial / Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Protegido do Pátio')).not.toBeInTheDocument();
  });

  it('deve permitir acesso ao conteúdo protegido quando o usuário estiver logado', async () => {
    await osService.registerNewOficina({
      nome: 'Oficina Teste',
      whatsapp: '5511999998888',
      nomeResponsavel: 'João',
      email: 'joao@teste.com',
      senha: '123456',
    });

    render(
      <MemoryRouter initialEntries={['/patio']}>
        <Routes>
          <Route path="/" element={<div>Página Inicial / Landing Page</div>} />
          <Route
            path="/patio"
            element={
              <ProtectedRoute>
                <div>Conteúdo Protegido do Pátio</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo Protegido do Pátio')).toBeInTheDocument();
  });
});
