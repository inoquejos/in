/**
 * Funções de renderização (DOM) — recebem estado + elementos e atualizam a tela.
 * Não mutam o estado da aplicação; quem mutar é o app.js.
 */
(function (global) {
  'use strict';

  const { centsToBRL, formatDateBR, escapeCSV } = global.CofresApp.util;

  const TX_TYPE_ICON = { entrada: '⬇️', saida: '⬆️', transferencia: '⇄' };

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function renderHeaderBalance(totalCents, targetEl) {
    targetEl.textContent = centsToBRL(totalCents);
    targetEl.style.color = totalCents < 0 ? 'var(--danger)' : '';
  }

  function renderVaultsGrid(container, state) {
    container.innerHTML = '';
    const total = state.vaults.reduce((acc, v) => acc + Math.max(0, v.balanceCents), 0);
    state.vaults.forEach((v) => {
      const share = total > 0 ? Math.max(0, v.balanceCents) / total : 0;
      const card = el('button', 'vault-card');
      card.type = 'button';
      card.style.setProperty('--vc', v.color);
      card.dataset.vaultId = v.id;
      card.innerHTML = `
        <div class="vault-card__top">
          <span class="vault-card__icon">${v.icon}</span>
          <span>${v.percent}%</span>
        </div>
        <div class="vault-card__name">${v.name}</div>
        <div class="vault-card__balance ${v.balanceCents < 0 ? 'negative' : ''}">${centsToBRL(v.balanceCents)}</div>
        <div class="vault-card__bar"><div class="vault-card__bar-fill" style="width:${Math.round(share * 100)}%"></div></div>
      `;
      container.appendChild(card);
    });
  }

  function txDescriptionFor(t, state) {
    if (t.type === 'transferencia') {
      const from = state.vaults.find((v) => v.id === t.fromVaultId);
      const to = state.vaults.find((v) => v.id === t.toVaultId);
      return `${t.description} (${from ? from.name : '?'} → ${to ? to.name : '?'})`;
    }
    return t.description;
  }

  function txIconFor(t, state) {
    if (t.type === 'transferencia') return TX_TYPE_ICON.transferencia;
    if (t.type === 'entrada') return TX_TYPE_ICON.entrada;
    const vault = state.vaults.find((v) => v.id === t.vaultId);
    return vault ? vault.icon : TX_TYPE_ICON.saida;
  }

  function renderTxList(container, txs, state, opts) {
    opts = opts || {};
    container.innerHTML = '';
    if (!txs.length) {
      container.appendChild(el('div', 'empty-state', opts.emptyMessage || 'Nenhum lançamento ainda.'));
      return;
    }
    txs.forEach((t) => {
      const item = el('div', 'tx-item');
      const sign = t.type === 'saida' ? '−' : t.type === 'entrada' ? '+' : '';
      const amountClass = t.type === 'entrada' ? 'in' : t.type === 'saida' ? 'out' : 'transfer';
      const metaText = `${formatDateBR(t.date)} · ${escapeHtml(t.category || '')}${t.note ? ' · 📝' : ''}`;
      item.innerHTML = `
        <div class="tx-item__icon">${txIconFor(t, state)}</div>
        <div class="tx-item__body">
          <div class="tx-item__desc">${escapeHtml(txDescriptionFor(t, state))}</div>
          <div class="tx-item__meta">${metaText}</div>
        </div>
        <div class="tx-item__amount ${amountClass}">${sign}${centsToBRL(t.amountCents)}</div>
      `;
      if (opts.onEdit) {
        item.classList.add('tx-item--clickable');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('click', () => opts.onEdit(t));
        item.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            opts.onEdit(t);
          }
        });
      }
      if (opts.onDelete) {
        const delBtn = el('button', 'tx-item__delete', '🗑');
        delBtn.type = 'button';
        delBtn.setAttribute('aria-label', 'Excluir lançamento');
        delBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          opts.onDelete(t.id);
        });
        item.appendChild(delBtn);
      }
      container.appendChild(item);
    });
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function populateVaultSelect(selectEl, state, opts) {
    opts = opts || {};
    const prev = selectEl.value;
    selectEl.innerHTML = '';
    if (opts.includeEmpty) {
      selectEl.appendChild(el('option', null, opts.emptyLabel || 'Todos os cofres')).value = '';
    }
    state.vaults.forEach((v) => {
      const opt = el('option', null, `${v.icon} ${v.name}`);
      opt.value = v.id;
      selectEl.appendChild(opt);
    });
    if (prev && Array.from(selectEl.options).some((o) => o.value === prev)) {
      selectEl.value = prev;
    } else if (opts.defaultVaultId) {
      selectEl.value = opts.defaultVaultId;
    }
  }

  function populateCategoryDatalist(datalistEl, state, type) {
    const defaults =
      type === 'entrada'
        ? ['Salário', 'Freelance', 'Renda Extra', 'Presente', 'Rendimentos']
        : ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Assinaturas', 'Compras', 'Outros'];
    const used = global.CofresApp.transactions.categoriesUsed(state);
    const all = Array.from(new Set([...defaults, ...used]));
    datalistEl.innerHTML = all.map((c) => `<option value="${escapeHtml(c)}"></option>`).join('');
  }

  function renderSplitPreview(container, amountCents, state) {
    if (!amountCents || amountCents <= 0) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }
    const splits = global.CofresApp.vaults.computeSplit(amountCents, state.vaults);
    container.classList.remove('hidden');
    container.innerHTML =
      '<strong style="display:block;margin-bottom:6px;">Como vai ser dividido:</strong>' +
      splits
        .map((s) => {
          const v = state.vaults.find((x) => x.id === s.vaultId);
          return `<div class="split-preview__row"><span>${v ? v.icon + ' ' + v.name : s.vaultId}</span><span>${centsToBRL(s.cents)}</span></div>`;
        })
        .join('');
  }

  function renderPercentForm(container, state) {
    container.innerHTML = '';
    state.vaults.forEach((v) => {
      const row = el('div', 'percent-row');
      row.innerHTML = `
        <span class="percent-row__icon">${v.icon}</span>
        <span class="percent-row__name">${v.name}</span>
        <input type="number" min="0" max="100" step="1" value="${v.percent}" data-vault-id="${v.id}" inputmode="numeric" />
      `;
      container.appendChild(row);
    });
  }

  function renderVaultsDetail(container, state) {
    container.innerHTML = '';
    state.vaults.forEach((v) => {
      const row = el('div', 'vault-detail');
      row.innerHTML = `
        <div class="vault-detail__icon" style="--vc:${v.color}">${v.icon}</div>
        <div class="vault-detail__body">
          <div class="vault-detail__name">${v.name}</div>
          <div class="vault-detail__desc">${v.description}</div>
        </div>
        <div class="vault-detail__balance ${v.balanceCents < 0 ? 'negative' : ''}">${centsToBRL(v.balanceCents)}</div>
      `;
      container.appendChild(row);
    });
  }

  function renderDonutLegend(container, distribution) {
    container.innerHTML = distribution
      .map(
        (d) => `
        <div class="donut-legend__item">
          <span class="donut-legend__label"><span class="legend-dot" style="--dot:${d.color}"></span>${d.icon} ${d.name}</span>
          <strong>${centsToBRL(d.balanceCents)}</strong>
        </div>`
      )
      .join('');
  }

  function renderLineLegend(container, trendVaults) {
    container.innerHTML = trendVaults
      .map((v) => {
        const last = v.series[v.series.length - 1];
        const balance = last ? centsToBRL(last.balanceCents) : centsToBRL(0);
        return `<span><span class="legend-dot" style="--dot:${v.color}"></span>${v.icon} ${v.name} <strong>${balance}</strong></span>`;
      })
      .join('');
  }

  function renderBudgetsList(container, progressList, onDelete) {
    container.innerHTML = '';
    if (!progressList.length) {
      container.appendChild(el('div', 'empty-state', 'Nenhuma meta cadastrada ainda.'));
      return;
    }
    progressList.forEach((b) => {
      const over = b.pct >= 100;
      const row = el('div', 'budget-row');
      row.innerHTML = `
        <div class="budget-row__top">
          <span class="budget-row__name">${escapeHtml(b.category)}</span>
          <span class="budget-row__values ${over ? 'over' : ''}">${centsToBRL(b.spentCents)} / ${centsToBRL(b.limitCents)}</span>
        </div>
        <div class="budget-row__bar"><div class="budget-row__bar-fill ${over ? 'over' : ''}" style="width:${Math.min(100, b.pct)}%"></div></div>
      `;
      if (onDelete) {
        const delBtn = el('button', 'budget-row__delete', '🗑 remover meta');
        delBtn.type = 'button';
        delBtn.setAttribute('aria-label', 'Excluir meta de ' + b.category);
        delBtn.addEventListener('click', () => onDelete(b.category));
        row.appendChild(delBtn);
      }
      container.appendChild(row);
    });
  }

  function showToast(message, ms) {
    const toastEl = document.getElementById('toast');
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.add('hidden'), ms || 2400);
  }

  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.ui = {
    renderHeaderBalance,
    renderVaultsGrid,
    renderTxList,
    populateVaultSelect,
    populateCategoryDatalist,
    renderSplitPreview,
    renderPercentForm,
    renderVaultsDetail,
    renderDonutLegend,
    renderLineLegend,
    renderBudgetsList,
    showToast,
    openModal,
    closeModal,
    escapeHtml,
  };
})(window);
