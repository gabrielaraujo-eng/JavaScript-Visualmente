(() => {
  const $ = (selector) => document.querySelector(selector);
  const lessonList = $('#lesson-list');
  const editor = $('#code-editor');
  const output = $('#console-output');
  const runStatus = $('#run-status');
  const completeButton = $('#complete-lesson');
  const searchInput = $('#lesson-search');
  const storage = { theme: 'jsvisual.theme.v1', progress: 'jsvisual.progress.v1' };
  let lessons = [];
  let activeLesson = null;
  let category = 'all';
  let completed = readJson(storage.progress, []);

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function saveJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function setTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const button = $('#theme-toggle');
    button?.setAttribute('aria-pressed', String(theme === 'light'));
    button?.setAttribute('aria-label', theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro');
    if (persist) saveJson(storage.theme, theme);
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(storage.theme); } catch {}
    const systemLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
    setTheme(saved === 'light' || saved === 'dark' ? saved : (systemLight ? 'light' : 'dark'));
    $('#theme-toggle')?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true));
  }
  function norm(value) { return String(value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function visibleLessons() {
    const query = norm(searchInput?.value);
    return lessons.filter((lesson) => {
      const text = norm([lesson.title, lesson.categoryLabel, lesson.description, ...(lesson.keywords || [])].join(' '));
      return (category === 'all' || lesson.category === category) && (!query || text.includes(query));
    });
  }
  function renderList() {
    const visible = visibleLessons();
    $('#lesson-total').textContent = `${visible.length}/${lessons.length}`;
    $('#empty-search').hidden = Boolean(visible.length);
    lessonList.innerHTML = '';
    visible.forEach((lesson) => {
      const link = document.createElement('a');
      link.className = `lesson-card${activeLesson?.id === lesson.id ? ' is-active' : ''}`;
      link.href = '#laboratorio';
      link.innerHTML = `<span class="lesson-index">${String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</span><span class="lesson-card-copy"><span class="lesson-card-title">${lesson.title}</span><span class="lesson-card-meta">${lesson.categoryLabel} · ${lesson.duration}</span></span><span class="lesson-arrow" aria-hidden="true">↗</span>`;
      link.addEventListener('click', (event) => { event.preventDefault(); selectLesson(lesson.id, true); });
      lessonList.append(link);
    });
    if (visible.length) {
      const note = document.createElement('p');
      note.className = 'list-note';
      note.textContent = 'Mude uma linha, rode e observe. O melhor caminho é o que desperta uma pergunta.';
      lessonList.append(note);
    }
  }
  function updateProgress() {
    const count = lessons.filter((lesson) => completed.includes(lesson.id)).length;
    const percent = lessons.length ? Math.round(count / lessons.length * 100) : 0;
    $('#progress-count').textContent = `${count} ${count === 1 ? 'aula vista' : 'aulas vistas'}`;
    $('#progress-percent').textContent = `${percent}%`;
    $('#progress-fill').style.width = `${percent}%`;
    $('.progress-track')?.setAttribute('aria-valuenow', String(percent));
    $('#progress-label').textContent = count ? `${percent}% do mapa explorado. Continue no seu ritmo.` : 'Comece por qualquer aula. Seu progresso fica só neste navegador.';
  }
  function selectLesson(id, scroll = false) {
    const lesson = lessons.find((item) => item.id === id);
    if (!lesson) return;
    activeLesson = lesson;
    $('#lesson-category').textContent = lesson.categoryLabel.toUpperCase();
    $('#lesson-duration').textContent = lesson.duration.toUpperCase();
    $('#lesson-title').textContent = lesson.title;
    $('#lesson-description').textContent = lesson.description;
    $('#lesson-explanation').textContent = lesson.explanation;
    $('#lesson-challenge').textContent = lesson.challenge;
    $('#editor-help').textContent = lesson.help;
    editor.value = lesson.starter;
    output.textContent = 'Seu resultado aparece aqui.';
    output.classList.remove('is-error');
    runStatus.textContent = 'PRONTO PARA RODAR';
    runStatus.className = '';
    const done = completed.includes(lesson.id);
    completeButton.setAttribute('aria-pressed', String(done));
    completeButton.innerHTML = `<span aria-hidden="true">${done ? '✓' : '○'}</span> ${done ? 'Vista' : 'Marcar como vista'}`;
    renderList();
    if (scroll) $('#laboratorio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function sandboxDocument(code) {
    const safeCode = String(code).replace(/<\/script/gi, '<\\/script');
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'"><style>body{font:14px system-ui;padding:16px;color:#17202a;background:#fffdf8}h3{margin:0 0 8px}p{margin:0}</style></head><body><script>(()=>{const send=(kind,values)=>parent.postMessage({type:'jsvisual-console',kind,values:values.map(value=>{try{return typeof value==='string'?value:JSON.stringify(value,null,2)}catch{return String(value)}})},'*');['log','info','warn','error'].forEach(kind=>console[kind]=(...values)=>send(kind,values));window.onerror=message=>send('error',[message]);window.onunhandledrejection=event=>send('error',[event.reason?.message||event.reason||'Promessa rejeitada']);(async()=>{${safeCode}\n})().catch(error=>send('error',[error?.stack||error?.message||error]));})();<\/script></body></html>`;
  }
  function runCode() {
    const button = $('#run-code');
    if (!button || !editor) return;
    button.disabled = true;
    runStatus.textContent = 'EXECUTANDO';
    runStatus.className = 'is-running';
    output.textContent = '';
    output.classList.remove('is-error');
    const frame = document.createElement('iframe');
    frame.hidden = true;
    frame.title = 'Resultado isolado do experimento';
    frame.setAttribute('sandbox', 'allow-scripts');
    const lines = [];
    let finished = false;
    const onMessage = (event) => {
      if (event.source !== frame.contentWindow || event.data?.type !== 'jsvisual-console' || lines.length >= 80) return;
      const values = Array.isArray(event.data.values) ? event.data.values.map((value) => String(value).slice(0, 1000)) : [];
      lines.push({ kind: event.data.kind, values });
    };
    const finish = (timeout = false) => {
      if (finished) return;
      finished = true;
      window.removeEventListener('message', onMessage);
      frame.remove();
      button.disabled = false;
      const hasError = timeout || lines.some((line) => line.kind === 'error');
      runStatus.textContent = timeout ? 'TEMPO LIMITE' : (hasError ? 'HÁ UMA PISTA' : 'EXECUTADO AGORA');
      runStatus.className = hasError ? 'is-error' : '';
      output.classList.toggle('is-error', hasError);
      if (timeout) lines.push({ kind: 'error', values: ['Tempo limite atingido. Verifique se existe um laço ou espera que não termina.'] });
      output.textContent = lines.length ? lines.map((line) => `${line.kind === 'error' ? '× ' : ''}${line.values.join(' ')}`).join('\n') : 'O código rodou, mas não escreveu nada na saída.';
    };
    window.addEventListener('message', onMessage);
    document.body.append(frame);
    frame.srcdoc = sandboxDocument(editor.value);
    window.setTimeout(() => finish(false), 850);
    window.setTimeout(() => finish(true), 1600);
  }
  function setup() {
    initTheme();
    searchInput?.addEventListener('input', renderList);
    document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
      category = button.dataset.category;
      document.querySelectorAll('[data-category]').forEach((item) => { const selected = item === button; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)); });
      renderList();
    }));
    $('#run-code')?.addEventListener('click', runCode);
    $('#reset-code')?.addEventListener('click', () => { if (activeLesson) editor.value = activeLesson.starter; });
    completeButton?.addEventListener('click', () => {
      if (!activeLesson) return;
      completed = completed.includes(activeLesson.id) ? completed.filter((id) => id !== activeLesson.id) : [...completed, activeLesson.id];
      saveJson(storage.progress, completed);
      updateProgress();
      selectLesson(activeLesson.id);
    });
    editor?.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') { event.preventDefault(); editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end'); }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') runCode();
    });
  }
  async function start() {
    setup();
    try {
      const response = await fetch('public/data/lessons.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Não foi possível carregar as aulas.');
      lessons = await response.json();
      updateProgress();
      selectLesson(lessons[0].id);
    } catch (error) {
      lessonList.innerHTML = '<p class="loading-note">As aulas não carregaram. Recarregue a página para tentar novamente.</p>';
      output.textContent = error.message;
    }
  }
  start();
})();
