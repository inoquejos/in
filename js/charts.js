/**
 * Gráficos simples desenhados em <canvas>, sem nenhuma lib externa
 * (necessário pro app funcionar 100% offline).
 */
(function (global) {
  'use strict';

  function setupCanvas(canvas, cssHeight) {
    const dpr = global.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || canvas.parentElement.clientWidth || 300;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: cssWidth, height: cssHeight };
  }

  /** slices: [{ value, color }] — desenha um donut centralizado. */
  function drawDonut(canvas, slices, opts) {
    opts = opts || {};
    const size = opts.size || 220;
    const { ctx, width, height } = setupCanvas(canvas, size);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) / 2 - 4;
    const innerR = outerR * 0.6;

    const total = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);
    if (total <= 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
      ctx.fillStyle = opts.emptyColor || 'rgba(128,128,128,0.15)';
      ctx.fill('evenodd');
      return;
    }

    let start = -Math.PI / 2;
    slices.forEach((s) => {
      const value = Math.max(0, s.value);
      if (value <= 0) return;
      const angle = (value / total) * Math.PI * 2;
      const end = start + angle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, start, end);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      start = end;
    });

    // buraco do donut
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  /** data: [{ label, income, expense }] (valores em reais, não centavos) */
  function drawBarChart(canvas, data, opts) {
    opts = opts || {};
    const cssHeight = opts.height || 180;
    const { ctx, width, height } = setupCanvas(canvas, cssHeight);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 12, right: 8, bottom: 24, left: 8 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));
    const groupW = chartW / data.length;
    const barW = Math.min(18, groupW * 0.32);

    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = opts.textColor || '#8a93a6';
    ctx.textAlign = 'center';

    data.forEach((d, i) => {
      const groupCx = padding.left + groupW * i + groupW / 2;
      const incomeH = (d.income / maxVal) * chartH;
      const expenseH = (d.expense / maxVal) * chartH;

      ctx.fillStyle = opts.incomeColor || '#4C9F70';
      ctx.fillRect(groupCx - barW - 2, padding.top + chartH - incomeH, barW, incomeH);

      ctx.fillStyle = opts.expenseColor || '#EF6C61';
      ctx.fillRect(groupCx + 2, padding.top + chartH - expenseH, barW, expenseH);

      ctx.fillStyle = opts.textColor || '#8a93a6';
      ctx.fillText(d.label, groupCx, height - 6);
    });
  }

  global.CofresApp = global.CofresApp || {};
  global.CofresApp.charts = { drawDonut, drawBarChart };
})(window);
