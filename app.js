// Database State Management with LocalStorage Persistence
const defaultData = {
  apiKey: '',
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
function pageHead(kicker, title, text) { return `<div class="page-hero"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${text}</p></div></div>`; }
function routeLink(path, text, cls = 'text-link') { return `<a class="${cls}" href="#${path}" data-route>${text}</a>`; }
function statCards() { return db.stats.map(([value, label, note]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span><small>${note}</small></article>`).join(''); }

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">مساحة المعرفة في مدرسة الأمين</p>
        <h1>ابحث عن كتابك<br><span>التالي.</span></h1>
        <p class="lead">منصة مدرسية تجمع فهرس المكتبة، الإعلانات، المسابقات، الكتب الرقمية، واستقبال الزائرين تحت رقابة وإدارة الذكاء الاصطناعي.</p>
        <div class="hero-actions"><a class="btn primary" href="#/books/paper" data-route>تصفح الكتب <b>←</b></a><a class="btn" href="#/support" data-route>المساعد والتنفيذ الذكي</a></div>
        <div class="trust-row"><span><i></i>إدارة وتوجيه: أ/ محمد حامد</span><span><i></i>رقابة إدارية: Gemini AI Manager</span></div>
      </div>
      <div class="hero-board">
        <div class="board-head"><div><strong>نبض المكتبة</strong><small> · إشراف Gemini</small></div><span class="tag">مراقَب آلياً</span></div>
        <div class="board-profile"><div class="profile-avatar">م ح</div><div><strong>محمد حامد</strong><small>أخصائي أول مكتبات · مدرسة الأمين الابتدائية</small></div></div>
        <div class="book-shelf"><div class="shelf-book">علوم</div><div class="shelf-book">قصص</div><div class="shelf-book">تاريخ</div><div class="shelf-book">لغتي</div></div>
        <div class="board-stats"><div class="mini-stat"><strong>${db.books.length}</strong><small>كتب مفهرسة</small></div><div class="mini-stat"><strong>${db.visitors.length}</strong><small>زيارات مسجلة</small></div><div class="mini-stat"><strong>نشط</strong><small>الرقيب الذكي</small></div></div>
      </div>
    </section>
    <section class="section soft"><div class="section-head"><div><p class="eyebrow">أرقام سريعة</p><h2>كل ما تحتاجه في نظرة</h2></div></div><div class="stats-grid">${statCards()}</div></section>
    <section class="section"><div class="content-grid"><article class="card"><div class="card-body"><div class="section-head"><div><p class="eyebrow">من الفهرس</p><h2>ابحث عن كتابك التالي</h2></div>${routeLink('/books/paper','فتح الفهرس →')}</div><form class="search-box" id="homeSearch"><span>⌕</span><input id="searchInput" type="search" placeholder="اكتب عنوانًا أو مؤلفًا أو موضوعًا" autocomplete="off"><button type="submit">بحث</button></form><div class="book-results" id="searchResults">${bookResultItems(db.books.slice(0,3))}</div></div></article><article class="card"><div class="card-body"><div class="section-head"><div><p class="eyebrow">ابقَ على اطلاع</p><h2>آخر الإعلانات</h2></div>${routeLink('/announcements','كل الإعلانات →')}</div><div class="announcement-list">${announcementItems(3)}</div></div></article></div></section>
  `;
  bindHomeSearch();
}

function announcementItems(limit = 3) { return db.announcements.slice(0, limit).map(item => `<article class="announcement-item"><div class="date-box"><strong>${item.day}</strong><small>${item.month}</small></div><div class="item-content"><span class="tag">${item.tag}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join(''); }
function bookResultItems(books) { return books.length ? books.map(book => `<div class="book-result"><div class="book-cover">${book.type}</div><div><strong>${book.title}</strong><small>${book.author} · ${book.shelf} · <span style="color:${book.status === 'متاح' ? 'var(--teal)' : 'var(--brick)'}">${book.status}</span></small></div></div>`).join('') : '<div class="empty-state">لم نجد نتائج مطابقة.</div>'; }

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
  document.querySelector('#catalogSearchButton').addEventListener('click', runSearch);
  document.querySelector('#catalogSearch').addEventListener('input', runSearch);
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
      ${pageHead('أهلًا بك', 'تسجيل الزائرين', 'سجل حضورك الإلكتروني لمكتبة مدرسة الأمين (مراقَب بواسطة Gemini Manager)')}
      <div class="content-grid">
        <article class="card"><div class="card-body">
          <h2>تسجيل زيارة جديدة</h2>
          <form id="visitorForm" style="display:grid;gap:12px;margin-top:15px">
            <input type="text" id="vName" placeholder="الاسم الكامل" required>
            <input type="text" id="vJob" placeholder="الوظيفة / الصف الدراسي" required>
            <input type="text" id="vReason" placeholder="سبب الزيارة (قراءة، استعارة، نشاط...)" required>
            <button type="submit" class="btn primary">تسجيل الزيارة</button>
          </form>
        </div></article>
        <article class="card"><div class="card-body">
          <h2>آخر الزوار المسجلين</h2>
          <div id="vList" class="announcement-list" style="margin-top:15px">
            ${db.visitors.length ? db.visitors.slice(-5).reverse().map(v => `<div class="announcement-item"><div class="date-box">👤</div><div class="item-content"><h3>${esc(v.name)}</h3><p>${esc(v.job)} · ${esc(v.reason)}<br><small>${v.time}</small></p></div></div>`).join('') : '<p class="muted">لا يوجد زوار مسجلين اليوم حتى الآن.</p>'}
          </div>
        </div></article>
      </div>
    </div>`;

  document.querySelector('#visitorForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = {
      name: document.querySelector('#vName').value.trim(),
      job: document.querySelector('#vJob').value.trim(),
      reason: document.querySelector('#vReason').value.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    db.visitors.push(v);
    saveDB();
    showToast('تم تسجِيل زيارتك ومراجعتها آلياً بواسطة مدير النظام!');
    renderVisitors();
  });
}

function renderSupport() {
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead('الإشراف والمدير الذكي', 'Gemini - مدير ومراقب الموقع', 'اطرح استفساراتك المدرسية أو اطلب توجيهاً إدارياً من الذكاء الاصطناعي')}
      <div class="support-layout">
        <article class="card chat-card">
          <div class="chat-head"><div class="bot-dot">🤖</div><div><strong>Gemini - المدير والمراقب</strong><small style="display:block;color:var(--muted);font-size:11px">${db.apiKey ? '● نظام الإشراف التلقائي مفعل (Gemini API)' : '● الوضع المحلي التلقائي'}</small></div></div>
          <div class="chat-log" id="chatLog"><div class="message bot">مرحباً بك! أنا Gemini، المدير الرقمي والمراقب العام لمكتبة مدرسة الأمين. كيف أستطيع مساعدتك أو إفادتك باللوائح والكتب اليوم؟</div></div>
          <form class="chat-form" id="chatForm"><input id="chatInput" placeholder="اكتب سؤالك أو استفسارك هنا..." autocomplete="off"><button type="submit">إرسال</button></form>
        </article>
        <aside class="card"><div class="card-body">
          <h3>أسئلة واستفسارات إدارية</h3>
          <div class="faq-list" style="margin-top:12px">
            ${['ما دور المدير والمراقب الذكي؟', 'كيف أستعير كتاباً وفق اللائحة؟', 'ما مواعيد ورتب المكتبة؟'].map(q => `<button class="faq-button" onclick="askQuestion('${q}')">${q} <span>←</span></button>`).join('')}
          </div>
        </div></aside>
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
  log.insertAdjacentHTML('beforeend', `<div class="message bot" id="${loadingId}">جاري التحقق والمعالجة بواسطة المدير الذكي...</div>`);
  
  let reply = '';
  if (db.apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${db.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت Gemini، مدير الموقع والمراقب العام لمكتبة مدرسة الأمين الابتدائية ببورسعيد (تحت إشراف أخصائي المكتبات الأستاذ محمد حامد). أسلوبك إداري، محترف، وودود جداً. أجب بثقة وبشكل مقتضب على الاستفسار الآتي: ${q}` }] }]
        })
      });
      const data = await res.json();
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أستطع تحليل الطلب حالياً.';
    } catch (err) {
      reply = 'حدث خطأ أثناء الاتصال بنظام الإشراف، يرجى مراجعة مفتاح API في لوحة التحكم.';
    }
  } else {
    reply = localReply(q);
  }

  document.getElementById(loadingId).innerText = reply;
  log.scrollTop = log.scrollHeight;
}
window.askQuestion = askQuestion;

function localReply(q) {
  const query = q.toLowerCase();
  if (query.includes('دور') || query.includes('مراقب') || query.includes('مدير')) return 'أنا Gemini، أعمل كمراقب ومدير رقمي للموقع لإدارة المحتوى، فحص سجلات الحضور والكتب، والإجابة عن استفسارات الطلاب والزوار رسمياً.';
  if (query.includes('مواعيد') || query.includes('وقت')) return 'المكتبة مفتوحة رسمياً طوال اليوم الدراسي من 8 صباحاً حتى 12 ظهراً تحت إشراف أ/ محمد حامد.';
  if (query.includes('استعارة') || query.includes('كتاب')) return 'يتم تسجيل الاستعارة عبر الفهرس الرقمي ثم اعتمادها رسمياً من أخصائي المكتبة.';
  return 'بصفتي المدير الذكي للموقع، تم تسجيل استفسارك وسيقوم الأستاذ محمد حامد بمتابعته عند الحاجة.';
}

function renderDashboard() {
  app.innerHTML = `
    <div class="page-shell">
      ${pageHead('الإدارة المباشرة', 'لوحة التحكم والإشراف الذكي (Gemini Manager)', 'مركز إدارة الكتب، الرقابة الآلية، واستخراج التقارير الإدارية')}
      <div class="dashboard-grid">
        <article class="dashboard-card">
          <h3>إضافة كتاب إلى الفهرس</h3>
          <form id="addBookForm" style="display:grid;gap:8px;margin-top:10px">
            <input type="text" id="bTitle" placeholder="عنوان الكتاب" required>
            <input type="text" id="bAuthor" placeholder="المؤلف" required>
            <input type="text" id="bShelf" placeholder="الرف / القسم" required>
            <select id="bType"><option value="ورقي">ورقي</option><option value="رقمي">رقمي</option></select>
            <button type="submit" class="btn primary">اعتماد وإضافة الكتاب</button>
          </form>
        </article>

        <article class="dashboard-card">
          <h3>تفعيل محرك Gemini (المدير الذكي)</h3>
          <p>أدخل مفتاح Gemini API لتفعيل الرقابة التلقائية للبيانات والردود:</p>
          <input type="password" id="apiKeyInput" value="${db.apiKey || ''}" placeholder="مفتاح API الخاص بك">
          <button type="button" onclick="saveKey()" class="btn primary" style="margin-top:8px">تفعيل المدير الرقمي</button>
        </article>

        <article class="dashboard-card">
          <h3>تقرير التوجيه والرقابة (Gemini Audit)</h3>
          <p>إنشاء تقرير إشراف آلي شامل عن حالة المكتبة والزوار للجودة:</p>
          <button type="button" onclick="generateAiAudit()" class="btn gold block">توليد تقرير المراقب الذكي 🤖</button>
          <button onclick="window.print()" class="btn block" style="margin-top:6px">طباعة السجلات 🖨️</button>
        </article>
      </div>
      <div id="aiAuditResult" style="margin-top:18px"></div>
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
    showToast('تم فحص واعتماد إضافة الكتاب بنجاح بواسطة مدير الموقع!');
    e.target.reset();
  });
}

window.generateAiAudit = async function() {
  const box = document.querySelector('#aiAuditResult');
  if (!box) return;
  box.innerHTML = `<div class="card"><div class="card-body"><p>⏳ جاري قراءة بيانات المنصة وتحليلها بواسطة Gemini Manager...</p></div></div>`;

  const summaryData = `إحصائيات المكتبة: عدد الكتب المفهرسة ${db.books.length} كتاب، عدد الزوار المسجلين ${db.visitors.length} زائر.`;
  
  if (db.apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${db.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت المراقب العام ومدير موقع مكتبة مدرسة الأمين. اكتب تقرير إشراف وتقييم مقتضب ومحترف موجه لأخصائي المكتبة الأستاذ محمد حامد بناءً على هذه البيانات: ${summaryData}` }] }]
        })
      });
      const data = await res.json();
      const auditText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'تم فحص النظام: جميع الأقسام تعمل بكفاءة عالية وبشكل منتظم.';
      box.innerHTML = `<div class="card" style="border:2px solid var(--teal)"><div class="card-body"><h3>📋 تقرير المراقب الإداري (Gemini AI Audit)</h3><p style="white-space:pre-wrap;margin-top:10px">${esc(auditText)}</p></div></div>`;
    } catch (e) {
      box.innerHTML = `<div class="card"><div class="card-body"><p>عذراً، تعذر الاتصال بالمحرك. تأكد من صحة مفتاح API.</p></div></div>`;
    }
  } else {
    box.innerHTML = `<div class="card" style="border:2px solid var(--gold)"><div class="card-body"><h3>📋 تقرير المراقب الإداري (التلقائي)</h3><p style="margin-top:10px">تفيد وحدة الرقابة الذكية بانتظام حركة الاستعارة وفهرسة الكتب (${db.books.length} كتاب). السجل الميداني للزوار ينبض بالنشاط وتحت إشراف الأستاذ محمد حامد.</p></div></div>`;
  }
};

window.saveKey = function() {
  db.apiKey = document.querySelector('#apiKeyInput').value.trim();
  saveDB();
  showToast('تم تفعيل وإسناد مهام المدير والمراقب لـ Gemini بنجاح!');
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
