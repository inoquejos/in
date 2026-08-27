/**
 * Regras de negócio dos "cofres" (envelopes): distribuição automática de entradas,
 * débito de saídas, transferências manuais entre cofres, e edição de percentuais.
 */
(function (global) {
  'use strict';

  function getVault(state, vaultId) {
    return state.vaults.find((v) => v.id === vaultId) || null;
  }

  function percentSum(vaults) {
    return vaults.reduce((acc, v) => acc + Number(v.percent || 0), 0);
  }

  /**
   * Divide totalCents entre os cofres proporcionalmente ao percent de cada um.
   * Usa o método do "maior resto" para garantir que a soma das partes seja
   * EXATAMENTE totalCents (sem perder nem sobrar centavo por arredondamento).
   */
  function computeSplit(totalCents, vaults) {
    if (!Number.isFinite(totalCents) || totalCents <= 0) return [];
    const raw = vaults.map((v) => {
      const exact = (totalCents * Number(v.percent || 0)) / 100;
      const floor = Math.floor(exact);
      return { vaultId: v.id, cents: floor, remainder: exact - floor };
    });
    let distributed = raw.reduce((acc, r) => acc + r.cents, 0);
    let missing = totalCents - distributed;
    // distribui os centavos restantes para quem tem maior resto fracionário
    const order = [...raw].sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < order.length && missing > 0; i++, missing--) {
      order[i].cents += 1;
    }
    return raw.map((r) => ({ vaultId: r.vaultId, cents: r.cents }));
  }

  function applyIncomeSplit(state, totalCents) {
    const splits = computeSplit(totalCents, state.vaults);
    splits.forEach((s) => {
      const vault = getVault(state, s.vaultId);
      if (vault) vault.balanceCents += s.cents;
    });
    return splits;
  }

  function reverseIncomeSplit(state, splits) {
    (splits || []).forEach((s) => {
      const vault = getVault(state, s.vaultId);
      if (vault) vault.balanceCents -= s.cents;
    });
  }

  function applyExpense(state, vaultId, amountCents) {
    const vault = getVault(state, vaultId);
    if (!vault) throw new Error('Cofre não encontrado: ' + vaultId);
    vault.balanceCents -= amountCents;
  }

  function reverseExpense(state, vaultId, amountCents) {
    const vault = getVault(state, vaultId);
    if (vault) vault.balanceCents += amountCents;
  }

  function applyTransfer(state, fromVaultId, toVaultId, amountCents) {
    const from = getVault(state, fromVaultId);
    const to = getVault(state, toVaultId);
    if (!from || !to) throw new Error('Cofre de origem/destino inválido.');
    from.balanceCents -= amountCents;
    to.balanceCents += amountCents;
  }

  function reverseTransfer(state, fromVaultId, toVaultId, amountCents) {
    const from = getVault(state, fromVaultId);
    const to = getVault(state, toVaultId);
    if (from) from.balanceCents += amountCents;
    if (to) to.balanceCents -= amountCents;
  }

  /** newPercentMap: { vaultId: percentNumber, ... } — precisa somar 100. */
  function updatePercentages(state, newPercentMap) {
    const sum = Object.values(newPercentMap).reduce((a, b) => a + Number(b || 0), 0);
    if (Math.round(sum * 100) !== 10000) {
      throw new Error('A soma dos percentuais precisa ser exatamente 100%. Total informado: ' + sum + '%');
    }
    state.vaults.forEach((v) => {
      if (Object.prototype.hasOwnProperty.call(newPercentMap, v.id)) {
        v.percent = Number(newPercentMap[v.id]);
      }
    });
  }

  function totalBalance(state) {
    return state.vaults.reduce((acc, v) => acc + v.balanceCents, 0);
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.vaults = {
    getVault,
    percentSum,
    computeSplit,
    applyIncomeSplit,
    reverseIncomeSplit,
    applyExpense,
    reverseExpense,
    applyTransfer,
    reverseTransfer,
    updatePercentages,
    totalBalance,
  };
})(window);
