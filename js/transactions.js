/**
 * CRUD de lançamentos (entradas, saídas e transferências), sempre mantendo
 * os saldos dos cofres consistentes (aplica/reverte efeito nos cofres).
 */
(function (global) {
  'use strict';

  const { uid } = global.CofresApp.storage;
  const vaultsApi = global.CofresApp.vaults;
  const { todayISO } = global.CofresApp.util;

  function applyEffect(state, tx) {
    if (tx.type === 'entrada') {
      tx.splits = vaultsApi.applyIncomeSplit(state, tx.amountCents);
    } else if (tx.type === 'saida') {
      vaultsApi.applyExpense(state, tx.vaultId, tx.amountCents);
    } else if (tx.type === 'transferencia') {
      vaultsApi.applyTransfer(state, tx.fromVaultId, tx.toVaultId, tx.amountCents);
    } else {
      throw new Error('Tipo de lançamento desconhecido: ' + tx.type);
    }
  }

  function reverseEffect(state, tx) {
    if (tx.type === 'entrada') {
      vaultsApi.reverseIncomeSplit(state, tx.splits);
    } else if (tx.type === 'saida') {
      vaultsApi.reverseExpense(state, tx.vaultId, tx.amountCents);
    } else if (tx.type === 'transferencia') {
      vaultsApi.reverseTransfer(state, tx.fromVaultId, tx.toVaultId, tx.amountCents);
    }
  }

  function validateCommon({ amountCents, date }) {
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      throw new Error('Informe um valor válido, maior que zero.');
    }
    if (!date) throw new Error('Informe uma data.');
  }

  function addIncome(state, { amountCents, date, description, category }) {
    validateCommon({ amountCents, date });
    const tx = {
      id: uid(),
      type: 'entrada',
      amountCents,
      date,
      description: description || 'Entrada',
      category: category || 'Renda',
      createdAt: new Date().toISOString(),
    };
    applyEffect(state, tx);
    state.transactions.push(tx);
    return tx;
  }

  function addExpense(state, { amountCents, date, description, category, vaultId }) {
    validateCommon({ amountCents, date });
    if (!vaultId) throw new Error('Selecione de qual cofre sai o valor.');
    const tx = {
      id: uid(),
      type: 'saida',
      amountCents,
      date,
      description: description || 'Saída',
      category: category || 'Outros',
      vaultId,
      createdAt: new Date().toISOString(),
    };
    applyEffect(state, tx);
    state.transactions.push(tx);
    return tx;
  }

  function addTransfer(state, { amountCents, date, description, fromVaultId, toVaultId }) {
    validateCommon({ amountCents, date });
    if (!fromVaultId || !toVaultId) throw new Error('Selecione os cofres de origem e destino.');
    if (fromVaultId === toVaultId) throw new Error('Escolha cofres diferentes para a transferência.');
    const tx = {
      id: uid(),
      type: 'transferencia',
      amountCents,
      date,
      description: description || 'Transferência entre cofres',
      category: 'Transferência',
      fromVaultId,
      toVaultId,
      createdAt: new Date().toISOString(),
    };
    applyEffect(state, tx);
    state.transactions.push(tx);
    return tx;
  }

  function deleteTransaction(state, txId) {
    const idx = state.transactions.findIndex((t) => t.id === txId);
    if (idx === -1) return false;
    reverseEffect(state, state.transactions[idx]);
    state.transactions.splice(idx, 1);
    return true;
  }

  /** patch pode conter: amountCents, date, description, category, vaultId, fromVaultId, toVaultId */
  function updateTransaction(state, txId, patch) {
    const tx = state.transactions.find((t) => t.id === txId);
    if (!tx) throw new Error('Lançamento não encontrado.');
    reverseEffect(state, tx);
    Object.assign(tx, patch);
    tx.updatedAt = new Date().toISOString();
    validateCommon(tx);
    applyEffect(state, tx);
    return tx;
  }

  function listTransactions(state, filters) {
    filters = filters || {};
    let list = state.transactions.slice();
    if (filters.type) list = list.filter((t) => t.type === filters.type);
    if (filters.vaultId) {
      list = list.filter(
        (t) => t.vaultId === filters.vaultId || t.fromVaultId === filters.vaultId || t.toVaultId === filters.vaultId
      );
    }
    if (filters.category) list = list.filter((t) => t.category === filters.category);
    if (filters.dateFrom) list = list.filter((t) => t.date >= filters.dateFrom);
    if (filters.dateTo) list = list.filter((t) => t.date <= filters.dateTo);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => (t.description || '').toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    return list;
  }

  function categoriesUsed(state) {
    const set = new Set();
    state.transactions.forEach((t) => t.category && set.add(t.category));
    return Array.from(set).sort();
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.transactions = {
    addIncome,
    addExpense,
    addTransfer,
    deleteTransaction,
    updateTransaction,
    listTransactions,
    categoriesUsed,
  };
})(window);
