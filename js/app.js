/**
 * Controlador principal: liga estado + regras de negócio + UI + eventos do DOM.
 */
(function () {
  'use strict';

  const { storage, util, vaults: vaultsApi, transactions: txApi, budgets: budgetsApi, reports, charts, ui } = window.CofresApp;

  let state = storage.loadState();
  let currentView = 'home';
  let currentReportMonth = util.monthKey(util.todayISO());
  let currentTxType = 'entrada';
  let editingTxId = null;

  // ---------- referências DOM ----------
  const $ = (id) => document.getElementById(id);

  const totalBalanceEl = $('total-balance');
  const vaultsGridEl = $('vaults-grid');
  const recentTxEl = $('recent-transactions');

  const monthLabelEl = $('month-label');
  const summaryIncomeEl = $('summary-income');
  const summaryExpenseEl = $('summary-expense');
  const summaryNetEl = $('summary-net');
  const chartTrendEl = $('chart-trend');
  const chartVaultsEl = $('chart-vaults');
  const donutLegendEl = $('donut-legend');
  const chartVaultsTrendEl = $('chart-vaults-trend');
  const vaultsTrendLegendEl = $('vaults-trend-legend');
  const printGeneratedAtEl = $('print-generated-at');
  const filterVaultEl = $('filter-vault');
  const filterTypeEl = $('filter-type');
  const filterSearchEl = $('filter-search');
  const extratoListEl = $('extrato-list');

  const budgetsListEl = $('budgets-list');
  const formBudgetEl = $('form-budget');
  const budgetCategoryEl = $('budget-category');
  const budgetCategoryOptionsEl = $('budget-category-options');
  const budgetLimitEl = $('budget-limit');

  const percentFormEl = $('form-percentages');
  const percentTotalRowEl = $('percent-total-row');
  const percentTotalEl = $('percent-total');
  const vaultsDetailListEl = $('vaults-detail-list');

  const modalTxEl = $('modal-tx');
  const formTxEl = $('form-tx');
  const txAmountEl = $('tx-amount');
  const txDateEl = $('tx-date');
  const txDescriptionEl = $('tx-description');
  const txNoteEl = $('tx-note');
  const txCategoryEl = $('tx-category');
  const categoryOptionsEl = $('category-options');
  const txFieldCategoryEl = $('tx-field-category');
  const txFieldVaultEl = $('tx-field-vault');
  const txVaultEl = $('tx-vault');
  const txFieldTransferEl = $('tx-field-transfer');
  const txFromVaultEl = $('tx-from-vault');
  const txToVaultEl = $('tx-to-vault');
  const txSplitPreviewEl = $('tx-split-preview');
  const txFormErrorEl = $('tx-form-error');
  const txEditHintEl = $('tx-edit-hint');
  const txSubmitBtnEl = $('tx-submit-btn');

  // ---------- persistência ----------
  function persist() {
    storage.saveState(state);
  }

  // ---------- render ----------
  function renderHome() {
    ui.renderHeaderBalance(vaultsApi.totalBalance(state), totalBalanceEl);
    ui.renderVaultsGrid(vaultsGridEl, state);
    const recent = txApi.listTransactions(state).slice(0, 5);
    ui.renderTxList(recentTxEl, recent, state, {
      onDelete: handleDeleteTx,
      onEdit: openEditTxModal,
      emptyMessage: 'Nenhum lançamento ainda. Toque em "+" para começar.',
    });
  }

  function currentExtratoFilters() {
    return {
      dateFrom: currentReportMonth + '-01',
      dateTo: currentReportMonth + '-31',
      vaultId: filterVaultEl.value || undefined,
      type: filterTypeEl.value || undefined,
      search: filterSearchEl.value || undefined,
    };
  }

  function renderReportsView() {
    const summary = reports.monthlySummary(state, currentReportMonth);
    monthLabelEl.textContent = summary.label;
    summaryIncomeEl.textContent = util.centsToBRL(summary.incomeCents);
    summaryExpenseEl.textContent = util.centsToBRL(summary.expenseCents);
    summaryNetEl.textContent = util.centsToBRL(summary.netCents);
    summaryNetEl.style.color = summary.netCents < 0 ? 'var(--danger)' : 'var(--success)';

    const trend = reports.monthlyTrend(state, 6);
    charts.drawBarChart(
      chartTrendEl,
      trend.map((m) => ({ label: m.label.slice(0, 3), income: m.incomeCents / 100, expense: m.expenseCents / 100 }))
    );

    const distribution = reports.vaultDistribution(state);
    charts.drawDonut(
      chartVaultsEl,
      distribution.map((d) => ({ value: Math.max(0, d.balanceCents), color: d.color }))
    );
    ui.renderDonutLegend(donutLegendEl, distribution);

    const vaultTrend = reports.vaultBalanceTrend(state, 6);
    charts.drawLineChart(
      chartVaultsTrendEl,
      vaultTrend.map((v) => ({
        color: v.color,
        points: v.series.map((s) => ({ label: s.label.slice(0, 3), value: s.balanceCents / 100 })),
      }))
    );
    ui.renderLineLegend(vaultsTrendLegendEl, vaultTrend);

    ui.populateCategoryDatalist(budgetCategoryOptionsEl, state, 'saida');
    ui.renderBudgetsList(budgetsListEl, budgetsApi.progress(state, currentReportMonth), handleDeleteBudget);

    printGeneratedAtEl.textContent = `${summary.label} — gerado em ${util.formatDateBR(util.todayISO())}`;

    ui.populateVaultSelect(filterVaultEl, state, { includeEmpty: true, emptyLabel: 'Todos os cofres' });
    const filtered = txApi.listTransactions(state, currentExtratoFilters());
    ui.renderTxList(extratoListEl, filtered, state, {
      onDelete: handleDeleteTx,
      onEdit: openEditTxModal,
      emptyMessage: 'Nenhum lançamento neste período/filtro.',
    });
  }

  function handleDeleteBudget(category) {
    budgetsApi.remove(state, category);
    persist();
    renderReportsView();
    ui.showToast('Meta removida.');
  }

  function renderVaultsView() {
    ui.renderPercentForm(percentFormEl, state);
    updatePercentTotal();
    ui.renderVaultsDetail(vaultsDetailListEl, state);
  }

  function updatePercentTotal() {
    const inputs = percentFormEl.querySelectorAll('input[data-vault-id]');
    let sum = 0;
    inputs.forEach((inp) => (sum += Number(inp.value || 0)));
    percentTotalEl.textContent = sum + '%';
    percentTotalRowEl.classList.toggle('invalid', sum !== 100);
  }

  function populateModalSelectsAndCategories() {
    ui.populateVaultSelect(txVaultEl, state, { defaultVaultId: 'despesas' });
    ui.populateVaultSelect(txFromVaultEl, state, { defaultVaultId: state.vaults[0] && state.vaults[0].id });
    ui.populateVaultSelect(txToVaultEl, state, { defaultVaultId: state.vaults[1] && state.vaults[1].id });
    ui.populateCategoryDatalist(categoryOptionsEl, state, currentTxType);
  }

  function renderAll() {
    renderHome();
    if (currentView === 'reports') renderReportsView();
    if (currentView === 'vaults') renderVaultsView();
    populateModalSelectsAndCategories();
  }

  // ---------- navegação ----------
  function switchView(viewName) {
    currentView = viewName;
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('hidden', v.dataset.view !== viewName));
    document.querySelectorAll('.bottom-nav__btn').forEach((b) => b.classList.toggle('active', b.dataset.nav === viewName));
    if (viewName === 'reports') renderReportsView();
    if (viewName === 'vaults') renderVaultsView();
  }

  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => switchView(btn.dataset.nav));
  });

  // ---------- modal de lançamento ----------
  function setTxType(type) {
    currentTxType = type;
    document.querySelectorAll('#tx-type-segmented .segmented__btn').forEach((b) => b.classList.toggle('active', b.dataset.type === type));
    txFieldCategoryEl.classList.toggle('hidden', type === 'transferencia'); // categoria só faz sentido em entrada/saída
    txFieldVaultEl.classList.toggle('hidden', type !== 'saida');
    txFieldTransferEl.classList.toggle('hidden', type !== 'transferencia');
    $('modal-tx-title').textContent = type === 'entrada' ? 'Nova entrada' : type === 'saida' ? 'Nova saída' : 'Transferir entre cofres';
    ui.populateCategoryDatalist(categoryOptionsEl, state, type);
    updateSplitPreview();
    hideFormError();
  }

  function updateSplitPreview() {
    if (currentTxType !== 'entrada') {
      txSplitPreviewEl.classList.add('hidden');
      return;
    }
    const cents = util.parseAmountToCents(txAmountEl.value);
    ui.renderSplitPreview(txSplitPreviewEl, cents, state);
  }

  function hideFormError() {
    txFormErrorEl.classList.add('hidden');
    txFormErrorEl.textContent = '';
  }

  function showFormError(message) {
    txFormErrorEl.textContent = message;
    txFormErrorEl.classList.remove('hidden');
  }

  function setSegmentedEditable(editable) {
    document.querySelectorAll('#tx-type-segmented .segmented__btn').forEach((b) => {
      b.disabled = !editable;
    });
    txEditHintEl.classList.toggle('hidden', editable);
  }

  function openTxModal(type) {
    // não usa formTxEl.reset(): ele colapsaria os <select> pra primeira opção
    // (não têm atributo "selected") e a lógica de repopulação abaixo passaria
    // a "preservar" esse valor errado em vez de aplicar o default pretendido.
    editingTxId = null;
    txAmountEl.value = '';
    txDescriptionEl.value = '';
    txNoteEl.value = '';
    txCategoryEl.value = '';
    txDateEl.value = util.todayISO();
    txSubmitBtnEl.textContent = 'Salvar lançamento';
    hideFormError();
    populateModalSelectsAndCategories();
    setSegmentedEditable(true);
    setTxType(type || 'entrada');
    ui.openModal(modalTxEl);
    setTimeout(() => txAmountEl.focus(), 50);
  }

  function openEditTxModal(tx) {
    editingTxId = tx.id;
    txAmountEl.value = (tx.amountCents / 100).toFixed(2).replace('.', ',');
    txDateEl.value = tx.date;
    txDescriptionEl.value = tx.description || '';
    txNoteEl.value = tx.note || '';
    txCategoryEl.value = tx.category || '';
    txSubmitBtnEl.textContent = 'Salvar alterações';
    hideFormError();
    populateModalSelectsAndCategories();
    setSegmentedEditable(false);
    setTxType(tx.type);
    $('modal-tx-title').textContent = 'Editar lançamento';
    if (tx.type === 'saida') txVaultEl.value = tx.vaultId;
    if (tx.type === 'transferencia') {
      txFromVaultEl.value = tx.fromVaultId;
      txToVaultEl.value = tx.toVaultId;
    }
    ui.openModal(modalTxEl);
  }

  function closeTxModal() {
    ui.closeModal(modalTxEl);
  }

  document.querySelectorAll('[data-open-tx]').forEach((btn) => {
    btn.addEventListener('click', () => openTxModal(btn.dataset.openTx));
  });
  $('fab-add').addEventListener('click', () => openTxModal('entrada'));
  $('modal-tx-close').addEventListener('click', closeTxModal);
  modalTxEl.addEventListener('click', (ev) => {
    if (ev.target === modalTxEl) closeTxModal();
  });

  document.querySelectorAll('#tx-type-segmented .segmented__btn').forEach((btn) => {
    btn.addEventListener('click', () => setTxType(btn.dataset.type));
  });

  txAmountEl.addEventListener('input', updateSplitPreview);

  formTxEl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    hideFormError();
    const amountCents = util.parseAmountToCents(txAmountEl.value);
    const date = txDateEl.value;
    const description = txDescriptionEl.value.trim();
    const category = txCategoryEl.value.trim();
    const note = txNoteEl.value.trim();

    try {
      if (editingTxId) {
        const patch = { amountCents, date, description, category, note };
        if (currentTxType === 'saida') patch.vaultId = txVaultEl.value;
        if (currentTxType === 'transferencia') {
          patch.fromVaultId = txFromVaultEl.value;
          patch.toVaultId = txToVaultEl.value;
        }
        txApi.updateTransaction(state, editingTxId, patch);
        ui.showToast('Lançamento atualizado ✅');
      } else if (currentTxType === 'entrada') {
        txApi.addIncome(state, { amountCents, date, description, category, note });
        ui.showToast('Lançamento salvo ✅');
      } else if (currentTxType === 'saida') {
        txApi.addExpense(state, { amountCents, date, description, category, vaultId: txVaultEl.value, note });
        ui.showToast('Lançamento salvo ✅');
      } else {
        txApi.addTransfer(state, {
          amountCents,
          date,
          description,
          fromVaultId: txFromVaultEl.value,
          toVaultId: txToVaultEl.value,
          note,
        });
        ui.showToast('Lançamento salvo ✅');
      }
      persist();
      closeTxModal();
      renderAll();
    } catch (err) {
      showFormError(err.message || 'Não foi possível salvar o lançamento.');
    }
  });

  function handleDeleteTx(id) {
    if (!confirm('Excluir este lançamento? Os saldos dos cofres serão ajustados.')) return;
    txApi.deleteTransaction(state, id);
    persist();
    renderAll();
    ui.showToast('Lançamento excluído.');
  }

  // ---------- relatórios: navegação de mês e filtros ----------
  function shiftMonth(delta) {
    const [y, m] = currentReportMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    currentReportMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    renderReportsView();
  }
  $('month-prev').addEventListener('click', () => shiftMonth(-1));
  $('month-next').addEventListener('click', () => shiftMonth(1));

  [filterVaultEl, filterTypeEl].forEach((elx) => elx.addEventListener('change', renderReportsView));
  let searchDebounce;
  filterSearchEl.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(renderReportsView, 150);
  });

  $('btn-export-csv').addEventListener('click', () => {
    const filtered = txApi.listTransactions(state, currentExtratoFilters());
    if (!filtered.length) {
      ui.showToast('Nada para exportar neste filtro.');
      return;
    }
    const csv = reports.transactionsToCSV(state, filtered);
    util.downloadFile(`extrato-cofres-${currentReportMonth}.csv`, csv, 'text/csv;charset=utf-8');
  });

  $('btn-export-pdf').addEventListener('click', () => {
    window.print();
  });

  // ---------- relatórios: metas por categoria ----------
  formBudgetEl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    try {
      const limitCents = util.parseAmountToCents(budgetLimitEl.value);
      budgetsApi.upsert(state, budgetCategoryEl.value, limitCents);
      persist();
      formBudgetEl.reset();
      renderReportsView();
      ui.showToast('Meta salva ✅');
    } catch (err) {
      ui.showToast(err.message || 'Não foi possível salvar a meta.');
    }
  });

  window.addEventListener('resize', debounce(() => {
    if (currentView === 'reports') renderReportsView();
  }, 200));

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // ---------- cofres: percentuais ----------
  percentFormEl.addEventListener('input', (ev) => {
    if (ev.target.matches('input[data-vault-id]')) updatePercentTotal();
  });

  percentFormEl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const inputs = percentFormEl.querySelectorAll('input[data-vault-id]');
    const map = {};
    inputs.forEach((inp) => (map[inp.dataset.vaultId] = Number(inp.value || 0)));
    try {
      vaultsApi.updatePercentages(state, map);
      persist();
      renderAll();
      renderVaultsView();
      ui.showToast('Percentuais atualizados ✅');
    } catch (err) {
      ui.showToast(err.message);
    }
  });

  // clique no card do cofre (Início) -> vai pro extrato já filtrado por ele
  vaultsGridEl.addEventListener('click', (ev) => {
    const card = ev.target.closest('.vault-card');
    if (!card) return;
    switchView('reports');
    ui.populateVaultSelect(filterVaultEl, state, { includeEmpty: true, emptyLabel: 'Todos os cofres' });
    filterVaultEl.value = card.dataset.vaultId;
    renderReportsView();
  });

  // ---------- config: backup / restore / reset ----------
  $('btn-export-backup').addEventListener('click', () => {
    const json = storage.exportBackup(state);
    const stamp = util.todayISO();
    util.downloadFile(`backup-cofres-${stamp}.json`, json, 'application/json');
    ui.showToast('Backup exportado ✅');
  });

  $('input-import-backup').addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = storage.importBackup(String(reader.result));
        renderAll();
        renderVaultsView();
        ui.showToast('Backup importado ✅');
      } catch (err) {
        alert('Falha ao importar backup: ' + err.message);
      } finally {
        ev.target.value = '';
      }
    };
    reader.readAsText(file);
  });

  $('btn-reset-all').addEventListener('click', () => {
    if (!confirm('Isso vai apagar TODOS os lançamentos e zerar os cofres. Tem certeza?')) return;
    state = storage.resetAll();
    renderAll();
    renderVaultsView();
    ui.showToast('Dados apagados.');
  });

  // ---------- service worker ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Falha ao registrar service worker:', err));
    });
  }

  // ---------- init ----------
  function init() {
    txDateEl.value = util.todayISO();
    renderAll();
    switchView('home');
  }

  init();
})();
