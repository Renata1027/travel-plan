# 旅行计事本 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free, link-shareable static webpage that presents one confirmed trip itinerary (cover, day-by-day timeline, hand-drawn route map, budget, destination cards, mood/message board) to the user's boyfriend, with lightweight interactivity that emails responses back to the user.

**Architecture:** Plain static site — HTML + CSS + vanilla JS ES modules, no bundler, no frontend framework. Trip content lives in one data module (`js/data.js`) separate from rendering/interaction code. Pure logic (budget math, SVG path generation, data shape) is unit-tested with Node's built-in test runner (zero extra dependencies); DOM rendering and interaction are verified manually in the browser, per the design spec's testing section.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES modules), Node.js built-in `node:test` + `node:assert/strict` for unit tests, Formspree (free tier) for form submissions, Vercel (free tier) for hosting.

## Global Constraints

- No frontend framework, no bundler, no build step for the shipped site — only plain HTML/CSS/JS ES modules loaded directly by the browser.
- Automated unit tests apply only to pure logic modules (`js/budget.js`, `js/route-svg.js`, and the `js/data.js` schema check). DOM rendering and interactive UI (cover reveal, accordion, form submit UX) are verified manually in-browser — no jsdom or browser-automation dependency is introduced.
- Requires Node.js >= 18 to run `node --test` (built-in test runner, no external test framework).
- Claude does not create third-party accounts (Formspree, GitHub, Vercel) on the user's behalf — those steps are documented for the user to perform themselves, per safety policy.
- Mobile-first responsive layout; warm-toned, hand-drawn "travel journal" visual style (per design spec).
- `js/data.js` ships with placeholder trip content; the user will supply the real itinerary later to replace it.
- Currency formatting defaults to `¥` with thousands separators (per design spec's budget section).

---

### Task 1: Project scaffold and budget calculation logic

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `js/budget.js`
- Test: `tests/budget.test.mjs`

**Interfaces:**
- Produces: `computeCategoryTotal(items: {amount:number}[]): number`, `computeGrandTotal(categories: {items:{amount:number}[]}[]): number`, `formatCurrency(amount:number, currency?:string): string` — consumed by Task 8's `renderBudget`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "travel-plan",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
.DS_Store
```

- [ ] **Step 3: Write the failing test**

`tests/budget.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeCategoryTotal, computeGrandTotal, formatCurrency } from '../js/budget.js';

test('computeCategoryTotal sums item amounts', () => {
  const items = [{ amount: 100 }, { amount: 250 }, { amount: 50 }];
  assert.equal(computeCategoryTotal(items), 400);
});

test('computeCategoryTotal returns 0 for an empty list', () => {
  assert.equal(computeCategoryTotal([]), 0);
});

test('computeGrandTotal sums totals across categories', () => {
  const categories = [
    { name: '交通', items: [{ amount: 300 }, { amount: 200 }] },
    { name: '住宿', items: [{ amount: 800 }] },
  ];
  assert.equal(computeGrandTotal(categories), 1300);
});

test('formatCurrency formats with thousands separator and default currency symbol', () => {
  assert.equal(formatCurrency(12345), '¥12,345');
});

test('formatCurrency accepts a custom currency symbol', () => {
  assert.equal(formatCurrency(999, '$'), '$999');
});

test('formatCurrency rounds fractional amounts', () => {
  assert.equal(formatCurrency(99.6), '¥100');
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module '../js/budget.js'`

- [ ] **Step 5: Write the minimal implementation**

`js/budget.js`:

```js
export function computeCategoryTotal(items) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function computeGrandTotal(categories) {
  return categories.reduce((sum, category) => sum + computeCategoryTotal(category.items), 0);
}

export function formatCurrency(amount, currency = '¥') {
  const rounded = Math.round(amount);
  return `${currency}${rounded.toLocaleString('en-US')}`;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `node --test tests/`
Expected: PASS — 6 tests, 0 failures

- [ ] **Step 7: Commit**

```bash
git add package.json .gitignore js/budget.js tests/budget.test.mjs
git commit -m "feat: add budget calculation logic"
```

---

### Task 2: Route SVG path generation logic

**Files:**
- Create: `js/route-svg.js`
- Test: `tests/route-svg.test.mjs`

**Interfaces:**
- Produces: `buildRoutePathD(waypoints: {x:number,y:number}[], options?: {wiggle?:number}): string` — consumed by Task 7's `renderRoute` to set an SVG `<path d="...">`. Waypoints use a 0–100 coordinate space matching an SVG `viewBox="0 0 100 100"`.

- [ ] **Step 1: Write the failing test**

`tests/route-svg.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePathD } from '../js/route-svg.js';

test('returns empty string for fewer than 2 waypoints', () => {
  assert.equal(buildRoutePathD([]), '');
  assert.equal(buildRoutePathD([{ x: 0, y: 0 }]), '');
});

test('builds a moveto + quadratic curve for two waypoints', () => {
  const d = buildRoutePathD([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
  assert.equal(d, 'M 0 0 Q 5.00 -3.00 10 0');
});

test('alternates wiggle direction across multiple segments', () => {
  const d = buildRoutePathD([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
  ]);
  assert.equal(d, 'M 0 0 Q 5.00 -3.00 10 0 Q 15.00 3.00 20 0');
});

test('accepts a custom wiggle amount', () => {
  const d = buildRoutePathD([{ x: 0, y: 0 }, { x: 10, y: 0 }], { wiggle: 6 });
  assert.equal(d, 'M 0 0 Q 5.00 -6.00 10 0');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module '../js/route-svg.js'`

- [ ] **Step 3: Write the minimal implementation**

`js/route-svg.js`:

```js
function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function perpendicularOffset(a, b, distance) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: (-dy / length) * distance, y: (dx / length) * distance };
}

export function buildRoutePathD(waypoints, { wiggle = 3 } = {}) {
  if (waypoints.length < 2) {
    return '';
  }
  let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
  for (let i = 1; i < waypoints.length; i += 1) {
    const start = waypoints[i - 1];
    const end = waypoints[i];
    const mid = midpoint(start, end);
    const direction = i % 2 === 0 ? 1 : -1;
    const offset = perpendicularOffset(start, end, wiggle * direction);
    const controlX = mid.x + offset.x;
    const controlY = mid.y + offset.y;
    d += ` Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${end.x} ${end.y}`;
  }
  return d;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/`
Expected: PASS — 10 tests total, 0 failures

- [ ] **Step 5: Commit**

```bash
git add js/route-svg.js tests/route-svg.test.mjs
git commit -m "feat: add hand-drawn route svg path builder"
```

---

### Task 3: Trip data model and schema test

**Files:**
- Create: `js/data.js`
- Create: `images/placeholder-cover.svg`
- Create: `images/placeholder-destination.svg`
- Test: `tests/data-schema.test.mjs`

**Interfaces:**
- Produces: `tripData: { trip: {title:string, coverImage:string, tagline:string}, days: {date:string, title:string, items:{time:string,title:string,transport:string,note:string}[]}[], route: {waypoints:{x:number,y:number,label:string}[]}, budget: {currency:string, categories:{name:string, items:{label:string,amount:number}[]}[]}, destinations: {name:string,image:string,summary:string,detail:string}[] }` — consumed by Task 5 (cover), Task 6 (timeline), Task 7 (route), Task 8 (budget), Task 9 (destinations).

- [ ] **Step 1: Write the failing test**

`tests/data-schema.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tripData } from '../js/data.js';

test('tripData has the required top-level sections', () => {
  assert.ok(tripData.trip, 'missing trip');
  assert.ok(Array.isArray(tripData.days), 'days must be an array');
  assert.ok(tripData.route && Array.isArray(tripData.route.waypoints), 'route.waypoints must be an array');
  assert.ok(tripData.budget && Array.isArray(tripData.budget.categories), 'budget.categories must be an array');
  assert.ok(Array.isArray(tripData.destinations), 'destinations must be an array');
});

test('trip has title, coverImage and tagline', () => {
  const { trip } = tripData;
  assert.equal(typeof trip.title, 'string');
  assert.equal(typeof trip.coverImage, 'string');
  assert.equal(typeof trip.tagline, 'string');
});

test('each day has a date and a non-empty items array', () => {
  for (const day of tripData.days) {
    assert.equal(typeof day.date, 'string');
    assert.ok(Array.isArray(day.items) && day.items.length > 0, `day ${day.date} needs items`);
  }
});

test('each route waypoint has x, y and a label', () => {
  for (const point of tripData.route.waypoints) {
    assert.equal(typeof point.x, 'number');
    assert.equal(typeof point.y, 'number');
    assert.equal(typeof point.label, 'string');
  }
});

test('each budget category has a name and items with numeric amounts', () => {
  for (const category of tripData.budget.categories) {
    assert.equal(typeof category.name, 'string');
    for (const item of category.items) {
      assert.equal(typeof item.label, 'string');
      assert.equal(typeof item.amount, 'number');
    }
  }
});

test('each destination has name, image and summary', () => {
  for (const dest of tripData.destinations) {
    assert.equal(typeof dest.name, 'string');
    assert.equal(typeof dest.image, 'string');
    assert.equal(typeof dest.summary, 'string');
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module '../js/data.js'`

- [ ] **Step 3: Create placeholder images**

`images/placeholder-cover.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f0c9a8"/><text x="400" y="600" font-size="48" text-anchor="middle" fill="#4a3728" font-family="sans-serif">封面照片占位</text></svg>
```

`images/placeholder-destination.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f0c9a8"/><text x="200" y="150" font-size="24" text-anchor="middle" fill="#4a3728" font-family="sans-serif">目的地照片占位</text></svg>
```

- [ ] **Step 4: Write the minimal implementation**

`js/data.js`:

```js
export const tripData = {
  trip: {
    title: '待填写的旅行标题',
    coverImage: 'images/placeholder-cover.svg',
    tagline: '一句关于这趟旅行的话，之后替换成真的。',
  },
  days: [
    {
      date: '2026-08-01',
      title: 'Day 1 · 占位地点',
      items: [
        { time: '09:00', title: '占位行程项', transport: '待定', note: '' },
      ],
    },
  ],
  route: {
    waypoints: [
      { x: 10, y: 80, label: '出发地（占位）' },
      { x: 50, y: 40, label: '中转地（占位）' },
      { x: 90, y: 20, label: '目的地（占位）' },
    ],
  },
  budget: {
    currency: '¥',
    categories: [
      {
        name: '交通',
        items: [{ label: '占位交通费', amount: 0 }],
      },
      {
        name: '住宿',
        items: [{ label: '占位住宿费', amount: 0 }],
      },
    ],
  },
  destinations: [
    {
      name: '占位目的地',
      image: 'images/placeholder-destination.svg',
      summary: '一句简介，之后替换。',
      detail: '更详细的介绍文字，之后替换。',
    },
  ],
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tests/`
Expected: PASS — 16 tests total, 0 failures

- [ ] **Step 6: Commit**

```bash
git add js/data.js images/placeholder-cover.svg images/placeholder-destination.svg tests/data-schema.test.mjs
git commit -m "feat: add trip data model with placeholder content"
```

---

### Task 4: Page skeleton and base styles

**Files:**
- Create: `index.html`
- Create: `css/style.css`

**Interfaces:**
- Produces: DOM element ids consumed by later tasks — `cover`, `cover-image`, `cover-title`, `cover-tagline`, `enter-btn`, `main-content`, `timeline-list`, `route-svg-container`, `budget-list`, `budget-total`, `approve-budget-btn`, `approve-status`, `destinations-list`, `mood-buttons`, `message-input`, `send-message-btn`, `message-status`.

- [ ] **Step 1: Create the HTML skeleton**

`index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>旅行计事本</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <section id="cover" class="cover">
    <img id="cover-image" class="cover-image" src="" alt="" />
    <div class="cover-overlay">
      <h1 id="cover-title" class="cover-title"></h1>
      <p id="cover-tagline" class="cover-tagline"></p>
      <button id="enter-btn" class="enter-btn" type="button">点击进入旅行 →</button>
    </div>
  </section>

  <main id="main-content" class="main-content hidden">
    <section id="timeline" class="section">
      <h2>行程时间线</h2>
      <div id="timeline-list" class="timeline-list"></div>
    </section>

    <section id="route" class="section">
      <h2>旅行路线</h2>
      <div id="route-svg-container" class="route-svg-container"></div>
    </section>

    <section id="budget" class="section">
      <h2>预算明细</h2>
      <div id="budget-list" class="budget-list"></div>
      <p id="budget-total" class="budget-total"></p>
      <button id="approve-budget-btn" class="approve-btn" type="button">批准预算 ✓</button>
      <p id="approve-status" class="form-status" hidden></p>
    </section>

    <section id="destinations" class="section">
      <h2>目的地</h2>
      <div id="destinations-list" class="destinations-list"></div>
    </section>

    <section id="mood-message" class="section">
      <h2>今天的心情</h2>
      <div id="mood-buttons" class="mood-buttons"></div>
      <textarea id="message-input" class="message-input" placeholder="想说点什么..."></textarea>
      <button id="send-message-btn" class="send-btn" type="button">发送留言</button>
      <p id="message-status" class="form-status" hidden></p>
    </section>
  </main>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create the base styles**

`css/style.css`:

```css
:root {
  --color-paper: #fbf3e7;
  --color-ink: #4a3728;
  --color-accent: #d97757;
  --color-accent-soft: #f0c9a8;
  --font-heading: 'Segoe Print', 'Comic Sans MS', cursive, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.6;
}

.hidden {
  display: none !important;
}

.cover {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 32px 24px 48px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  color: #fff;
  text-align: center;
}

.cover-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  margin: 0 0 8px;
}

.cover-tagline {
  margin: 0 0 24px;
  font-size: 1rem;
}

.enter-btn,
.approve-btn,
.send-btn {
  border: 2px solid var(--color-accent);
  background: var(--color-accent);
  color: #fff;
  border-radius: 999px;
  padding: 12px 28px;
  font-size: 1rem;
  cursor: pointer;
}

.enter-btn:hover,
.approve-btn:hover,
.send-btn:hover {
  filter: brightness(1.05);
}

.main-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 64px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  font-family: var(--font-heading);
  border-bottom: 2px dashed var(--color-accent-soft);
  padding-bottom: 8px;
}

.timeline-list .day-entry {
  border: 1px solid var(--color-accent-soft);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.day-entry summary {
  cursor: pointer;
  padding: 12px 16px;
  font-weight: bold;
  background: var(--color-accent-soft);
}

.day-entry .day-items {
  padding: 12px 16px;
}

.route-svg-container svg {
  width: 100%;
  height: auto;
}

.budget-list .budget-category {
  margin-bottom: 12px;
}

.budget-total {
  font-size: 1.2rem;
  font-weight: bold;
}

.destinations-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.destination-card {
  border: 1px solid var(--color-accent-soft);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.destination-card img {
  width: 100%;
  display: block;
}

.destination-card .destination-detail {
  padding: 12px 16px;
}

.mood-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.mood-buttons button {
  font-size: 1.5rem;
  background: none;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
}

.mood-buttons button.selected {
  border-color: var(--color-accent);
}

.message-input {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid var(--color-accent-soft);
  border-radius: 8px;
  font-family: inherit;
  margin-bottom: 12px;
}

.form-status {
  margin-top: 8px;
}

@media (min-width: 640px) {
  .destinations-list {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 3: Manually verify in the browser**

Open `index.html` directly in a browser (double-click the file, or `npx serve .` and visit the printed URL).
Expected: full-screen cover section fills the viewport with the accent-colored placeholder image, an empty title/tagline, and an "点击进入旅行 →" button; the sections below are present in the HTML but hidden (no visible content yet, since `js/app.js` doesn't exist until Task 5).

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add page skeleton and base styles"
```

---

### Task 5: Cover click-to-enter interaction

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Consumes: `tripData` from `js/data.js` (Task 3); DOM ids from `index.html` (Task 4).
- Produces: none exported (entry point script); establishes the `initCover()` pattern that later tasks extend within this same file.

- [ ] **Step 1: Write the cover logic**

`js/app.js`:

```js
import { tripData } from './data.js';

function initCover() {
  const coverImage = document.getElementById('cover-image');
  const coverTitle = document.getElementById('cover-title');
  const coverTagline = document.getElementById('cover-tagline');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const cover = document.getElementById('cover');

  coverImage.src = tripData.trip.coverImage;
  coverImage.alt = tripData.trip.title;
  coverTitle.textContent = tripData.trip.title;
  coverTagline.textContent = tripData.trip.tagline;

  enterBtn.addEventListener('click', () => {
    mainContent.classList.remove('hidden');
    cover.classList.add('entered');
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
}

initCover();
```

- [ ] **Step 2: Manually verify in the browser**

Reload `index.html`.
Expected: cover shows the placeholder image, title "待填写的旅行标题", and tagline text. Clicking "点击进入旅行 →" reveals the (still-empty) sections below and scrolls to them.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: add cover click-to-enter interaction"
```

---

### Task 6: Day-by-day timeline rendering

**Files:**
- Create: `js/render.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `tripData.days` shape from Task 3.
- Produces: `renderTimeline(days, containerEl): void` — called from `js/app.js`.

- [ ] **Step 1: Write the render function**

`js/render.js`:

```js
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
```

- [ ] **Step 2: Wire it into the app**

`js/app.js` (full file):

```js
import { tripData } from './data.js';
import { renderTimeline } from './render.js';

function initCover() {
  const coverImage = document.getElementById('cover-image');
  const coverTitle = document.getElementById('cover-title');
  const coverTagline = document.getElementById('cover-tagline');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const cover = document.getElementById('cover');

  coverImage.src = tripData.trip.coverImage;
  coverImage.alt = tripData.trip.title;
  coverTitle.textContent = tripData.trip.title;
  coverTagline.textContent = tripData.trip.tagline;

  enterBtn.addEventListener('click', () => {
    mainContent.classList.remove('hidden');
    cover.classList.add('entered');
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
}

function initTimeline() {
  const container = document.getElementById('timeline-list');
  renderTimeline(tripData.days, container);
}

initCover();
initTimeline();
```

- [ ] **Step 3: Manually verify in the browser**

Reload `index.html`, click "点击进入旅行 →".
Expected: under "行程时间线", one collapsible entry reading "2026-08-01 · Day 1 · 占位地点" appears; clicking it expands to show "09:00 — 占位行程项（待定）".

- [ ] **Step 4: Commit**

```bash
git add js/render.js js/app.js
git commit -m "feat: render day-by-day timeline"
```

---

### Task 7: Hand-drawn route SVG rendering

**Files:**
- Modify: `js/render.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `buildRoutePathD` from `js/route-svg.js` (Task 2); `tripData.route` shape from Task 3.
- Produces: `renderRoute(route, containerEl): void` — called from `js/app.js`.

- [ ] **Step 1: Add the render function**

`js/render.js` (full file):

```js
import { buildRoutePathD } from './route-svg.js';

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
```

- [ ] **Step 2: Wire it into the app**

`js/app.js` (full file):

```js
import { tripData } from './data.js';
import { renderTimeline, renderRoute } from './render.js';

function initCover() {
  const coverImage = document.getElementById('cover-image');
  const coverTitle = document.getElementById('cover-title');
  const coverTagline = document.getElementById('cover-tagline');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const cover = document.getElementById('cover');

  coverImage.src = tripData.trip.coverImage;
  coverImage.alt = tripData.trip.title;
  coverTitle.textContent = tripData.trip.title;
  coverTagline.textContent = tripData.trip.tagline;

  enterBtn.addEventListener('click', () => {
    mainContent.classList.remove('hidden');
    cover.classList.add('entered');
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
}

function initTimeline() {
  const container = document.getElementById('timeline-list');
  renderTimeline(tripData.days, container);
}

function initRoute() {
  const container = document.getElementById('route-svg-container');
  renderRoute(tripData.route, container);
}

initCover();
initTimeline();
initRoute();
```

- [ ] **Step 3: Manually verify in the browser**

Reload `index.html`, click "点击进入旅行 →".
Expected: under "旅行路线", an SVG shows a slightly wavy line connecting three labeled points ("出发地（占位）" → "中转地（占位）" → "目的地（占位）").

- [ ] **Step 4: Commit**

```bash
git add js/render.js js/app.js
git commit -m "feat: render hand-drawn route svg"
```

---

### Task 8: Budget rendering and "批准预算" submission

**Files:**
- Modify: `js/render.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `computeCategoryTotal`, `computeGrandTotal`, `formatCurrency` from `js/budget.js` (Task 1); `tripData.budget` shape from Task 3.
- Produces: `renderBudget(budget, containerEl, totalEl): void`; `submitToFormspree(payload): Promise<boolean>` and `showStatus(el, message): void` in `js/app.js`, reused by Task 10.

- [ ] **Step 1: Add the render function**

`js/render.js` — add this import alongside the existing `import { buildRoutePathD } from './route-svg.js';` at the top of the file:

```js
import { computeCategoryTotal, computeGrandTotal, formatCurrency } from './budget.js';
```

Then append this export after `renderRoute`:

```js
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
```

- [ ] **Step 2: Wire it into the app with Formspree submission**

`js/app.js` (full file):

```js
import { tripData } from './data.js';
import { renderTimeline, renderRoute, renderBudget } from './render.js';

// 见 README.md：注册 Formspree 后把下面这行换成你自己的表单地址
const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

function initCover() {
  const coverImage = document.getElementById('cover-image');
  const coverTitle = document.getElementById('cover-title');
  const coverTagline = document.getElementById('cover-tagline');
  const enterBtn = document.getElementById('enter-btn');
  const mainContent = document.getElementById('main-content');
  const cover = document.getElementById('cover');

  coverImage.src = tripData.trip.coverImage;
  coverImage.alt = tripData.trip.title;
  coverTitle.textContent = tripData.trip.title;
  coverTagline.textContent = tripData.trip.tagline;

  enterBtn.addEventListener('click', () => {
    mainContent.classList.remove('hidden');
    cover.classList.add('entered');
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
}

function initTimeline() {
  const container = document.getElementById('timeline-list');
  renderTimeline(tripData.days, container);
}

function initRoute() {
  const container = document.getElementById('route-svg-container');
  renderRoute(tripData.route, container);
}

async function submitToFormspree(payload) {
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function showStatus(el, message) {
  el.textContent = message;
  el.hidden = false;
}

function initBudget() {
  const listEl = document.getElementById('budget-list');
  const totalEl = document.getElementById('budget-total');
  renderBudget(tripData.budget, listEl, totalEl);

  const approveBtn = document.getElementById('approve-budget-btn');
  const statusEl = document.getElementById('approve-status');
  approveBtn.addEventListener('click', async () => {
    approveBtn.disabled = true;
    const ok = await submitToFormspree({ type: '批准预算', message: '男朋友批准了这份预算 ✓' });
    showStatus(statusEl, ok ? '已发送！' : '发送失败，请稍后重试');
    approveBtn.disabled = false;
  });
}

initCover();
initTimeline();
initRoute();
initBudget();
```

- [ ] **Step 3: Manually verify in the browser**

Reload `index.html`, click "点击进入旅行 →".
Expected: under "预算明细", "交通 · ¥0" and "住宿 · ¥0" categories appear with their line items, followed by "总计：¥0". Clicking "批准预算 ✓" shows "发送失败，请稍后重试" below the button — this is expected right now because `FORM_ENDPOINT` is still a placeholder; it confirms the error path works. It will show "已发送！" once Task 11's real Formspree endpoint is configured.

- [ ] **Step 4: Commit**

```bash
git add js/render.js js/app.js
git commit -m "feat: render budget summary and approve action"
```

---

### Task 9: Destination cards rendering

**Files:**
- Modify: `js/render.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `tripData.destinations` shape from Task 3.
- Produces: `renderDestinations(destinations, containerEl): void` — called from `js/app.js`.

- [ ] **Step 1: Add the render function**

`js/render.js` — append this export after `renderBudget`:

```js
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
```

- [ ] **Step 2: Wire it into the app**

In `js/app.js`, update the import line and add `initDestinations`:

```js
import { renderTimeline, renderRoute, renderBudget, renderDestinations } from './render.js';
```

```js
function initDestinations() {
  const container = document.getElementById('destinations-list');
  renderDestinations(tripData.destinations, container);
}
```

Add `initDestinations();` after `initBudget();` at the bottom of the file.

- [ ] **Step 3: Manually verify in the browser**

Reload `index.html`, click "点击进入旅行 →".
Expected: under "目的地", one card shows the placeholder image, "占位目的地", and its summary; the detail text ("更详细的介绍文字，之后替换。") is hidden until the card is clicked, then toggles visible/hidden on repeated clicks.

- [ ] **Step 4: Commit**

```bash
git add js/render.js js/app.js
git commit -m "feat: render destination cards"
```

---

### Task 10: Mood picker and message board

**Files:**
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `submitToFormspree` and `showStatus` from Task 8 (same file).
- Produces: none new (final interactive feature in the entry-point script).

- [ ] **Step 1: Add the mood/message logic**

In `js/app.js`, add this function after `initDestinations`:

```js
const MOODS = ['😍', '😌', '🥹', '😴', '🤩'];

function initMood() {
  const wrap = document.getElementById('mood-buttons');
  let selectedMood = null;

  MOODS.forEach((emoji) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMood = emoji;
    });
    wrap.appendChild(btn);
  });

  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-message-btn');
  const statusEl = document.getElementById('message-status');

  sendBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (!selectedMood && !message) {
      showStatus(statusEl, '选个心情或者写点什么吧～');
      return;
    }
    sendBtn.disabled = true;
    const ok = await submitToFormspree({ type: '心情留言', mood: selectedMood, message });
    showStatus(statusEl, ok ? '已发送！' : '发送失败，请稍后重试');
    if (ok) {
      messageInput.value = '';
    }
    sendBtn.disabled = false;
  });
}
```

Add `initMood();` after `initDestinations();` at the bottom of the file.

- [ ] **Step 2: Manually verify in the browser**

Reload `index.html`, click "点击进入旅行 →".
Expected: under "今天的心情", five emoji buttons appear; clicking one highlights it (accent border). Clicking "发送留言" with no mood selected and an empty textarea shows "选个心情或者写点什么吧～". Selecting a mood and clicking "发送留言" shows "发送失败，请稍后重试" (expected — placeholder endpoint), and the textarea is not cleared. This confirms the interaction and error path work correctly before Task 11 wires up the real endpoint.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: add mood picker and message board"
```

---

### Task 11: README and deployment instructions

**Files:**
- Create: `README.md`

**Interfaces:** None (documentation only).

- [ ] **Step 1: Write the README**

`README.md`:

```markdown
# 旅行计事本

给男朋友看的旅行计划页面。纯静态网页，无需构建工具。

## 本地预览

直接双击打开 `index.html`，或者在项目目录下运行：

    npx serve .

然后在浏览器打开命令行里打印出的地址。

## 运行测试

    npm test

跑的是 `js/budget.js`、`js/route-svg.js`、`js/data.js` 这几个纯逻辑模块的单元测试（Node 内置测试框架，不需要额外安装依赖）。要求 Node.js >= 18。

## 上线前需要你自己做的三件事

Claude 不会替你注册第三方账号，以下步骤需要你自己完成：

1. **申请免费表单服务（用来接收男朋友的留言/批准预算）**
   - 打开 https://formspree.io ，免费注册一个账号，创建一个新表单。
   - 复制它给你的表单地址，格式类似 `https://formspree.io/f/xxxxxxx`。
   - 把这个地址发给 Claude，或者自己打开 `js/app.js`，把顶部的 `FORM_ENDPOINT` 常量替换成这个真实地址。
   - 替换后，重新打开页面测试一下"批准预算"或"发送留言"，应该会显示"已发送！"，并且你的邮箱（renata.rt.1027@gmail.com）能收到一封通知邮件。

2. **建一个 GitHub 仓库并把代码推上去**
   - 在 https://github.com 上新建一个仓库（比如叫 `travel-plan`）。
   - 按 GitHub 给出的提示，把这个本地项目 push 上去。

3. **用 Vercel 部署（免费）**
   - 打开 https://vercel.com ，可以直接用 GitHub 账号登录。
   - 选择"Import Project"，选中刚才的 GitHub 仓库。
   - 因为是纯静态网站，Vercel 会自动识别，不需要填构建命令，直接点部署即可。
   - 部署完成后会拿到一个形如 `https://travel-plan-xxxx.vercel.app` 的链接，这个链接可以直接发给男朋友。

## 之后怎么更新内容

把新的行程内容告诉 Claude，由 Claude 修改 `js/data.js` 并帮你 `git push`；Vercel 检测到仓库更新后会自动重新部署，链接不会变。
```

- [ ] **Step 2: Verify the documented commands actually work**

Run: `npm test`
Expected: PASS — all tests from Tasks 1–3 pass (16 tests, 0 failures).

Run: `npx serve .` (or open `index.html` directly), click through the full page end to end.
Expected: cover → click enter → timeline expands → route svg renders → budget totals show → destination card toggles → mood buttons select → message send shows the expected placeholder-endpoint failure message. No console errors in the browser dev tools unrelated to the expected Formspree failure.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add local dev and deployment instructions"
```

---

## After This Plan

The site is feature-complete with placeholder content. Remaining work is either the user's manual account setup (documented in `README.md`, Task 11) or a follow-up task once the user provides the real itinerary: replace the contents of `js/data.js` with the actual trip data (same schema, validated by `tests/data-schema.test.mjs`) and add real photos to `images/`.
