import { buildRoutePathD } from './route-svg.js';
import { computeCategoryTotal, computeGrandTotal, formatCurrency } from './budget.js';

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

export function renderRoute(route, containerEl) {
  const { waypoints } = route;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', buildRoutePathD(waypoints));
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#d97757');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);

  waypoints.forEach((point) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', '2');
    circle.setAttribute('fill', '#4a3728');
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', point.x);
    text.setAttribute('y', point.y - 3);
    text.setAttribute('font-size', '3');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = point.label;
    svg.appendChild(text);
  });

  containerEl.innerHTML = '';
  containerEl.appendChild(svg);
}

export function renderBudget(budget, containerEl, totalEl) {
  containerEl.innerHTML = '';
  for (const category of budget.categories) {
    const wrap = document.createElement('div');
    wrap.className = 'budget-category';

    const heading = document.createElement('h3');
    heading.textContent = `${category.name} · ${formatCurrency(computeCategoryTotal(category.items), budget.currency)}`;
    wrap.appendChild(heading);

    for (const item of category.items) {
      const p = document.createElement('p');
      p.textContent = `${item.label}：${formatCurrency(item.amount, budget.currency)}`;
      wrap.appendChild(p);
    }
    containerEl.appendChild(wrap);
  }
  totalEl.textContent = `总计：${formatCurrency(computeGrandTotal(budget.categories), budget.currency)}`;
}

export function renderDestinations(destinations, containerEl) {
  containerEl.innerHTML = '';
  for (const dest of destinations) {
    const card = document.createElement('div');
    card.className = 'destination-card';

    const img = document.createElement('img');
    img.src = dest.image;
    img.alt = dest.name;
    card.appendChild(img);

    const detail = document.createElement('div');
    detail.className = 'destination-detail';

    const name = document.createElement('h3');
    name.textContent = dest.name;
    detail.appendChild(name);

    const summary = document.createElement('p');
    summary.className = 'summary';
    summary.textContent = dest.summary;
    detail.appendChild(summary);

    const full = document.createElement('p');
    full.className = 'full-detail hidden';
    full.textContent = dest.detail;
    detail.appendChild(full);

    card.appendChild(detail);
    card.addEventListener('click', () => {
      full.classList.toggle('hidden');
    });

    containerEl.appendChild(card);
  }
}
