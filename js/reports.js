/**
 * Agregações para relatórios (resumo mensal, extrato, tendência) e exportação em CSV.
 */
(function (global) {
  'use strict';

  const { monthKey, monthLabel, escapeCSV, centsToBRL, formatDateBR } = global.CofresApp.util;

  function monthsAvailable(state) {
    const set = new Set(state.transactions.map((t) => monthKey(t.date)));
    set.add(monthKey(new Date().toISOString().slice(0, 10)));
    return Array.from(set).sort().reverse();
  }

  function vaultLabel(state, vaultId) {
    const v = state.vaults.find((x) => x.id === vaultId);
    return v ? v.name : vaultId;
  }

  function monthlySummary(state, targetMonthKey) {
    const txs = state.transactions.filter((t) => monthKey(t.date) === targetMonthKey);
    let incomeCents = 0;
    let expenseCents = 0;
    const byVault = {};
    const byCategory = {};

    state.vaults.forEach((v) => {
      byVault[v.id] = { name: v.name, color: v.color, inCents: 0, outCents: 0 };
    });

    txs.forEach((t) => {
      if (t.type === 'entrada') {
        incomeCents += t.amountCents;
        (t.splits || []).forEach((s) => {
          if (byVault[s.vaultId]) byVault[s.vaultId].inCents += s.cents;
        });
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amountCents;
      } else if (t.type === 'saida') {
        expenseCents += t.amountCents;
        if (byVault[t.vaultId]) byVault[t.vaultId].outCents += t.amountCents;
        const key = t.category || 'Outros';
        byCategory[key] = (byCategory[key] || 0) - t.amountCents;
      }
      // transferências não entram no resumo de entrada/saída (são movimentação interna)
    });

    return {
      monthKey: targetMonthKey,
      label: monthLabel(targetMonthKey),
      incomeCents,
      expenseCents,
      netCents: incomeCents - expenseCents,
      byVault,
      byCategory,
      transactionCount: txs.length,
    };
  }

  /** Últimos n meses (mais antigo -> mais recente), pra gráfico de tendência. */
  function monthlyTrend(state, n) {
    n = n || 6;
    const now = new Date();
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(key);
    }
    return months.map((key) => {
      const s = monthlySummary(state, key);
      return { monthKey: key, label: monthLabel(key), incomeCents: s.incomeCents, expenseCents: s.expenseCents };
    });
  }

  function vaultDistribution(state) {
    const total = state.vaults.reduce((acc, v) => acc + Math.max(0, v.balanceCents), 0);
    return state.vaults.map((v) => ({
      id: v.id,
      name: v.name,
      color: v.color,
      icon: v.icon,
      percent: v.percent,
      balanceCents: v.balanceCents,
      shareOfTotal: total > 0 ? Math.max(0, v.balanceCents) / total : 0,
    }));
  }

  function transactionsToCSV(state, txs) {
    const header = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Cofre', 'Valor (R$)'];
    const rows = txs.map((t) => {
      let vaultCol = '';
      if (t.type === 'saida') vaultCol = vaultLabel(state, t.vaultId);
      else if (t.type === 'transferencia') vaultCol = `${vaultLabel(state, t.fromVaultId)} → ${vaultLabel(state, t.toVaultId)}`;
      else if (t.type === 'entrada') vaultCol = (t.splits || []).map((s) => vaultLabel(state, s.vaultId)).join(' + ');

      const tipoLabel = t.type === 'entrada' ? 'Entrada' : t.type === 'saida' ? 'Saída' : 'Transferência';
      const sinal = t.type === 'saida' ? -1 : 1;
      const valor = ((t.amountCents * sinal) / 100).toFixed(2).replace('.', ',');

      return [formatDateBR(t.date), tipoLabel, t.description, t.category, vaultCol, valor];
    });
    const lines = [header, ...rows].map((row) => row.map(escapeCSV).join(';'));
    return '﻿' + lines.join('\r\n'); // BOM pra abrir certo em Excel com acentos
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.reports = {
    monthsAvailable,
    monthlySummary,
    monthlyTrend,
    vaultDistribution,
    transactionsToCSV,
  };
})(window);
