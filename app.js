/*
 * Gizmo Lab is a static, browser-only science lab.
 * Experiments, worksheets, notes, and answers are stored in localStorage.
 * There are intentionally no AI/API calls in this version.
 */

const DEFAULT_EXPERIMENTS = [
  {
    id: 'pendulum-lab',
    title: 'Pendulum playground',
    subject: 'Physics',
    grade: 'Grades 6–9',
    duration: '10 min',
    description: 'What makes a pendulum swing faster? Change its length and gravity to uncover the rhythm of motion.',
    template: 'pendulum',
    creator: 'Gizmo Lab',
    steps: [
      'Start the pendulum and notice its rhythm.',
      'Change one variable at a time. Keep the other setting the same.',
      'Compare the swing period and write down a pattern you notice.',
      'Make a prediction, then test it with a new setting.'
    ],
    defaults: { length: 1.2, gravity: 9.8 },
    worksheet: {
      id: 'sheet-pendulum',
      title: 'Pendulum observations',
      instructions: 'Explore the model. Change one variable at a time and use evidence from your trials to explain the motion.',
      questions: [
        'How does changing the length of the pendulum affect the time for one swing?',
        'What happened to the swing period when you changed gravity? Use a result from your test.',
        'A pendulum clock is running too slowly. What change would you try, and why?',
        'What is one new question you would like to investigate?'
      ]
    }
  },
  {
    id: 'plant-lab',
    title: 'A little more sunlight',
    subject: 'Biology',
    grade: 'Grades 4–8',
    duration: '12 min',
    description: 'Give a tiny seedling different amounts of light and water. Find out what helps it grow strong.',
    template: 'plant',
    creator: 'Gizmo Lab',
    steps: [
      'Choose a number of days for your growing experiment.',
      'Try a low, medium, and high amount of sunlight.',
      'Adjust the water. Look for the balance that helps the plant thrive.',
      'Describe what your strongest-growing plant had in common.'
    ],
    defaults: { sunlight: 8, water: 60, days: 18 },
    worksheet: {
      id: 'sheet-plant',
      title: 'Seedling scientist',
      instructions: 'Run a few growing trials. Change one condition at a time so you can tell which factor made a difference.',
      questions: [
        'Which combination of sunlight and water produced the tallest seedling?',
        'Can a plant have too much of a good thing? Describe what the model showed.',
        'What did you keep the same while comparing two trials?',
        'What would you change if you ran this investigation again?'
      ]
    }
  },
  {
    id: 'circuit-lab',
    title: 'Light up the circuit',
    subject: 'Physics',
    grade: 'Grades 6–9',
    duration: '8 min',
    description: 'Build an easy circuit in your head, then play with voltage and resistance to brighten the bulb.',
    template: 'circuit',
    creator: 'Gizmo Lab',
    steps: [
      'Look at the complete loop connecting the battery and bulb.',
      'Increase the voltage and watch the current reading.',
      'Change the resistance. Notice what happens to the bulb.',
      'Explain how voltage and resistance work together in a circuit.'
    ],
    defaults: { voltage: 4.5, resistance: 22 },
    worksheet: {
      id: 'sheet-circuit',
      title: 'Circuit detective',
      instructions: 'Use the circuit model to test how voltage and resistance affect the flow of electric current.',
      questions: [
        'What happens to the current when you increase the battery voltage?',
        'How does adding resistance change the brightness of the bulb?',
        'Which setting gave you the brightest bulb? Record the voltage and resistance.',
        'How would you explain the relationship between voltage, resistance, and current?'
      ]
    }
  }
];

const STORAGE_KEYS = {
  experiments: 'gizmo-lab.experiments.v1',
  worksheets: 'gizmo-lab.worksheets.v1',
  answers: 'gizmo-lab.answers.v1',
  favorites: 'gizmo-lab.favorites.v1',
  notes: 'gizmo-lab.notes.v1'
};

const ICONS = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/><path d="M8 21v-6h8v6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.6 5-5 2.6 2.6-5 5-2.6Z"/>',
  flask: '<path d="M9 3h6M10 3v6.2L4.7 18a2 2 0 0 0 1.7 3h11.2a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M7 15h10"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sparkles: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/><path d="m5 3 .6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6L5 3Z"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  leaf: '<path d="M20 4c-8.5 0-14 3.6-14 10a6 6 0 0 0 6 6c6.4 0 8-7.4 8-16Z"/><path d="M5 21c2.5-4.5 6-7.5 11-10"/>',
  zap: '<path d="m13 2-3 8h7l-6 12 1-9H5l8-11Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  rotate: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.4-3"/>',
  note: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  printer: '<path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6zM18 12h.01"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/>',
  beaker: '<path d="M9 3h6m-5 0v6l-5.4 9a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9V3M7 15h10"/><circle cx="10" cy="17" r=".7"/><circle cx="14" cy="18" r=".7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
};

function iconMarkup(name, size = 18) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.sparkles}</svg>`;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save ${key} to local storage.`, error);
    showToast('This browser could not save your changes. Check your storage settings.');
    return false;
  }
}

let userExperiments = readStorage(STORAGE_KEYS.experiments, []);
let userWorksheets = readStorage(STORAGE_KEYS.worksheets, []);
let worksheetAnswers = readStorage(STORAGE_KEYS.answers, {});
let favorites = readStorage(STORAGE_KEYS.favorites, []);
let experimentNotes = readStorage(STORAGE_KEYS.notes, {});
let currentView = 'overview';
let currentExperimentId = null;
let currentWorksheetId = null;
let currentDetailTab = 'lab';
let detailReturnView = 'discover';
let activeFilter = 'All';
let searchQuery = '';
let toastTimer = null;
const simulationValues = {};

const appContent = document.getElementById('app-content');
const sidebar = document.getElementById('sidebar');
const mobileScrim = document.getElementById('mobile-scrim');
const toastElement = document.getElementById('toast');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function uid(prefix = 'item') {
  const random = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function allExperiments() {
  return [...DEFAULT_EXPERIMENTS, ...userExperiments];
}

function allWorksheets() {
  const builtIn = DEFAULT_EXPERIMENTS.filter((experiment) => experiment.worksheet).map((experiment) => ({
    ...experiment.worksheet,
    experimentId: experiment.id,
    creator: 'Gizmo Lab',
    isDefault: true
  }));
  return [...userWorksheets, ...builtIn];
}

function getExperiment(id) {
  return allExperiments().find((experiment) => experiment.id === id) || null;
}

function getWorksheet(id) {
  return allWorksheets().find((worksheet) => worksheet.id === id) || null;
}

function getWorksheetForExperiment(experimentId) {
  return userWorksheets.find((worksheet) => worksheet.experimentId === experimentId)
    || DEFAULT_EXPERIMENTS.find((experiment) => experiment.id === experimentId)?.worksheet
    || null;
}

function currentExperiment() {
  return getExperiment(currentExperimentId);
}

function valueDefaults(experiment) {
  if (experiment.defaults) return { ...experiment.defaults };
  if (experiment.template === 'plant') return { sunlight: 8, water: 60, days: 18 };
  if (experiment.template === 'circuit') return { voltage: 4.5, resistance: 22 };
  return { length: 1.2, gravity: 9.8 };
}

function currentValues(experiment) {
  if (!simulationValues[experiment.id]) simulationValues[experiment.id] = valueDefaults(experiment);
  return simulationValues[experiment.id];
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastElement.classList.remove('is-visible'), 2800);
}

function setView(view) {
  currentView = view;
  if (view !== 'experiment') currentExperimentId = null;
  if (view !== 'worksheet-reader') currentWorksheetId = null;
  closeMobileNav();
  render();
  appContent.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavigation() {
  document.getElementById('my-lab-count').textContent = userExperiments.length;
  const discoverCount = document.querySelector('[data-view="discover"] .nav-count');
  const savedCount = document.getElementById('saved-count');
  if (discoverCount) discoverCount.textContent = allExperiments().length;
  if (savedCount) savedCount.textContent = favorites.length;
  document.querySelectorAll('.nav-item[data-view]').forEach((item) => {
    const experimentParentView = detailReturnView === 'worksheet-reader' ? 'worksheets' : detailReturnView;
    const selected = currentView === item.dataset.view
      || (currentView === 'experiment' && item.dataset.view === experimentParentView)
      || (currentView === 'worksheet-reader' && item.dataset.view === 'worksheets');
    item.classList.toggle('is-active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function updateBreadcrumb() {
  const crumb = document.getElementById('breadcrumbs');
  let label = 'Overview';
  if (currentView === 'discover') label = 'Explore';
  if (currentView === 'my-lab') label = 'My experiments';
  if (currentView === 'saved') label = 'Saved experiments';
  if (currentView === 'worksheets') label = 'Worksheets';
  if (currentView === 'experiment') label = currentExperiment()?.title || 'Experiment';
  if (currentView === 'worksheet-reader') label = currentWorksheet()?.title || 'Worksheet';
  crumb.innerHTML = `<span>Lab space</span><span class="crumb-slash">/</span><strong>${escapeHtml(label)}</strong>`;
  document.title = `${label === 'Overview' ? 'Gizmo Lab' : `${label} · Gizmo Lab`}`;
}

function currentWorksheet() {
  return getWorksheet(currentWorksheetId);
}

function render() {
  updateNavigation();
  updateBreadcrumb();
  if (currentView === 'overview') appContent.innerHTML = renderOverview();
  else if (currentView === 'discover') appContent.innerHTML = renderDiscover();
  else if (currentView === 'my-lab') appContent.innerHTML = renderMyLab();
  else if (currentView === 'saved') appContent.innerHTML = renderSaved();
  else if (currentView === 'worksheets') appContent.innerHTML = renderWorksheets();
  else if (currentView === 'experiment') appContent.innerHTML = renderExperimentDetail();
  else if (currentView === 'worksheet-reader') appContent.innerHTML = renderWorksheetReader();
  else appContent.innerHTML = renderOverview();
}

function subjectIcon(subject) {
  if (/bio|life/i.test(subject)) return 'leaf';
  if (/phys/i.test(subject)) return 'zap';
  if (/earth/i.test(subject)) return 'layers';
  return 'flask';
}

function themeClass(experiment) {
  if (experiment.template === 'plant' || /bio/i.test(experiment.subject)) return 'theme-green';
  if (experiment.template === 'circuit') return 'theme-blue';
  if (experiment.template === 'pendulum') return 'theme-violet';
  return 'theme-amber';
}

function cardArtwork(experiment) {
  if (experiment.template === 'plant') {
    return '<div class="mini-sun"></div><div class="mini-stem"><i class="mini-leaf left"></i><i class="mini-leaf right"></i><i class="mini-leaf top"></i></div><div class="mini-pot"></div>';
  }
  if (experiment.template === 'circuit') {
    return '<div class="mini-circuit"><i class="mini-battery"></i><i class="mini-resistor"></i><i class="mini-bulb"></i></div>';
  }
  return '<div class="mini-orbit"></div><i class="mini-pivot"></i><i class="mini-string"></i>';
}

function experimentCard(experiment, index = 0) {
  const isFavorite = favorites.includes(experiment.id);
  const source = experiment.creator && experiment.creator !== 'Gizmo Lab' ? 'YOUR LAB' : 'GIZMO PICK';
  return `
    <article class="experiment-card" style="--card-index:${index}">
      <div class="card-cover ${themeClass(experiment)}">
        <div class="cover-topline">
          <span class="subject-pill">${iconMarkup(subjectIcon(experiment.subject), 11)}${escapeHtml(experiment.subject)}</span>
          <button class="favorite-button ${isFavorite ? 'is-favorite' : ''}" type="button" data-favorite-id="${escapeHtml(experiment.id)}" aria-label="${isFavorite ? 'Remove from saved' : 'Save'} ${escapeHtml(experiment.title)}" aria-pressed="${isFavorite}">${iconMarkup('bookmark', 14)}</button>
        </div>
        <span class="card-source">${escapeHtml(source)}</span>
        <div class="card-artwork ${themeClass(experiment)}">${cardArtwork(experiment)}</div>
        <button class="cover-open" type="button" data-open-experiment="${escapeHtml(experiment.id)}" aria-label="Open ${escapeHtml(experiment.title)}"></button>
      </div>
      <button class="card-title-action" type="button" data-open-experiment="${escapeHtml(experiment.id)}">${escapeHtml(experiment.title)}</button>
      <p class="card-description">${escapeHtml(experiment.description)}</p>
      <div class="card-footer">
        <div class="card-meta"><span>${iconMarkup('clock', 11)}${escapeHtml(experiment.duration || '10 min')}</span><span>${iconMarkup('layers', 11)}${escapeHtml(experiment.grade || 'All ages')}</span></div>
        <button class="card-arrow" type="button" data-open-experiment="${escapeHtml(experiment.id)}" aria-label="Explore ${escapeHtml(experiment.title)}">${iconMarkup('arrowRight', 13)}</button>
      </div>
    </article>`;
}

function renderOverview() {
  const featured = allExperiments().slice(0, 3);
  const worksheetCount = allWorksheets().length;
  const date = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  return `
    <section class="page-heading welcome-heading">
      <div><div class="eyebrow">A PLACE FOR CURIOUS MINDS</div><h1>Good ideas start <span>here.</span></h1><p>Welcome to your hands-on science lab. Pick an experiment, follow a question, and see where it takes you.</p></div>
      <div class="heading-date">${iconMarkup('calendar', 14)}${escapeHtml(date)}</div>
    </section>
    <section class="welcome-hero" aria-label="Create your own experiment">
      <div class="hero-copy">
        <div class="hero-label">MAKE ROOM FOR WONDER</div>
        <h2>Your next big discovery starts with a small question.</h2>
        <p>Build a simple interactive experiment, explore a ready-made lab, or make a worksheet for your learners.</p>
        <div class="hero-actions"><button class="button button-dark" type="button" data-action="new-experiment">${iconMarkup('plus', 15)}Create an experiment</button><button class="button button-light" type="button" data-view="discover">Explore the lab${iconMarkup('arrowRight', 14)}</button></div>
      </div>
      <div class="hero-visual" aria-hidden="true"><div class="hero-sun">${iconMarkup('sparkles', 58)}</div><i class="hero-dot dot-one"></i><i class="hero-dot dot-two"></i><i class="hero-dot dot-three"></i><span class="hero-atom">H₂</span><div class="hero-sticker">${iconMarkup('beaker', 14)} QUESTIONS WELCOME</div></div>
    </section>
    <section class="stats-row" aria-label="Your lab at a glance">
      <div class="stat-item"><span class="stat-icon">${iconMarkup('flask', 16)}</span><div class="stat-copy"><strong>${userExperiments.length}</strong><span>Your experiments</span></div></div>
      <div class="stat-item"><span class="stat-icon">${iconMarkup('book', 16)}</span><div class="stat-copy"><strong>${worksheetCount}</strong><span>Ready-to-use worksheets</span></div></div>
      <div class="stat-item"><span class="stat-icon">${iconMarkup('bookmark', 16)}</span><div class="stat-copy"><strong>${favorites.length}</strong><span>Saved for later</span></div></div>
    </section>
    <section aria-labelledby="start-exploring-title">
      <div class="section-head"><div><h2 id="start-exploring-title">A few good places to start</h2><p>Hands-on ideas, ready when you are.</p></div><button class="text-link" type="button" data-view="discover">Browse all experiments ${iconMarkup('arrowRight', 13)}</button></div>
      <div class="featured-grid">${featured.map(experimentCard).join('')}</div>
    </section>
    <div class="home-bottom-grid">
      <section class="discovery-banner"><div><div class="eyebrow">GOT AN IDEA?</div><h3>Turn your curiosity into a lab.</h3><p>Choose a model, add your own directions, and start testing.</p><button class="text-link" type="button" data-action="new-experiment">Build an experiment ${iconMarkup('arrowRight', 13)}</button></div><div class="banner-decoration">${iconMarkup('target', 38)}</div></section>
      <section class="worksheet-promo"><div class="worksheet-promo-icon">${iconMarkup('note', 20)}</div><div><h3>Make learning stick.</h3><p>Create a worksheet with questions learners can answer as they explore.</p><button class="text-link" type="button" data-action="new-worksheet">Create a worksheet ${iconMarkup('arrowRight', 13)}</button></div></section>
    </div>`;
}

function searchAndFilterExperiments() {
  const query = searchQuery.trim().toLocaleLowerCase();
  return allExperiments().filter((experiment) => {
    const matchesQuery = !query || `${experiment.title} ${experiment.subject} ${experiment.description} ${experiment.grade}`.toLocaleLowerCase().includes(query);
    const matchesFilter = activeFilter === 'All' || experiment.subject.toLocaleLowerCase() === activeFilter.toLocaleLowerCase();
    return matchesQuery && matchesFilter;
  });
}

function renderFilterChips() {
  const filters = ['All', 'Physics', 'Biology', 'Chemistry', 'Earth science'];
  return filters.map((filter) => `<button type="button" class="filter-chip ${activeFilter === filter ? 'is-active' : ''}" data-filter="${escapeHtml(filter)}" aria-pressed="${activeFilter === filter}">${escapeHtml(filter)}</button>`).join('');
}

function renderDiscover() {
  const experiments = searchAndFilterExperiments();
  return `
    <section class="page-heading">
      <div><div class="eyebrow">EXPLORE THE POSSIBILITIES</div><h1>Find your next experiment.</h1><p>Try a ready-made Gizmo, change the variables, and see what you discover.</p></div>
      <button class="button button-dark" type="button" data-action="new-experiment">${iconMarkup('plus', 15)}Build your own</button>
    </section>
    <div class="filter-row"><div class="filter-chips" role="group" aria-label="Filter by subject">${renderFilterChips()}</div><span class="results-label">${experiments.length} ${experiments.length === 1 ? 'experiment' : 'experiments'}</span></div>
    ${experiments.length ? `<div class="catalog-grid">${experiments.map(experimentCard).join('')}</div>` : `<div class="empty-state"><span class="empty-state-icon">${iconMarkup('search', 24)}</span><h2>No experiments found</h2><p>Try a different search or subject, or start a brand-new experiment for your lab.</p><button class="button button-light button-small" type="button" data-action="new-experiment">${iconMarkup('plus', 13)}Create an experiment</button></div>`}`;
}

function renderMyLab() {
  if (!userExperiments.length) {
    return `
      <section class="page-heading"><div><div class="eyebrow">MADE BY YOU</div><h1>My experiments.</h1><p>Your own interactive models and investigations will live here.</p></div><button class="button button-dark" type="button" data-action="new-experiment">${iconMarkup('plus', 15)}New experiment</button></section>
      <div class="empty-state"><span class="empty-state-icon">${iconMarkup('flask', 24)}</span><h2>Your lab notebook is waiting.</h2><p>Create an experiment with a subject, a question to explore, and a model to play with. You can add your own worksheet, too.</p><button class="button button-dark" type="button" data-action="new-experiment">${iconMarkup('plus', 14)}Create your first experiment</button></div>`;
  }
  const matching = userExperiments.filter((experiment) => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return !query || `${experiment.title} ${experiment.subject} ${experiment.description}`.toLocaleLowerCase().includes(query);
  });
  return `
    <section class="page-heading"><div><div class="eyebrow">MADE BY YOU</div><h1>My experiments.</h1><p>Curiosity has a home. Keep building, testing, and making it your own.</p></div><button class="button button-dark" type="button" data-action="new-experiment">${iconMarkup('plus', 15)}New experiment</button></section>
    ${matching.length ? `<div class="catalog-grid">${matching.map(experimentCard).join('')}</div>` : `<div class="empty-state"><span class="empty-state-icon">${iconMarkup('search', 24)}</span><h2>No matches in your lab</h2><p>Try another search, or create a new experiment.</p><button class="button button-light button-small" type="button" data-action="new-experiment">${iconMarkup('plus', 13)}New experiment</button></div>`}`;
}

function renderSaved() {
  const query = searchQuery.trim().toLocaleLowerCase();
  const savedExperiments = allExperiments().filter((experiment) => favorites.includes(experiment.id)
    && (!query || `${experiment.title} ${experiment.subject} ${experiment.description}`.toLocaleLowerCase().includes(query)));
  return `
    <section class="page-heading"><div><div class="eyebrow">KEEP THE GOOD IDEAS CLOSE</div><h1>Saved experiments.</h1><p>Your bookmarked Gizmos are right here whenever you want to pick up the thread.</p></div><button class="button button-light" type="button" data-view="discover">${iconMarkup('compass', 14)}Explore more</button></section>
    ${savedExperiments.length ? `<div class="catalog-grid">${savedExperiments.map(experimentCard).join('')}</div>` : `<div class="empty-state"><span class="empty-state-icon">${iconMarkup('bookmark', 24)}</span><h2>Your saved list is clear.</h2><p>Tap the bookmark on an experiment card to keep it close for later.</p><button class="button button-light button-small" type="button" data-view="discover">${iconMarkup('compass', 13)}Find an experiment</button></div>`}`;
}

function renderWorksheets() {
  const worksheets = allWorksheets().filter((worksheet) => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const experiment = worksheet.experimentId ? getExperiment(worksheet.experimentId) : null;
    return !query || `${worksheet.title} ${worksheet.instructions || ''} ${experiment?.title || ''}`.toLocaleLowerCase().includes(query);
  });
  return `
    <section class="page-heading"><div><div class="eyebrow">THINK IT THROUGH</div><h1>Worksheets.</h1><p>Thoughtful questions, space to record your ideas, and room for a little unexpected discovery.</p></div><button class="button button-dark" type="button" data-action="new-worksheet">${iconMarkup('plus', 15)}New worksheet</button></section>
    ${worksheets.length ? `<div class="worksheet-grid">${worksheets.map((worksheet) => {
      const experiment = worksheet.experimentId ? getExperiment(worksheet.experimentId) : null;
      return `<button class="worksheet-card ${worksheet.creator && worksheet.creator !== 'Gizmo Lab' ? 'is-custom' : ''}" type="button" data-open-worksheet="${escapeHtml(worksheet.id)}">
        <div class="worksheet-card-top"><span class="sheet-icon">${iconMarkup('book', 18)}</span><span class="sheet-count">${worksheet.questions.length} ${worksheet.questions.length === 1 ? 'question' : 'questions'}</span></div>
        <h3>${escapeHtml(worksheet.title)}</h3><p>${escapeHtml(worksheet.instructions || (experiment ? `A reflection sheet for ${experiment.title}.` : 'A learner worksheet for recording ideas and observations.'))}</p>
        <div class="worksheet-card-footer"><span>${escapeHtml(experiment ? experiment.title : 'Standalone worksheet')}</span>${iconMarkup('arrowRight', 14)}</div>
      </button>`;
    }).join('')}</div>` : `<div class="empty-state"><span class="empty-state-icon">${iconMarkup('book', 24)}</span><h2>No worksheets match that search</h2><p>Try another search, or create your own set of questions.</p><button class="button button-light button-small" type="button" data-action="new-worksheet">${iconMarkup('plus', 13)}Create a worksheet</button></div>`}`;
}

function formatControl(template, key, value) {
  const n = Number(value);
  if (key === 'length') return `${n.toFixed(1)} m`;
  if (key === 'gravity') return `${n.toFixed(1)} m/s²`;
  if (key === 'sunlight') return `${n} hrs/day`;
  if (key === 'water') return `${n}%`;
  if (key === 'days') return `${n} days`;
  if (key === 'voltage') return `${n.toFixed(1)} V`;
  if (key === 'resistance') return `${n} Ω`;
  return String(value);
}

function controlDefinitions(template) {
  if (template === 'plant') return [
    { key: 'sunlight', title: 'Sunlight', min: 0, max: 12, step: 1, minLabel: '0 hrs', maxLabel: '12 hrs' },
    { key: 'water', title: 'Water', min: 0, max: 100, step: 5, minLabel: 'Dry', maxLabel: 'Soaked' },
    { key: 'days', title: 'Days growing', min: 1, max: 30, step: 1, minLabel: '1 day', maxLabel: '30 days' }
  ];
  if (template === 'circuit') return [
    { key: 'voltage', title: 'Battery voltage', min: 1.5, max: 9, step: 0.5, minLabel: '1.5 V', maxLabel: '9 V' },
    { key: 'resistance', title: 'Resistance', min: 5, max: 100, step: 1, minLabel: '5 Ω', maxLabel: '100 Ω' }
  ];
  return [
    { key: 'length', title: 'Pendulum length', min: 0.4, max: 2.4, step: 0.1, minLabel: '0.4 m', maxLabel: '2.4 m' },
    { key: 'gravity', title: 'Gravity', min: 1, max: 20, step: 0.1, minLabel: '1 m/s²', maxLabel: '20 m/s²' }
  ];
}

function renderControlSliders(experiment, values) {
  return controlDefinitions(experiment.template).map((control) => `
    <div class="control-slider">
      <div class="control-line"><label for="control-${control.key}">${escapeHtml(control.title)}</label><span class="control-value" data-control-value="${control.key}">${escapeHtml(formatControl(experiment.template, control.key, values[control.key]))}</span></div>
      <input id="control-${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${values[control.key]}" data-control="${control.key}" aria-label="${escapeHtml(control.title)}" />
      <div class="range-ends"><span>${escapeHtml(control.minLabel)}</span><span>${escapeHtml(control.maxLabel)}</span></div>
    </div>`).join('');
}

function simulationFacts(template, values) {
  if (template === 'plant') {
    const lightFactor = 0.3 + Number(values.sunlight) / 12 * 0.7;
    const waterFactor = Math.max(0.25, 1 - Math.abs(Number(values.water) - 60) / 100);
    const height = Math.min(48, Number(values.days) * 1.65 * lightFactor * waterFactor);
    const status = Number(values.water) < 20 ? 'Needs water' : Number(values.water) > 90 ? 'Too much water' : Number(values.sunlight) < 3 ? 'Needs more light' : 'Growing well';
    return { height, heightPx: Math.max(22, Math.min(153, height * 3.12)), status, light: Number(values.sunlight), water: Number(values.water) };
  }
  if (template === 'circuit') {
    const current = Number(values.voltage) / Number(values.resistance);
    const brightness = Math.max(0, Math.min(1, current / 1.1));
    return { current, brightness, power: Number(values.voltage) * current };
  }
  const period = 2 * Math.PI * Math.sqrt(Number(values.length) / Number(values.gravity));
  const frequency = 1 / period;
  return { period, frequency, length: Number(values.length) };
}

function renderSimulation(experiment, values) {
  const facts = simulationFacts(experiment.template, values);
  if (experiment.template === 'plant') {
    return `<div class="sim-visual plant-visual"><div class="sim-stage-label"><span>GREENHOUSE · TRIAL 01</span><span>MODEL VIEW</span></div>
      <div class="plant-scene"><div class="plant-sun"></div><div class="plant-ground"></div><div class="plant-stem" style="--plant-height:${facts.heightPx}px"><i class="plant-leaf left"></i><i class="plant-leaf right"></i><i class="plant-leaf top"></i></div><div class="plant-soil"></div><div class="plant-pot"></div><span class="plant-height-label">${facts.height.toFixed(1)} cm</span></div>
      <div class="sim-caption">A simple model of seedling growth · ${facts.status}</div></div>
      <div class="sim-readouts"><div class="readout-item"><span>GROWTH</span><strong id="metric-primary">${facts.height.toFixed(1)} cm</strong></div><div class="readout-item"><span>SUNLIGHT</span><strong id="metric-secondary">${facts.light} hrs</strong></div><div class="readout-item"><span>PLANT HEALTH</span><strong id="metric-tertiary">${escapeHtml(facts.status)}</strong></div></div>`;
  }
  if (experiment.template === 'circuit') {
    const glowAlpha = (0.17 + facts.brightness * 0.6).toFixed(2);
    return `<div class="sim-visual circuit-visual"><div class="sim-stage-label"><span>BATTERY CIRCUIT · CLOSED LOOP</span><span>MODEL VIEW</span></div>
      <svg class="circuit-svg" viewBox="0 0 420 230" role="img" aria-label="A simple electric circuit with a battery, resistor, and light bulb">
        <path class="wire" d="M80 78V50H164M236 50H340V86M340 144V180H80V126" />
        <path class="flow" d="M80 78V50H340V86M340 144V180H80V126" />
        <rect class="resistor" x="164" y="37" width="72" height="27" rx="6" />
        <path d="m174 50 9-8 10 16 10-16 10 16 9-8" fill="none" stroke="#a18b5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle class="bulb ${facts.brightness < .08 ? 'bulb-off' : ''}" id="circuit-bulb" cx="340" cy="115" r="29" style="filter:drop-shadow(0 0 ${Math.round(4 + facts.brightness * 20)}px rgba(229,189,89,${glowAlpha}))" />
        <path d="m327 103 26 24m0-24-26 24" fill="none" stroke="#b69b54" stroke-width="2" stroke-linecap="round" />
        <path d="M332 149h16m-13 5h10" stroke="#78979a" stroke-width="3" stroke-linecap="round" />
        <path class="battery" d="M68 78h24v48H68z" />
        <path class="battery-line" d="M64 91h32m-25 22h18" />
        <text x="103" y="111" fill="#84978f" font-size="11" font-family="sans-serif">${Number(values.voltage).toFixed(1)} V</text>
        <text x="177" y="82" fill="#84978f" font-size="10" font-family="sans-serif">${Number(values.resistance)} Ω</text>
      </svg><div class="sim-caption">Current flows around a complete circuit.</div></div>
      <div class="sim-readouts"><div class="readout-item"><span>CURRENT</span><strong id="metric-primary">${(facts.current * 1000).toFixed(0)} mA</strong></div><div class="readout-item"><span>VOLTAGE</span><strong id="metric-secondary">${Number(values.voltage).toFixed(1)} V</strong></div><div class="readout-item"><span>BULB</span><strong id="metric-tertiary">${facts.brightness < .08 ? 'Dim' : facts.brightness > .65 ? 'Bright' : 'On'}</strong></div></div>`;
  }
  const armLength = Math.min(150, 42 + Number(values.length) * 50);
  return `<div class="sim-visual pendulum-visual"><div class="sim-stage-label"><span>PHYSICS LAB · TRIAL 01</span><span>MODEL VIEW</span></div>
    <svg class="pendulum-svg" viewBox="0 0 420 250" role="img" aria-label="A pendulum swinging from a support">
      <path class="arc" d="M93 201 A132 132 0 0 1 327 201" />
      <path class="support" d="M150 48H270" />
      <circle class="pivot" cx="210" cy="48" r="6" />
      <g class="pendulum-swing-group" id="pendulum-swing-group" style="--swing-duration:${Math.max(0.8, facts.period).toFixed(2)}s">
        <path class="arm" id="pendulum-arm" d="M210 48L210 ${(48 + armLength).toFixed(1)}" />
        <circle class="bob" id="pendulum-bob" cx="210" cy="${(48 + armLength).toFixed(1)}" r="17" />
      </g>
      <path d="M112 207h196" stroke="#dfe5dd" stroke-width="1" stroke-dasharray="3 5" />
      <text x="210" y="229" text-anchor="middle" fill="#9aa49a" font-size="10" font-family="sans-serif">SWING PATH</text>
    </svg><div class="sim-caption">A longer pendulum takes more time to complete a swing.</div></div>
    <div class="sim-readouts"><div class="readout-item"><span>SWING PERIOD</span><strong id="metric-primary">${facts.period.toFixed(2)} s</strong></div><div class="readout-item"><span>FREQUENCY</span><strong id="metric-secondary">${facts.frequency.toFixed(2)} Hz</strong></div><div class="readout-item"><span>LENGTH</span><strong id="metric-tertiary">${facts.length.toFixed(1)} m</strong></div></div>`;
}

function renderObservation(experiment) {
  const note = experimentNotes[experiment.id] || '';
  return `<div class="observation-card"><label for="experiment-note">${iconMarkup('note', 13)}Your observations</label><textarea id="experiment-note" data-note-for="${escapeHtml(experiment.id)}" placeholder="What do you notice? What surprised you?">${escapeHtml(note)}</textarea><div class="autosave-note">${iconMarkup('check', 10)}Saved automatically on this device</div></div>`;
}

function renderGuide(experiment) {
  const steps = experiment.steps?.length ? experiment.steps : ['Change one variable at a time.', 'Observe what happens in the model.', 'Record a pattern and explain what it might mean.'];
  return `<section class="guide-card"><div class="guide-icon">${iconMarkup('target', 15)}</div><div class="guide-body"><h3>Try it this way</h3><ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div></section>`;
}

function renderWorksheetTab(experiment) {
  const worksheet = getWorksheetForExperiment(experiment.id);
  if (!worksheet) {
    return `<div class="detail-worksheet"><div class="worksheet-empty"><span class="empty-state-icon">${iconMarkup('book', 24)}</span><h2>This experiment has no worksheet yet.</h2><p>Add your own reflection questions and give learners a place to record what they discover.</p><button class="button button-dark" type="button" data-action="new-linked-worksheet" data-experiment-id="${escapeHtml(experiment.id)}">${iconMarkup('plus', 14)}Create a worksheet</button></div></div>`;
  }
  const answers = worksheetAnswers[worksheet.id] || {};
  return `<div class="detail-worksheet">
    <section class="worksheet-intro-card"><div><div class="eyebrow">LEARNER WORKSHEET · ${worksheet.questions.length} QUESTIONS</div><h2>${escapeHtml(worksheet.title)}</h2><p>${escapeHtml(worksheet.instructions || 'Use your observations from the experiment to answer these questions.')}</p></div><button class="button button-light button-small" type="button" data-open-worksheet="${escapeHtml(worksheet.id)}">Open full worksheet ${iconMarkup('arrowRight', 13)}</button></section>
    <div class="worksheet-question-list">${worksheet.questions.slice(0, 3).map((question, index) => `<div class="worksheet-question"><label for="detail-answer-${index}"><span class="question-number">${index + 1}</span>${escapeHtml(question)}</label><textarea id="detail-answer-${index}" data-answer-id="${escapeHtml(worksheet.id)}" data-answer-index="${index}" placeholder="Write your thinking here...">${escapeHtml(answers[index] || '')}</textarea></div>`).join('')}</div>
    <div class="worksheet-save-note">${iconMarkup('check', 12)}Your answers are saved automatically on this device.</div>
  </div>`;
}

function renderExperimentDetail() {
  const experiment = currentExperiment();
  if (!experiment) {
    currentView = 'discover';
    return renderDiscover();
  }
  const values = currentValues(experiment);
  const worksheet = getWorksheetForExperiment(experiment.id);
  const subjectSvg = subjectIcon(experiment.subject);
  return `
    <div class="detail-return"><button type="button" data-action="detail-back">${iconMarkup('arrowLeft', 14)}Back to ${detailReturnView === 'my-lab' ? 'My experiments' : detailReturnView === 'overview' ? 'Overview' : detailReturnView === 'worksheet-reader' ? 'worksheet' : 'Explore'}</button><div class="detail-actions"><button class="button button-light button-small" type="button" data-favorite-id="${escapeHtml(experiment.id)}" aria-pressed="${favorites.includes(experiment.id)}">${iconMarkup('bookmark', 13)}${favorites.includes(experiment.id) ? 'Saved' : 'Save'}</button>${worksheet ? `<button class="button button-dark button-small" type="button" data-open-worksheet="${escapeHtml(worksheet.id)}">${iconMarkup('book', 13)}Open worksheet</button>` : ''}</div></div>
    <section class="detail-head"><div><div class="detail-tags"><span class="detail-tag">${iconMarkup(subjectSvg, 11)}${escapeHtml(experiment.subject)}</span><span class="detail-tag">${iconMarkup('layers', 11)}${escapeHtml(experiment.grade || 'All ages')}</span><span class="detail-tag">${iconMarkup('clock', 11)}${escapeHtml(experiment.duration || '10 min')}</span>${experiment.creator && experiment.creator !== 'Gizmo Lab' ? '<span class="detail-tag">MADE BY YOU</span>' : ''}</div><h1>${escapeHtml(experiment.title)}</h1><p>${escapeHtml(experiment.description)}</p></div></section>
    <div class="detail-tabs" role="tablist" aria-label="Experiment content"><button class="tab-button ${currentDetailTab === 'lab' ? 'is-active' : ''}" type="button" data-detail-tab="lab" role="tab" aria-selected="${currentDetailTab === 'lab'}">Interactive lab</button><button class="tab-button ${currentDetailTab === 'worksheet' ? 'is-active' : ''}" type="button" data-detail-tab="worksheet" role="tab" aria-selected="${currentDetailTab === 'worksheet'}">Worksheet ${worksheet ? `<span class="tab-badge">${worksheet.questions.length}</span>` : ''}</button></div>
    ${currentDetailTab === 'worksheet' ? renderWorksheetTab(experiment) : `
      <div class="experiment-workspace">
        <div class="left-lab-column">
          <section class="simulator-card"><div class="simulator-head"><h2><span>${iconMarkup(experiment.template === 'plant' ? 'leaf' : experiment.template === 'circuit' ? 'zap' : 'flask', 13)}</span>Interactive model</h2><span class="live-badge">LIVE MODEL</span></div>${renderSimulation(experiment, values)}</section>
          ${renderGuide(experiment)}
        </div>
        <div class="control-column"><section class="control-card"><div class="control-card-title"><div><h2>Try changing something</h2><p>Move a slider to explore.</p></div><button class="reset-button" type="button" data-reset-simulation="${escapeHtml(experiment.id)}">${iconMarkup('rotate', 12)}Reset</button></div>${renderControlSliders(experiment, values)}</section>${renderObservation(experiment)}</div>
      </div>`}`;
}

function renderWorksheetReader() {
  const worksheet = currentWorksheet();
  if (!worksheet) {
    currentView = 'worksheets';
    return renderWorksheets();
  }
  const experiment = worksheet.experimentId ? getExperiment(worksheet.experimentId) : null;
  const answers = worksheetAnswers[worksheet.id] || {};
  return `
    <button class="reader-back" type="button" data-action="worksheets-back">${iconMarkup('arrowLeft', 13)}All worksheets</button>
    <section class="reader-top"><div><div class="eyebrow">LEARNER WORKSHEET</div><h1>${escapeHtml(worksheet.title)}</h1><p>${escapeHtml(worksheet.instructions || 'Take your time, follow your questions, and write what you discover.')}</p></div><button class="button button-light" type="button" data-action="print-worksheet">${iconMarkup('printer', 14)}Print worksheet</button></section>
    <article class="worksheet-paper">
      <div class="paper-top"><div class="paper-title-group"><div class="paper-kicker">GIZMO LAB · FIELD NOTES</div><h2>${escapeHtml(worksheet.title)}</h2><p>${escapeHtml(worksheet.instructions || 'Use your observations and ideas to answer each question.')}</p></div>${experiment ? `<button class="paper-experiment-link" type="button" data-open-experiment="${escapeHtml(experiment.id)}">${iconMarkup(subjectIcon(experiment.subject), 12)}Explore: ${escapeHtml(experiment.title)}</button>` : ''}</div>
      <div class="student-lines"><label>Name <input type="text" data-student-field="name" value="${escapeHtml(answers._name || '')}" placeholder="" /></label><label>Date <input type="text" data-student-field="date" value="${escapeHtml(answers._date || '')}" placeholder="" /></label></div>
      <div class="paper-questions">${worksheet.questions.map((question, index) => `<section class="paper-question"><div class="paper-q-title"><span class="question-number">${index + 1}</span><span>${escapeHtml(question)}</span></div><textarea data-answer-id="${escapeHtml(worksheet.id)}" data-answer-index="${index}" placeholder="Write your answer here...">${escapeHtml(answers[index] || '')}</textarea></section>`).join('')}</div>
      <div class="paper-footer"><span>Make a prediction. Gather evidence. Explain your thinking.</span><strong>Keep wondering ✦</strong></div>
    </article>`;
}

function openExperiment(id) {
  const experiment = getExperiment(id);
  if (!experiment) return;
  detailReturnView = currentView;
  if (currentView === 'worksheet-reader') detailReturnView = 'worksheet-reader';
  currentExperimentId = id;
  currentView = 'experiment';
  currentDetailTab = 'lab';
  closeMobileNav();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openWorksheet(id) {
  const worksheet = getWorksheet(id);
  if (!worksheet) return;
  currentWorksheetId = id;
  currentView = 'worksheet-reader';
  closeMobileNav();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backFromDetail() {
  if (detailReturnView === 'worksheet-reader' && currentWorksheetId) {
    currentView = 'worksheet-reader';
    currentExperimentId = null;
    render();
    return;
  }
  const destination = ['overview', 'discover', 'my-lab', 'worksheets'].includes(detailReturnView) ? detailReturnView : 'discover';
  setView(destination);
}

function openExperimentDialog() {
  const dialog = document.getElementById('experiment-dialog');
  document.getElementById('experiment-form').reset();
  document.getElementById('exp-template').value = 'pendulum';
  document.getElementById('exp-grade').value = 'Grades 6–9';
  document.getElementById('exp-duration').value = '10 min';
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  window.setTimeout(() => document.getElementById('exp-title').focus(), 50);
}

function openWorksheetDialog(linkedExperimentId = '') {
  const dialog = document.getElementById('worksheet-dialog');
  const select = document.getElementById('sheet-experiment');
  const existing = select.value;
  select.innerHTML = `<option value="">No linked experiment</option>${allExperiments().map((experiment) => `<option value="${escapeHtml(experiment.id)}">${escapeHtml(experiment.title)}</option>`).join('')}`;
  select.value = linkedExperimentId || (allExperiments().some((experiment) => experiment.id === existing) ? existing : '');
  document.getElementById('worksheet-form').reset();
  select.value = linkedExperimentId || '';
  if (linkedExperimentId) {
    const experiment = getExperiment(linkedExperimentId);
    document.getElementById('sheet-title').value = experiment ? `${experiment.title} worksheet` : '';
  }
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  window.setTimeout(() => document.getElementById('sheet-title').focus(), 50);
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function parseLines(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function createExperiment(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const title = String(formData.get('title') || '').trim();
  const subject = String(formData.get('subject') || 'Other');
  const template = String(formData.get('template') || 'pendulum');
  const description = String(formData.get('description') || '').trim();
  const steps = parseLines(formData.get('steps'));
  const worksheetQuestions = parseLines(formData.get('worksheetQuestions'));
  const id = uid('experiment');
  const experiment = {
    id,
    title,
    subject,
    grade: String(formData.get('grade') || 'All ages'),
    duration: String(formData.get('duration') || '10 min'),
    description,
    template,
    creator: 'You',
    steps,
    defaults: template === 'plant' ? { sunlight: 8, water: 60, days: 18 } : template === 'circuit' ? { voltage: 4.5, resistance: 22 } : { length: 1.2, gravity: 9.8 }
  };
  if (worksheetQuestions.length) {
    const worksheetId = uid('worksheet');
    const requestedTitle = String(formData.get('worksheetTitle') || '').trim();
    userWorksheets.unshift({
      id: worksheetId,
      title: requestedTitle || `${title} worksheet`,
      instructions: `Use your observations from ${title} to answer these questions.`,
      questions: worksheetQuestions,
      experimentId: id,
      creator: 'You'
    });
    experiment.worksheetId = worksheetId;
    writeStorage(STORAGE_KEYS.worksheets, userWorksheets);
  }
  userExperiments.unshift(experiment);
  writeStorage(STORAGE_KEYS.experiments, userExperiments);
  closeDialog('experiment-dialog');
  event.currentTarget.reset();
  currentExperimentId = id;
  currentView = 'experiment';
  currentDetailTab = 'lab';
  detailReturnView = 'my-lab';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Your experiment is ready. Happy exploring!');
}

function createWorksheet(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const questions = parseLines(formData.get('questions'));
  if (!questions.length) {
    document.getElementById('sheet-questions').focus();
    return;
  }
  const worksheet = {
    id: uid('worksheet'),
    title: String(formData.get('title') || '').trim(),
    experimentId: String(formData.get('experiment') || ''),
    instructions: String(formData.get('instructions') || '').trim(),
    questions,
    creator: 'You'
  };
  userWorksheets.unshift(worksheet);
  writeStorage(STORAGE_KEYS.worksheets, userWorksheets);
  closeDialog('worksheet-dialog');
  event.currentTarget.reset();
  openWorksheet(worksheet.id);
  showToast('Worksheet created. Your answers will save as you go.');
}

function toggleFavorite(id) {
  if (!id) return;
  const isFavorite = favorites.includes(id);
  favorites = isFavorite ? favorites.filter((item) => item !== id) : [...favorites, id];
  writeStorage(STORAGE_KEYS.favorites, favorites);
  render();
  showToast(isFavorite ? 'Removed from your saved experiments.' : 'Saved for a little later.');
}

function applySimulationValues(experiment) {
  const values = currentValues(experiment);
  const facts = simulationFacts(experiment.template, values);
  const setMetric = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  if (experiment.template === 'plant') {
    const stem = document.querySelector('.plant-stem');
    if (stem) stem.style.setProperty('--plant-height', `${facts.heightPx}px`);
    const label = document.querySelector('.plant-height-label');
    if (label) label.textContent = `${facts.height.toFixed(1)} cm`;
    const caption = document.querySelector('.sim-caption');
    if (caption) caption.textContent = `A simple model of seedling growth · ${facts.status}`;
    setMetric('metric-primary', `${facts.height.toFixed(1)} cm`);
    setMetric('metric-secondary', `${facts.light} hrs`);
    setMetric('metric-tertiary', facts.status);
    return;
  }
  if (experiment.template === 'circuit') {
    const bulb = document.getElementById('circuit-bulb');
    if (bulb) {
      bulb.classList.toggle('bulb-off', facts.brightness < .08);
      const glowAlpha = (0.17 + facts.brightness * 0.6).toFixed(2);
      bulb.style.filter = `drop-shadow(0 0 ${Math.round(4 + facts.brightness * 20)}px rgba(229,189,89,${glowAlpha}))`;
    }
    const svg = document.querySelector('.circuit-svg');
    if (svg) {
      const voltage = svg.querySelector('text');
      if (voltage) voltage.textContent = `${Number(values.voltage).toFixed(1)} V`;
      const resistance = svg.querySelectorAll('text')[1];
      if (resistance) resistance.textContent = `${Number(values.resistance)} Ω`;
    }
    setMetric('metric-primary', `${(facts.current * 1000).toFixed(0)} mA`);
    setMetric('metric-secondary', `${Number(values.voltage).toFixed(1)} V`);
    setMetric('metric-tertiary', facts.brightness < .08 ? 'Dim' : facts.brightness > .65 ? 'Bright' : 'On');
    return;
  }
  const arm = document.getElementById('pendulum-arm');
  const bob = document.getElementById('pendulum-bob');
  const swingGroup = document.getElementById('pendulum-swing-group');
  const armLength = Math.min(150, 42 + Number(values.length) * 50);
  if (arm) arm.setAttribute('d', `M210 48L210 ${(48 + armLength).toFixed(1)}`);
  if (bob) {
    bob.setAttribute('cx', '210');
    bob.setAttribute('cy', (48 + armLength).toFixed(1));
  }
  if (swingGroup) swingGroup.style.setProperty('--swing-duration', `${Math.max(0.8, facts.period).toFixed(2)}s`);
  setMetric('metric-primary', `${facts.period.toFixed(2)} s`);
  setMetric('metric-secondary', `${facts.frequency.toFixed(2)} Hz`);
  setMetric('metric-tertiary', `${facts.length.toFixed(1)} m`);
}

function updateWorksheetAnswer(textarea) {
  const id = textarea.dataset.answerId;
  const index = textarea.dataset.answerIndex;
  if (!id) return;
  if (!worksheetAnswers[id]) worksheetAnswers[id] = {};
  worksheetAnswers[id][index] = textarea.value;
  writeStorage(STORAGE_KEYS.answers, worksheetAnswers);
}

function openMobileNav() {
  sidebar.classList.add('is-open');
  mobileScrim.classList.add('is-visible');
  document.getElementById('mobile-menu').setAttribute('aria-label', 'Close navigation');
}

function closeMobileNav() {
  sidebar.classList.remove('is-open');
  mobileScrim.classList.remove('is-visible');
  document.getElementById('mobile-menu').setAttribute('aria-label', 'Open navigation');
}

function hydrateIcons() {
  document.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = iconMarkup(element.dataset.icon, 18);
  });
}

// Navigation and action delegation

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const favoriteButton = target.closest('[data-favorite-id]');
  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(favoriteButton.dataset.favoriteId);
    return;
  }
  const viewButton = target.closest('[data-view]');
  if (viewButton) {
    event.preventDefault();
    const nextView = viewButton.dataset.view;
    if (nextView === currentView && nextView === 'discover') {
      searchQuery = '';
      document.getElementById('global-search').value = '';
    }
    setView(nextView);
    return;
  }
  const viewLink = target.closest('[data-view-link]');
  if (viewLink) {
    event.preventDefault();
    setView(viewLink.dataset.viewLink);
    return;
  }
  const action = target.closest('[data-action]');
  if (action) {
    event.preventDefault();
    const type = action.dataset.action;
    if (type === 'new-experiment') openExperimentDialog();
    else if (type === 'new-worksheet') openWorksheetDialog();
    else if (type === 'new-linked-worksheet') openWorksheetDialog(action.dataset.experimentId || '');
    else if (type === 'detail-back') backFromDetail();
    else if (type === 'worksheets-back') setView('worksheets');
    else if (type === 'print-worksheet') window.print();
    return;
  }
  const filter = target.closest('[data-filter]');
  if (filter) {
    activeFilter = filter.dataset.filter;
    render();
    return;
  }
  const experimentButton = target.closest('[data-open-experiment]');
  if (experimentButton) {
    openExperiment(experimentButton.dataset.openExperiment);
    return;
  }
  const worksheetButton = target.closest('[data-open-worksheet]');
  if (worksheetButton) {
    openWorksheet(worksheetButton.dataset.openWorksheet);
    return;
  }
  const detailTab = target.closest('[data-detail-tab]');
  if (detailTab) {
    currentDetailTab = detailTab.dataset.detailTab;
    render();
    return;
  }
  const reset = target.closest('[data-reset-simulation]');
  if (reset) {
    const experiment = getExperiment(reset.dataset.resetSimulation);
    if (!experiment) return;
    simulationValues[experiment.id] = valueDefaults(experiment);
    render();
    return;
  }
  const close = target.closest('[data-close-dialog]');
  if (close) {
    closeDialog(close.dataset.closeDialog);
    return;
  }
  if (target.id === 'mobile-menu' || target.closest('#mobile-menu')) {
    if (sidebar.classList.contains('is-open')) closeMobileNav();
    else openMobileNav();
    return;
  }
  if (target.id === 'mobile-scrim') closeMobileNav();
});

// Form submissions

document.getElementById('experiment-form').addEventListener('submit', createExperiment);
document.getElementById('worksheet-form').addEventListener('submit', createWorksheet);

// Search, sliders, observation notes, and worksheet answers are saved as the learner works.
document.getElementById('global-search').addEventListener('input', (event) => {
  searchQuery = event.target.value;
  if (searchQuery.trim() && !['discover', 'my-lab', 'saved', 'worksheets'].includes(currentView)) {
    currentView = 'discover';
    activeFilter = 'All';
  }
  if (['discover', 'my-lab', 'saved', 'worksheets'].includes(currentView)) render();
});

document.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
  if (target.matches('[data-control]')) {
    const experiment = currentExperiment();
    if (!experiment) return;
    const key = target.dataset.control;
    currentValues(experiment)[key] = Number(target.value);
    const valueLabel = document.querySelector(`[data-control-value="${key}"]`);
    if (valueLabel) valueLabel.textContent = formatControl(experiment.template, key, target.value);
    applySimulationValues(experiment);
    return;
  }
  if (target.id === 'experiment-note') {
    experimentNotes[target.dataset.noteFor] = target.value;
    writeStorage(STORAGE_KEYS.notes, experimentNotes);
    return;
  }
  if (target.matches('[data-answer-id]')) {
    updateWorksheetAnswer(target);
    return;
  }
  if (target.matches('[data-student-field]')) {
    if (!currentWorksheetId) return;
    if (!worksheetAnswers[currentWorksheetId]) worksheetAnswers[currentWorksheetId] = {};
    worksheetAnswers[currentWorksheetId][`_${target.dataset.studentField}`] = target.value;
    writeStorage(STORAGE_KEYS.answers, worksheetAnswers);
  }
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.getElementById('global-search').focus();
  }
  if (event.key === 'Escape') closeMobileNav();
});

hydrateIcons();
render();
