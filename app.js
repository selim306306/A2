// Persistent Database & AI Manager Engine
const defaultData = {
  apiKey: '',
  model: 'gemini-3.5-flash-lite',
  stats: [
    ['2,480', 'كتاب ورقي', 'مفهرس وقابل للبحث'],
    ['360', 'كتاب رقمي', 'قراءة داخل المنصة'],
    ['128', 'إعارة نشطة', 'مع متابعة الإرجاع'],
    ['42', 'زائرًا هذا الشهر', 'سجل إلكتروني منظم']
  ],
  books: [
    { id: 1, title: 'موسوعة العلوم المبسطة', author: 'مجموعة مؤلفين', type: 'ورقي', shelf: 'قسم العلوم', status: 'متاح' },
    { id: 2, title: 'رحلة في تاريخ مصر', author: 'محمد فريد', type: 'ورقي', shelf: 'التاريخ والجغرافيا', status: 'معار' },
    { id: 3, title: 'حكايات من التراث', author: 'أحمد شوقي', type: 'رقمي', shelf: 'المطالعة الحرة', status: 'متاح' },
    { id: 4, title: 'دليل التجارب المدرسية', author: 'مركز تطوير المناهج', type: 'رقمي', shelf: 'العلوم والتجارب', status: 'متاح' },
    { id: 5, title: 'لغتي الجميلة للناشئين', author: 'إدارة المناهج', type: 'ورقي', shelf: 'اللغة العربية', status: 'متاح' },
    { id: 6, title: 'أطلس العالم الصغير', author: 'دار المعرفة', type: 'ورقي', shelf: 'الجغرافيا', status: 'متاح' }
  ],
  announcements: [
    { day: '12', month: 'أكتوبر', title: 'بدء أسبوع القراءة الحرة', text: 'اختار كتابًا، اكتب انطباعك، وشارك زملاءك الفكرة.', tag: 'نشاط المكتبة' },
    { day: '18', month: 'أكتوبر', title: 'تحديث مواعيد الاستعارة', text: 'الاستعارة متاحة يوميًا من الثامنة حتى الثانية عشرة.', tag: 'تنبيه' }
  ],
  competitions: [
    { title: 'قارئ الشهر', text: 'اقرأ ثلاثة كتب وقدّم بطاقة تلخيص قصيرة.', deadline: 'آخر موعد 30 أكتوبر', color: 'teal' },
    { title: 'أفضل قصة قصيرة', text: 'مسابقة للصفوف العليا حول الخيال العلمي.', deadline: 'آخر موعد 6 نوفمبر', color: 'gold' }
  ],
  visitors: []
};

let db = JSON.parse(localStorage.getItem('amin_lib_db')) || defaultData;
if (!db.model || db.model.includes('2.5')) db.model = 'gemini-3.5-flash-lite';

function saveDB() {
  localStorage.setItem('amin_lib_db', JSON.stringify(db));
}

const routes = {
  '/': renderHome,
  '/books/paper': () => renderCatalog('books', 'الكتب الورقية', 'فهرس الكتب الورقية وإتاحتها للطلاب والزائرين.', 'ورقي'),
  '/books/digital': () => renderCatalog('digital', 'الكتب الرقمية', 'مكتبة رقمية للقراءة داخل المنصة مع احترام حقوق النشر.', 'رقمي'),
  '/competitions': renderCompetitions,
  '/announcements': renderAnnouncements,
  '/visitors': renderVisitors,
  '/support': renderSupport,
  '/dashboard': renderDashboard
};

const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
let toastTimer;

function esc(value) { return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[ch])); }

function renderAiManagerBar() {
  const isOnline = Boolean(db.apiKey && db.apiKey.trim().length > 10);
  return `
    <div class="ai-manager-bar ${isOnline ? 'active' : 'local'}">
      <div class="ai-manager-info">
        <span class="pulse-dot"></span>
        <strong>المدير والمراقب الذكي (Gemini Manager):</strong>
        <span>${isOnline ? `متصل ومستعد · النموذج: [${db.model}]` : 'الوضع المحلي التلقائي (أدخل مفتاح API لتفعيل الرقابة الكاملة)'}</span>
      </div>
      <a href="#/dashboard" data-route class="ai-badge-link">إعدادات الإشراف ⚙️</a>
    </div>
  `;
}

function pageHead(kicker, title, text) { 
  return `
    ${renderAiManagerBar()}
    <div class="page-hero">
      <div>
        <p class="eyebrow">${kicker}</p>
        <h1>${title}</h1>
        <p>${text}</p>
      </div>
    </div>`; 
}

function routeLink(path, text, cls = 'text-link') { return `<a class="${cls}" href="#${path}" data-route>${text}</a>`; }
function statCards() { return db.stats.map(([value, label, note]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span><small>${note}</small></article>`).join(''); }

function renderHome() {
  app.innerHTML = `
    ${renderAiManagerBar()}
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">منظومة المكتبة المدرسية الذكية</p>
        <h1>المكتبة الرقمية<br><span>بإشراف الذكاء الاصطناعي</span></h1>
        <p class="lead">منصة متكاملة لتسهيل الفهرسة، تسجيل الزوار، واستعارة الكتب بمتابعة وإشراف آلي مستمر من Gemini.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/books/paper" data-route>تصفح الفهرس <b>←</b></a>
          <a class="btn gold" href="#/support" data-route>التحدث مع المدير الذكي 🤖</a>
        </div>
        <div class="trust-row">
          <span><i></i>إشراف: أخصائي أول مكتبات/ محمد حامد</span>
          <span><i></i>الرقيب الآلي: Gemini Manager</span>
        </div>
      </div>
      <div class="hero-board">
        <div class="board-head">
          <div><strong>لوحة الرقابة المباشرة</strong><small> · إشراف Gemini</small></div>
          <span class="tag pulse">نظام آلي نشط</span>
        </div>
        <div class="board-profile">
          <div class="profile-avatar">م ح</div>
          <div>
            <strong>محمد حامد</strong>
            <small>أخصائي أول مكتبات · مدرسة الأمين الابتدائية</small>
          </div>
        </div>
        <div class="book-shelf">
          <div class="shelf-book">علوم</div>
          <div class="shelf-book">قصص</div>
          <div class="shelf-book">تاريخ</div>
          <div class="shelf-book">لغتي</div>
        </div>
        <div class="board-stats">
          <div class="mini-stat"><strong>${db.books.length}</strong><small>كتب مفهرسة</small></div>
          <div class="mini-stat"><strong>${db.visitors.length}</strong><small>زيارات مسجلة</small></div>
          <div class="mini-stat"><strong>آمن</strong><small>حالة النظام</small></div>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="section-head">
        <div>
          <p class="eyebrow">تقرير الرقابة الإدارية</p>
          <h2>ملاحظات وتوجيهات المدير الذكي لليوم</h2>
        </div>
        <button class="btn subtle" onclick="fetchLiveBriefing()">تحديث التقرير 🔄</button>
      </div>
      <div id="aiHomeBriefing" class="card card-body ai-briefing-box">
        <p>⏳ جاري قراءة مؤشرات المكتبة بواسطة المراقب الآلي...</p>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><p class="eyebrow">أرقام سريعة</p><h2>مؤشرات الأداء</h2></div></div>
      <div class="stats-grid">${statCards()}</div>
    </section>

    <section class="section">
      <div class="content-grid">
        <article class="card">
          <div class="card-body">
            <div class="section-head">
              <div><p class="eyebrow">من الفهرس</p><h2>البحث الفوري عن الكتب</h2></div>
              ${routeLink('/books/paper','الفهرس الكامل →')}
            </div>
            <form class="search-box" id="homeSearch">
              <span>⌕</span>
              <input id="searchInput" type="search" placeholder="اكتب عنوانًا أو مؤلفًا أو رفًا..." autocomplete="off">
              <button type="submit">بحث</button>
            </form>
            <div class="book-results" id="searchResults">${bookResultItems(db.books.slice(0,3))}</div>
          </div>
        </article>
        
        <article class="card">
          <div class="card-body">
            <div class="section-head">
              <div><p class="eyebrow">تنبيهات</p><h2>آخر الإعلانات الرسمية</h2></div>
              ${routeLink('/announcements','عرض الكل →')}
            </div>
            <div class="announcement-list">${announcementItems(3)}</div>
          </div>
        </article>
      </div>
    </section>
  `;

  bindHomeSearch();
  fetchLiveBriefing();
}

async function fetchLiveBriefing() {
  const box = document.querySelector('#aiHomeBriefing');
  if (!box) return;

  const key = (db.apiKey || '').trim();
  const model = db.model || 'gemini-3.5-flash-lite';

  if (key.length > 10) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت Gemini، مدير ومراقب موقع مكتبة مدرسة الأمين الابتدائية تحت إشراف الأستاذ محمد حامد. اكتب تقريراً رقابياً موجزاً ومشجعاً للطلاب والأخصائي في جُمْلَتَين بناءً على المجموع: ${db.books.length} كتاب، ${db.visitors.length} زائر.` }] }]
        })
      });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        box.innerHTML = `<div class="ai-briefing-content"><span class="ai-icon-tag">🤖 Gemini Manager</span><p>${esc(text)}</p></div>`;
        return;
      }
    } catch (e) { console.error(e); }
  }

  box.innerHTML = `<div class="ai-briefing-content"><span class="ai-icon-tag">📋 المراقب الذكي (مؤشر محلي)</span><p>منظومة المكتبة تعمل بانتظام. تم تسجيل ${db.books.length} كتاباً مفهرساً، ويسير سجل الزائرين بانتظام تحت إشراف الأستاذ محمد حامد.</p></div>`;
}
window.fetchLiveBriefing = fetchLiveBriefing;

function announcementItems(limit = 3) { return db.announcements.slice(0, limit).map(item => `<article class="announcement-item"><div class="date-box"><strong>${item.day}</strong><small>${item.month}</small></div><div class="item-content"><span class="tag">${item.tag}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join(''); }
function bookResultItems(books) { return books.length ? books.map(book => `<div class="book-result"><div class="book-cover">${book.type}</div><div><strong>${book.title}</strong><small>${book.author} · ${book.shelf} · <span style="color:${book.status === 'متاح' ? 'var(--teal)' : 'var(--brick)'}">${book.status}</span></small></div></div>`).join('') : '<div class="empty-state"> لم نجد نتائج مطابقة.</div>'; }

function bindHomeSearch() {
  const form = document.querySelector('#homeSearch');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const term = document.querySelector('#searchInput').value.trim().toLowerCase();
    const found = db.books.filter(b => [b.title, b.author, b.shelf].join(' ').toLowerCase().includes(term));
    document.querySelector('#searchResults').innerHTML = bookResultItems(term ? found : db.books.slice(0,3));
  });
}

function renderCatalog(kind, title, text, type) {
  const books = db.books.filter(b => b.type === type);
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead(type === 'ورقي' ? 'فهرس المكتبة' : 'المكتبة الرقمية', title, text)}
      <div class="search-box"><span>⌕</span><input id="catalogSearch" type="search" placeholder="ابحث باسم الكتاب، المؤلف، أو الرف..." autocomplete="off"><button type="button" id="catalogSearchButton">بحث</button></div>
      <div class="catalog-grid" id="catalogGrid">${catalogCards(books)}</div>
    </div>`;
  const runSearch = () => {
    const term = document.querySelector('#catalogSearch').value.trim().toLowerCase();
    const found = books.filter(b => [b.title, b.author, b.shelf].join(' ').toLowerCase().includes(term));
    document.querySelector('#catalogGrid').innerHTML = catalogCards(found);
  };
  document.querySelector('#catalogSearchButton')?.addEventListener('click', runSearch);
  document.querySelector('#catalogSearch')?.addEventListener('input', runSearch);
}

function catalogCards(books) {
  return books.length ? books.map(b => `
    <article class="catalog-card">
      <div class="catalog-cover">${b.type}</div>
      <div>
        <span class="tag" style="background:${b.status==='متاح'?'#e5f4f1':'#fce8e6'}">${b.status}</span>
        <h3>${b.title}</h3>
        <p>${b.author}<br><small>${b.shelf}</small></p>
        <button class="btn subtle" onclick="borrowBook('${b.title}')">${b.type === 'رقمي' ? 'قراءة إلكترونية' : 'طلب استعارة'} ↗</button>
      </div>
    </article>
  `).join('') : '<div class="empty-state" style="grid-column:1/-1">لا توجد كتب مطابقة.</div>';
}

window.borrowBook = function(title) {
  showToast(`تم تسجيل طلب استعارة لكتاب: "${title}". يرجى مراجعة أخصائي المكتبة.`);
};

function renderAnnouncements() {
  app.innerHTML = `<div class="page-shell">${pageHead('لوحة الأخبار', 'الإعلانات والأنشطة', 'كل ما يخص مواعيد المكتبة والكتب الجديدة والفعاليات المدرسية.')}<div class="card"><div class="card-body"><div class="announcement-list">${announcementItems(10)}</div></div></div></div>`;
}

function renderCompetitions() {
  app.innerHTML = `<div class="page-shell">${pageHead('تعلّم وشارك', 'المسابقات المدرسية', 'أنشطة القراءة والبحث العلمي برعاية أخصائي المكتبة.')}<div class="catalog-grid">${db.competitions.map(item => `<article class="catalog-card"><div class="catalog-cover">✦</div><div><span class="tag">${item.deadline}</span><h3>${item.title}</h3><p>${item.text}</p><button class="btn subtle" onclick="showToast('تم تسجيل اهتمامك بالمسابقة!')">سجّل في المسابقة ↗</button></div></article>`).join('')}</div></div>`;
}

function renderVisitors() {
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead('تسجيل الحضور', 'استقبال الزائرين الذكي', 'تسجيل الحضور الإلكتروني مع الترحيب التلقائي من المدير الرقمي Gemini')}
      <div class="content-grid">
        <article class="card">
          <div class="card-body">
            <h2>تسجيل زيارة جديدة</h2>
            <form id="visitorForm" style="display:grid;gap:12px;margin-top:15px">
              <input type="text" id="vName" placeholder="الاسم الكامل" required>
              <input type="text" id="vJob" placeholder="الوظيفة / الصف الدراسي" required>
              <input type="text" id="vReason" placeholder="سبب الزيارة (قراءة، استعارة، نشاط...)" required>
              <button type="submit" class="btn primary">تسجيل الزيارة واعتمادها</button>
            </form>
            <div id="aiWelcomeBox" style="margin-top:15px"></div>
          </div>
        </article>
        
        <article class="card">
          <div class="card-body">
            <h2>سجل الزيارات المعتمد</h2>
            <div id="vList" class="announcement-list" style="margin-top:15px">
              ${db.visitors.length ? db.visitors.slice(-5).reverse().map(v => `
                <div class="announcement-item">
                  <div class="date-box">👤</div>
                  <div class="item-content">
                    <h3>${esc(v.name)}</h3>
                    <p>${esc(v.job)} ·${esc(v.reason)}<br><small style="color:var(--teal)">${v.welcome || v.time}</small></p>
                  </div>
                </div>`).join('') : '<p class="muted">لا يوجد زوار مسجلين اليوم حتى الآن.</p>'}
            </div>
          </div>
        </article>
      </div>
    </div>`;

  document.querySelector('#visitorForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#vName').value.trim();
    const job = document.querySelector('#vJob').value.trim();
    const reason = document.querySelector('#vReason').value.trim();
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const welcomeBox = document.querySelector('#aiWelcomeBox');
    welcomeBox.innerHTML = '<p class="muted">⏳ جاري توليد ترحيب إداري مخصص من Gemini Manager...</p>';

    let welcomeMsg = `أهلاً بك يا ${name} في مكتبة مدرسة الأمين!`;
    const key = (db.apiKey || '').trim();
    const model = db.model || 'gemini-3.5-flash-lite';

    if (key.length > 10) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `أنت Gemini، المدير الرقمي لمكتبة مدرسة الأمين. ورحب بـ (${name}) ووظيفته (${job}) وقادِم من أجل (${reason}) بعبارة ترحيبية قصيرة جداً وودودة بصفتك مدير الموقع.` }] }]
          })
        });
        const data = await res.json();
        welcomeMsg = data.candidates?.[0]?.content?.parts?.[0]?.text || welcomeMsg;
      } catch (err) { console.error(err); }
    }

    welcomeBox.innerHTML = `<div class="card card-body" style="background:#e5f4f1;border:1px solid var(--teal)"><strong>🤖 ترحيب المدير الرقمي:</strong><p style="margin-top:5px">${esc(welcomeMsg)}</p></div>`;

    db.visitors.push({ name, job, reason, time, welcome: welcomeMsg });
    saveDB();
    showToast('تم تسجيل الزيارة بنجاح!');
  });
}

function renderSupport() {
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead('الإشراف المباشر', 'مساعد ومدير المكتبة الذكي (Gemini Manager)', 'اطرح استفساراتك حول الكتب، النظم المدرسية، أو التوجيه الإداري')}
      <div class="support-layout">
        <article class="card chat-card">
          <div class="chat-head">
            <div class="bot-dot">🤖</div>
            <div>
              <strong>Gemini Manager - المدير والمراقب العام</strong>
              <small style="display:block;color:var(--muted);font-size:11px">${db.apiKey ? `● اتصال محرك Gemini مفعّل [${db.model}]` : '● الوضع المحلي التلقائي'}</small>
            </div>
          </div>
          <div class="chat-log" id="chatLog">
            <div class="message bot">مرحباً بك! أنا Gemini، المدير والرئيس الرقمي لموقع مكتبة مدرسة الأمين الابتدائية. كيف يمكنني مساعدتك أو إرشادك اليوم؟</div>
          </div>
          <form class="chat-form" id="chatForm">
            <input id="chatInput" placeholder="اكتب سؤالك أو استفسارك هنا..." autocomplete="off">
            <button type="submit">إرسال</button>
          </form>
        </article>
        
        <aside class="card">
          <div class="card-body">
            <h3>استفسارات سريعة للمدير الذكي</h3>
            <div class="faq-list" style="margin-top:12px">
              ${['ما مهام المدير الرقمي للموقع؟', 'كيف أستعير كتاباً حسب اللائحة؟', 'كيف تخدم المنصة مدرسة الأمين؟'].map(q => `<button class="faq-button" onclick="askQuestion('${q}')">${q} <span>←</span></button>`).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>`;

  const form = document.querySelector('#chatForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.querySelector('#chatInput');
    if (input.value.trim()) {
      askQuestion(input.value.trim());
      input.value = '';
    }
  });
}

async function askQuestion(q) {
  const log = document.querySelector('#chatLog');
  if (!log) return;
  log.insertAdjacentHTML('beforeend', `<div class="message user">${esc(q)}</div>`);
  log.scrollTop = log.scrollHeight;

  const loadingId = 'bot-' + Date.now();
  log.insertAdjacentHTML('beforeend', `<div class="message bot" id="${loadingId}">جاري التفكير والمعالجة بواسطة المدير الذكي...</div>`);
  
  let reply = '';
  const cleanKey = (db.apiKey || '').trim();
  const currentModel = db.model || 'gemini-3.5-flash-lite';

  if (cleanKey.length > 10) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت Gemini، المدير الرقمي والمراقب العام لموقع مكتبة مدرسة الأمين الابتدائية ببورسعيد (تحت إشراف الأستاذ محمد حامد). أسلوبك إداري، محترف، وودود للغاية. أجب بوضوح وإيجاز على الاستفسار التالي: ${q}` }] }]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Gemini Error:', data);
        reply = `⚠️ خطأ في الاتصال بالنموذج [${currentModel}]. (السبب: ${data.error?.message || 'المفتاح غير صالح'})`;
      } else {
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || localReply(q);
      }
    } catch (err) {
      console.error(err);
      reply = localReply(q);
    }
  } else {
    reply = localReply(q);
  }

  const botElem = document.getElementById(loadingId);
  if (botElem) botElem.innerText = reply;
  log.scrollTop = log.scrollHeight;
}
window.askQuestion = askQuestion;

function localReply(q) {
  const query = q.toLowerCase();
  if (query.includes('مهام') || query.includes('مدير') || query.includes('مراقب')) return 'بصفتي المدير الذكي للنظام، أقوم بمراقبة المحتوى، تسجيل ومراجعة الزوار، توجيه الطلاب، وإعداد التقييمات الإدارية بالتعاون مع أ/ محمد حامد.';
  if (query.includes('مواعيد') || query.includes('وقت')) return 'المكتبة مفتوحة رسمياً يومياً خلال اليوم الدراسي من 8 صباحاً حتى 12 ظهرًا.';
  if (query.includes('استعارة') || query.includes('كتاب')) return 'يمكنك تصفح الفهرس واختيار الكتاب، ثم إبلاغ الأستاذ محمد حامد لتسجيل الاعتماد الرسمية.';
  return 'شكراً لاستفسارك! بصفتي المدير الرقمي، يسعدني دائماً تقديم الدعم أو يمكنك مراجعة الأستاذ محمد حامد.';
}

function renderDashboard() {
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead('مركز التحكم والرقابة', 'لوحة إدارة النظام الذكية', 'ضبط المفتاح، اختيار النموذج، واختبار الاتصال الفوري بالذكاء الاصطناعي')}
      <div class="dashboard-grid">
        
        <article class="dashboard-card" style="border:2px solid var(--teal)">
          <h3>🤖 إعدادات المدير والمراقب (Gemini)</h3>
          
          <label style="display:block;margin-top:10px;font-size:12px;font-weight:700">اختر النموذج (Gemini Model):</label>
          <select id="modelSelect" style="margin-top:4px">
            <option value="gemini-3.5-flash-lite" ${db.model === 'gemini-3.5-flash-lite' ? 'selected' : ''}>gemini-3.5-flash-lite (الموصى به)</option>
            <option value="gemini-3.5-flash" ${db.model === 'gemini-3.5-flash' ? 'selected' : ''}>gemini-3.5-flash</option>
          </select>

          <label style="display:block;margin-top:10px;font-size:12px;font-weight:700">مفتاح API الخاص بـ Google AI Studio:</label>
          <input type="password" id="apiKeyInput" value="${db.apiKey || ''}" placeholder="الصق مفتاح API هنا..." style="margin-top:4px">
          
          <div style="display:flex;gap:8px;margin-top:12px">
            <button type="button" onclick="saveKey()" class="btn primary" style="flex:1">حفظ البيانات</button>
            <button type="button" onclick="testConnection()" class="btn gold" style="flex:1">اختبار الاتصال ⚡</button>
          </div>
          
          <div id="testStatus" style="margin-top:12px;padding:10px;border-radius:10px;font-size:12px;background:#f4f0e8;min-height:38px"></div>
        </article>

        <article class="dashboard-card">
          <h3>إضافة كتاب إلى الفهرس</h3>
          <form id="addBookForm" style="display:grid;gap:8px;margin-top:10px">
            <input type="text" id="bTitle" placeholder="عنوان الكتاب" required>
            <input type="text" id="bAuthor" placeholder="المؤلف" required>
            <input type="text" id="bShelf" placeholder="الرف / القسم" required>
            <select id="bType"><option value="ورقي">ورقي</option><option value="رقمي">رقمي</option></select>
            <button type="submit" class="btn primary">إضافة الكتاب</button>
          </form>
        </article>

        <article class="dashboard-card">
          <h3>التقارير وسجلات الجرد</h3>
          <p>طباعة تقارير الجرد والسجل الميداني للزائرين معتمدة رسمياً:</p>
          <button onclick="window.print()" class="btn gold block" style="margin-top:15px">طباعة تقرير المكتبة 🖨️️</button>
        </article>

      </div>
    </div>`;

  document.querySelector('#addBookForm')?.addEventListener('submit', e => {
    e.preventDefault();
    db.books.push({
      id: Date.now(),
      title: document.querySelector('#bTitle').value.trim(),
      author: document.querySelector('#bAuthor').value.trim(),
      shelf: document.querySelector('#bShelf').value.trim(),
      type: document.querySelector('#bType').value,
      status: 'متاح'
    });
    saveDB();
    showToast('تمت إضافة الكتاب بنجاح إلى الفهرس!');
    e.target.reset();
  });
}

window.saveKey = function() {
  db.apiKey = (document.querySelector('#apiKeyInput').value || '').trim();
  db.model = document.querySelector('#modelSelect').value;
  saveDB();
  showToast('تم حفظ المفتاح والنموذج بنجاح!');
  renderHome();
};

window.testConnection = async function() {
  const statusDiv = document.querySelector('#testStatus');
  const key = (document.querySelector('#apiKeyInput').value || '').trim();
  const model = document.querySelector('#modelSelect').value;

  if (!key) {
    statusDiv.innerHTML = '<span style="color:var(--brick);font-weight:bold">❌ يرجى إدخال مفتاح API أولاً.</span>';
    return;
  }

  statusDiv.innerHTML = '⏳ جاري اختبار الاتصال بالسيرفر والنموذج...';

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "اختبار" }] }]
      })
    });

    const data = await res.json();

    if (res.ok) {
      db.apiKey = key;
      db.model = model;
      saveDB();
      statusDiv.innerHTML = `<span style="color:var(--teal);font-weight:bold">✅ تم الاتصال بنجاح! النموذج [${model}] يعمل وجاهز كـ مدير ومراقب.</span>`;
    } else {
      statusDiv.innerHTML = `<span style="color:var(--brick);font-weight:bold">❌ فشل الاتصال: ${esc(data.error?.message || 'خطأ في المفتاح أو الخدمة')}</span>`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerHTML = '<span style="color:var(--brick);font-weight:bold">❌ تعذر الاتصال بالخادم. تحقق من الإنترنت.</span>';
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '/') return '/';
  return hash.startsWith('/') ? hash : '/' + hash;
}

function navigate(path) {
  const target = routes[path] ? path : '/';
  routes[target]();
  document.querySelectorAll('[data-route]').forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    const cleanHref = rawHref.replace(/^#/, '');
    const normalized = cleanHref.startsWith('/') ? cleanHref : '/' + cleanHref;
    link.classList.toggle('active', normalized === target);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-route]');
  if (link) {
    event.preventDefault();
    const rawHref = link.getAttribute('href') || '/';
    const cleanHref = rawHref.replace(/^#/, '');
    window.location.hash = '#' + (cleanHref.startsWith('/') ? cleanHref : '/' + cleanHref);
  }
});

window.addEventListener('hashchange', () => navigate(currentPath()));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

navigate(currentPath());
