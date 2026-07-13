export function renderTimeline(days, containerEl) {
  containerEl.innerHTML = '';
  for (const day of days) {
    const details = document.createElement('details');
    details.className = 'day-entry';

    const summary = document.createElement('summary');
    summary.textContent = `${day.date} · ${day.title}`;
    details.appendChild(summary);

    const itemsWrap = document.createElement('div');
    itemsWrap.className = 'day-items';
    for (const item of day.items) {
      const p = document.createElement('p');
      p.textContent = `${item.time} — ${item.title}（${item.transport}）${item.note ? ' ' + item.note : ''}`;
      itemsWrap.appendChild(p);
    }
    details.appendChild(itemsWrap);
    containerEl.appendChild(details);
  }
}
