/**
 * Funções utilitárias compartilhadas: moeda, datas e download de arquivos.
 */
(function (global) {
  'use strict';

  const brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  function centsToBRL(cents) {
    return brlFormatter.format((cents || 0) / 100);
  }

  /** Aceita "1234,56", "1.234,56", "1234.56" ou "1234" e devolve centavos (inteiro). */
  function parseAmountToCents(input) {
    if (input == null) return NaN;
    let s = String(input).trim();
    if (!s) return NaN;
    s = s.replace(/[^\d,.-]/g, '');
    const hasComma = s.includes(',');
    const hasDot = s.includes('.');
    if (hasComma && hasDot) {
      // formato BR: ponto = milhar, vírgula = decimal
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      s = s.replace(',', '.');
    }
    const value = parseFloat(s);
    if (Number.isNaN(value)) return NaN;
    return Math.round(value * 100);
  }

  function todayISO() {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  function formatDateBR(isoDate) {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    if (!y || !m || !d) return isoDate;
    return `${d}/${m}/${y}`;
  }

  function monthKey(isoDate) {
    return (isoDate || todayISO()).slice(0, 7); // YYYY-MM
  }

  function monthLabel(monthKeyStr) {
    const [y, m] = monthKeyStr.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function escapeCSV(value) {
    const s = String(value ?? '');
    if (/[",;\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.util = {
    centsToBRL,
    parseAmountToCents,
    todayISO,
    formatDateBR,
    monthKey,
    monthLabel,
    escapeCSV,
    downloadFile,
    clamp,
  };
})(window);
