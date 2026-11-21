'use strict';
(() => {
  const canvas = document.getElementById('plot');
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('zero');
  const previous = document.getElementById('prev');
  const next = document.getElementById('next');
  const {start, step, zeros, wave} = zetaSamples;
  const end = start + step * (wave.length - 1);
  let selected = 0;
  let width, height;
  const left = 31, right = 13, top = 15, bottom = 25;
  const x = t => left + (t - start) / (end - start) * (width - left - right);
  const y = v => top + (4 - v) / 8 * (height - top - bottom);

  function line(x1, y1, x2, y2, color) {
    ctx.beginPath(); ctx.strokeStyle = color;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function draw() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.font = '10px monospace'; ctx.lineWidth = 1;
    for (let v = -4; v <= 4; v++) {
      line(left, y(v), width - right, y(v), v === 0 ? '#6f9679' : '#254438');
      if (v === 0 || Math.abs(v) === 2) {
        ctx.fillStyle = '#adc2b0'; ctx.textAlign = 'right'; ctx.fillText(String(v), left - 7, y(v) + 3);
      }
    }
    for (let t = 10; t <= 50; t += 2) {
      line(x(t), top, x(t), height - bottom, t % 10 === 0 ? '#335244' : '#203e32');
      if (t % 10 === 0) {ctx.textAlign = 'center'; ctx.fillStyle = '#adc2b0'; ctx.fillText(t, x(t), height - 8);}
    }
    ctx.fillStyle = '#c5dfbd'; ctx.textAlign = 'left'; ctx.fillText('Z(t)', 3, 12);
    const wavePath = new Path2D();
    wave.forEach((v, i) => i ? wavePath.lineTo(x(start + step*i), y(v)) : wavePath.moveTo(x(start), y(v)));
    const fill = new Path2D(wavePath); fill.lineTo(x(end), y(0)); fill.lineTo(x(start), y(0)); fill.closePath();
    ctx.fillStyle = 'rgba(181,241,136,.09)'; ctx.fill(fill);
    ctx.lineWidth = 2.25; ctx.strokeStyle = '#bced91'; ctx.stroke(wavePath);
    const xx = x(zeros[selected]); ctx.lineWidth = 1;
    ctx.setLineDash([3,4]); line(xx, top, xx, height - bottom, '#e9c881'); ctx.setLineDash([]);
    zeros.forEach((t, i) => {
      ctx.beginPath(); ctx.arc(x(t), y(0), i === selected ? 5 : 2.9, 0, Math.PI*2);
      ctx.fillStyle = i === selected ? '#ffe1a1' : '#102b23'; ctx.fill();
      ctx.strokeStyle = i === selected ? '#ffe1a1' : '#d6f4bc'; ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(xx, y(0), 9.5, 0, Math.PI*2); ctx.strokeStyle = 'rgba(255,225,161,.55)'; ctx.stroke();
  }
  function select(i) {
    selected = Math.max(0, Math.min(zeros.length - 1, i));
    slider.value = selected + 1;
    slider.setAttribute('aria-valuetext', 'Zero ' + (selected+1) + ', height ' + zeros[selected].toFixed(6));
    document.getElementById('ordinal').textContent = String(selected+1).padStart(2,'0') + ' / 10';
    document.getElementById('height').textContent = zeros[selected].toFixed(6);
    previous.disabled = selected === 0; next.disabled = selected === zeros.length - 1;
    draw();
  }
  slider.addEventListener('input', () => select(Number(slider.value) - 1));
  previous.addEventListener('click', () => select(selected - 1));
  next.addEventListener('click', () => select(selected + 1));
  canvas.addEventListener('click', event => {
    const px = event.clientX - canvas.getBoundingClientRect().left;
    const nearest = zeros.reduce((best, t, i) => Math.abs(x(t)-px) < Math.abs(x(zeros[best])-px) ? i : best, 0);
    select(nearest);
  });
  new ResizeObserver(draw).observe(canvas);
  select(0);
})();
