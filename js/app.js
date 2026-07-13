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
