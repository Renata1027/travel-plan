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
