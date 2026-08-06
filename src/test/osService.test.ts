import { describe, it, expect, beforeEach } from 'vitest';
import { osService } from '@/services/osService';
import { calculateWarrantyDate } from '@/lib/utils';

describe('osService - Autenticação, Persistência e Multitenancy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve retornar null em getActiveUser quando nenhum usuário estiver logado', () => {
    const user = osService.getActiveUser();
    expect(user).toBeNull();
  });

  it('deve cadastrar uma nova oficina e persistir o usuário e a oficina no localStorage', async () => {
    const data = {
      nome: 'Auto Mecânica Express',
      whatsapp: '5511911112222',
      nomeResponsavel: 'Fernando Souza',
      email: 'contato@express.com',
      senha: 'minhasenha123',
      cidade: 'Campinas - SP',
    };

    const result = await osService.registerNewOficina(data);

    expect(result.oficina.nome).toBe('Auto Mecânica Express');
    expect(result.user.email).toBe('contato@express.com');

    // Verifica se persistiu a sessão ativa
    const activeUser = osService.getActiveUser();
    expect(activeUser).not.toBeNull();
    expect(activeUser?.email).toBe('contato@express.com');

    const activeOficina = osService.getActiveOficina();
    expect(activeOficina.nome).toBe('Auto Mecânica Express');
  });

  it('deve manter a sessão da oficina cadastrada após simular um F5 / recarga da página', async () => {
    // 1. Cadastra nova oficina
    await osService.registerNewOficina({
      nome: 'Oficina Turbo HP',
      whatsapp: '5511933334444',
      nomeResponsavel: 'Lucas Silva',
      email: 'lucas@turbohp.com',
      senha: 'senhaforte123',
    });

    // 2. Simula o F5 recarregando do localStorage
    const userAfterF5 = osService.getActiveUser();
    const oficinaAfterF5 = osService.getActiveOficina();

    expect(userAfterF5).not.toBeNull();
    expect(userAfterF5?.email).toBe('lucas@turbohp.com');
    expect(oficinaAfterF5.nome).toBe('Oficina Turbo HP');
  });

  it('deve permitir realizar login com a oficina recém-cadastrada após logout', async () => {
    // 1. Cadastra oficina
    await osService.registerNewOficina({
      nome: 'Mecânica Centro',
      whatsapp: '5511944445555',
      nomeResponsavel: 'Ana Maria',
      email: 'ana@mecanicacentro.com',
      senha: 'senha12345',
    });

    // 2. Desloga
    osService.logoutUser();
    expect(osService.getActiveUser()).toBeNull();

    // 3. Tenta login com credencial incorreta
    const failLogin = await osService.loginUser({
      email: 'ana@mecanicacentro.com',
      senha: 'errada',
    });
    expect(failLogin.success).toBe(false);
    expect(osService.getActiveUser()).toBeNull();

    // 4. Efetua login com sucesso
    const successLogin = await osService.loginUser({
      email: 'ana@mecanicacentro.com',
      senha: 'senha12345',
    });
    expect(successLogin.success).toBe(true);

    const activeUser = osService.getActiveUser();
    expect(activeUser?.email).toBe('ana@mecanicacentro.com');
  });

  it('deve isolar estritamente os dados da oficina ativa (Multitenancy RF-01)', async () => {
    // Cadastra Oficina 1
    const { oficina: of1 } = await osService.registerNewOficina({
      nome: 'Oficina Alfa',
      whatsapp: '5511911111111',
      nomeResponsavel: 'Admin Alfa',
      email: 'alfa@oficina.com',
      senha: 'senha12345',
    });

    // Cria uma OS na Oficina 1
    osService.saveOS({
      defeito_relatado: 'Freio barulhento',
      valor_total: 300,
    });

    const osListAlfa = osService.getOSList();
    expect(osListAlfa.length).toBeGreaterThan(0);
    expect(osListAlfa.every((os) => os.oficina_id === of1.id)).toBe(true);

    // Cadastra Oficina 2
    const { oficina: of2 } = await osService.registerNewOficina({
      nome: 'Oficina Beta',
      whatsapp: '5511922222222',
      nomeResponsavel: 'Admin Beta',
      email: 'beta@oficina.com',
      senha: 'senha12345',
    });

    // A Oficina Beta não deve ver as OSs da Oficina Alfa
    const osListBeta = osService.getOSList();
    expect(osListBeta.filter((os) => os.oficina_id === of1.id).length).toBe(0);
  });

  it('deve calcular corretamente a garantia legal de 90 dias (RN-04 / RF-12)', () => {
    const dataInicial = '2026-08-01T10:00:00.000Z';
    const dataGarantia = calculateWarrantyDate(dataInicial, 90);
    
    // 90 dias após 01/08/2026 é 30/10/2026
    expect(dataGarantia).toBe('2026-10-30');
  });
});
