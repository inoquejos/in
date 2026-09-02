/**
 * Metas de gastos por categoria (ex: "Alimentação até R$ 800/mês").
 * As metas são globais (não por mês) — o progresso é calculado comparando
 * o gasto do mês corrente na categoria contra o limite definido.
 */
(function (global) {
  'use strict';

  const { monthKey } = global.CofresApp.util;

  function list(state) {
    return state.budgets || [];
  }

  function upsert(state, category, limitCents) {
    category = (category || '').trim();
    if (!category) throw new Error('Informe a categoria.');
    if (!Number.isFinite(limitCents) || limitCents <= 0) {
      throw new Error('Informe um limite válido, maior que zero.');
    }
    if (!state.budgets) state.budgets = [];
    const existing = state.budgets.find((b) => b.category.toLowerCase() === category.toLowerCase());
    if (existing) {
      existing.limitCents = limitCents;
    } else {
      state.budgets.push({ category, limitCents });
    }
  }

  function remove(state, category) {
    state.budgets = (state.budgets || []).filter((b) => b.category !== category);
  }

  /** Progresso das metas no mês informado (targetMonthKey = "YYYY-MM"). */
  function progress(state, targetMonthKey) {
    const spentByCategory = {};
    state.transactions.forEach((t) => {
      if (t.type !== 'saida') return;
      if (monthKey(t.date) !== targetMonthKey) return;
      const cat = t.category || 'Outros';
      spentByCategory[cat] = (spentByCategory[cat] || 0) + t.amountCents;
    });
    return (state.budgets || [])
      .map((b) => {
        const spentCents = spentByCategory[b.category] || 0;
        return {
          category: b.category,
          limitCents: b.limitCents,
          spentCents,
          pct: b.limitCents > 0 ? Math.round((spentCents / b.limitCents) * 100) : 0,
        };
      })
      .sort((a, b) => b.pct - a.pct);
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.budgets = { list, upsert, remove, progress };
})(window);
