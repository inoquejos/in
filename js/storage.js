/**
 * Camada de persistência local (100% offline, sem servidor).
 * Guarda tudo em localStorage como um único blob JSON.
 * Valores monetários são sempre inteiros em CENTAVOS para evitar erros de ponto flutuante.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'cofres:v1';
  const SCHEMA_VERSION = 1;

  function uid() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  function defaultVaults() {
    return [
      {
        id: 'despesas',
        name: 'Despesas',
        percent: 50,
        balanceCents: 0,
        color: '#EF6C61',
        icon: '🧾',
        description: 'Contas e custos do dia a dia',
      },
      {
        id: 'investimentos',
        name: 'Investimentos',
        percent: 20,
        balanceCents: 0,
        color: '#4C9F70',
        icon: '📈',
        description: 'Construção de patrimônio',
      },
      {
        id: 'dizimo',
        name: 'Dízimo',
        percent: 10,
        balanceCents: 0,
        color: '#C9A227',
        icon: '🙏',
        description: 'Dízimo / contribuição',
      },
      {
        id: 'social',
        name: 'Responsabilidade Social',
        percent: 10,
        balanceCents: 0,
        color: '#4A7FC1',
        icon: '🤝',
        description: 'Doações e causas sociais',
      },
      {
        id: 'emergencia',
        name: 'Fundo de Emergência',
        percent: 10,
        balanceCents: 0,
        color: '#8B5FBF',
        icon: '🛟',
        description: 'Reserva para imprevistos',
      },
    ];
  }

  function defaultState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      vaults: defaultVaults(),
      transactions: [],
      settings: {
        currency: 'BRL',
        createdAt: new Date().toISOString(),
      },
    };
  }

  function isStorageAvailable() {
    try {
      const k = '__cofres_test__';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  let memoryFallback = null; // usado se localStorage não estiver disponível (ex: modo privado restrito)

  function loadState() {
    if (!isStorageAvailable()) {
      memoryFallback = memoryFallback || defaultState();
      return memoryFallback;
    }
    const raw = global.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = defaultState();
      saveState(fresh);
      return fresh;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.vaults || !parsed.transactions) throw new Error('estrutura inválida');
      return parsed;
    } catch (e) {
      console.error('Falha ao ler dados salvos, iniciando estado novo.', e);
      const fresh = defaultState();
      saveState(fresh);
      return fresh;
    }
  }

  function saveState(state) {
    if (!isStorageAvailable()) {
      memoryFallback = state;
      return;
    }
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function exportBackup(state) {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        app: 'cofres',
        ...state,
      },
      null,
      2
    );
  }

  function importBackup(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.vaults) || !Array.isArray(parsed.transactions)) {
      throw new Error('Arquivo de backup inválido: faltam cofres ou lançamentos.');
    }
    const state = {
      schemaVersion: parsed.schemaVersion || SCHEMA_VERSION,
      vaults: parsed.vaults,
      transactions: parsed.transactions,
      settings: parsed.settings || { currency: 'BRL', createdAt: new Date().toISOString() },
    };
    saveState(state);
    return state;
  }

  function resetAll() {
    const fresh = defaultState();
    saveState(fresh);
    return fresh;
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.storage = {
    STORAGE_KEY,
    uid,
    defaultVaults,
    defaultState,
    loadState,
    saveState,
    exportBackup,
    importBackup,
    resetAll,
  };
})(window);
