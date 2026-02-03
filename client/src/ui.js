import placeholder from './assets/img/poster-placeholder.png';

const listEl = () => document.getElementById('list');
const statusLayerEl = () => document.getElementById('statusLayer');

export function setBusy(isBusy) {
    listEl().setAttribute('aria-busy', isBusy ? 'true' : 'false');
}

export function renderSkeleton(count = 4) {
    const items = Array.from({ length: count }).map(() => skeletonItem()).join('');
    listEl().innerHTML = items;
}

export function renderNews(items) {
    listEl().innerHTML = items.map(newsItem).join('');
    hideErrorLayer();
}

export function showErrorLayer() {
    statusLayerEl().classList.remove('status-layer--hidden');
}

export function hideErrorLayer() {
    statusLayerEl().classList.add('status-layer--hidden');
}

function skeletonItem() {
    return `
    <li class="news-item skeleton">
      <div class="thumb"></div>
      <div class="bar bar--title"></div>
      <div>
        <div class="bar bar--line1" style="margin-bottom: 8px;"></div>
        <div class="bar bar--line2"></div>
      </div>
    </li>
  `;
}

function newsItem(x) {
    const title = escapeHtml(x.title);
    const text = escapeHtml(x.text);
    const img = x.image || placeholder;

    return `
    <li class="news-item">
      <div class="news-item__thumb">
        <img src="${img}" alt="" loading="lazy" />
      </div>
      <h3 class="news-item__title">${title}</h3>
      <p class="news-item__text">${text}</p>
    </li>
  `;
}

function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}