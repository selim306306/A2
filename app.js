const data = {
  stats: [
    ['2,480', 'كتاب ورقي', 'مفهرس وقابل للبحث'],
    ['360', 'كتاب رقمي', 'قراءة داخل المنصة'],
    ['128', 'إعارة نشطة', 'مع متابعة الإرجاع'],
    ['42', 'زائرًا هذا الشهر', 'سجل إلكتروني منظم']
  ],
  books: [
    { title: 'موسوعة العلوم المبسطة', author: 'مجموعة مؤلفين', type: 'ورقي', shelf: 'قسم العلوم', status: 'متاح' },
    { title: 'رحلة في تاريخ مصر', author: 'محمد فريد', type: 'ورقي', shelf: 'التاريخ والجغرافيا', status: 'معار' },
    { title: 'حكايات من التراث', author: 'أحمد شوقي', type: 'رقمي', shelf: 'المطالعة الحرة', status: 'متاح' },
    { title: 'دليل التجارب المدرسية', author: 'مركز تطوير المناهج', type: 'رقمي', shelf: 'العلوم والتجارب', status: 'متاح' },
    { title: 'لغتي الجميلة للناشئين', author: 'إدارة المناهج', type: 'ورقي', shelf: 'اللغة العربية', status: 'متاح' },
    { title: 'أطلس العالم الصغير', author: 'دار المعرفة', type: 'ورقي', shelf: 'الجغرافيا', status: 'متاح' }
  ],
  announcements: [
    { day: '12', month: 'أكتوبر', title: 'بدء أسبوع القراءة الحرة', text: 'اختار كتابًا، اكتب انطباعك، وشارك زملاءك الفكرة.', tag: 'نشاط المكتبة' },
    { day: '18', month: 'أكتوبر', title: 'تحديث مواعيد الاستعارة', text: 'الاستعارة متاحة يوميًا من الثامنة حتى الثانية عشرة.', tag: 'تنبيه' },
    { day: '25', month: 'أكتوبر', title: 'وصول دفعة كتب جديدة', text: 'كتب جديدة في العلوم والقصص والمهارات الحياتية.', tag: 'كتب جديدة' }
  ],
  competitions: [
    { title: 'قارئ الشهر', text: 'اقرأ ثلاثة كتب وقدّم بطاقة تلخيص قصيرة.', deadline: 'آخر موعد 30 أكتوبر', color: 'teal' },
    { title: 'أفضل قصة قصيرة', text: 'مسابقة للصفوف العليا حول الخيال العلمي.', deadline: 'آخر موعد 6 نوفمبر', color: 'gold' },
    { title: 'باحث صغير', text: 'اكتشف معلومة موثوقة واذكر مصدرها.', deadline: 'آخر موعد 12 نوفمبر', color: 'brick' }
  ]
};

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

function icon(symbol) { return `<span class="quick-icon" aria-hidden="true">${symbol}</span>`; }
function esc(value) { return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[ch])); }
function pageHead(kicker, title, text, action = '') { return `<div class="page-hero"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${text}</p></div>${action}</div>`; }
function routeLink(path, text, cls = 'text-link') { return `<a class="${cls}" href="${path}" data-route>${text}</a>`; }
function statCards() { return data.stats.map(([value, label, note]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span><small>${note}</small></article>`).join(''); }
function announcementItems(limit = 3) { return data.announcements.slice(0, limit).map(item => `<article class="announcement-item"><div class="date-box"><strong>${item.day}</strong><small>${item.month}</small></div><div class="item-content"><span class="tag">${item.tag}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join(''); }
function competitionItems(limit = 3) { return data.competitions.slice(0, limit).map(item => `<article class="competition-item"><div class="date-box" style="background:${item.color === 'gold' ? 'var(--gold-soft)' : item.color === 'brick' ? '#f4dbd5' : '#dcefeb'}">◈</div><div class="item-content"><span class="tag">${item.deadline}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join(''); }
function quickCards() { return [ ['/books/paper','▥','الكتب الورقية','فهرس وإعارات'], ['/books/digital','▤','الكتب الرقمية','قراءة إلكترونية'], ['/competitions','✦','المسابقات','شارك وتعلّم'], ['/visitors','♧','الزائرون','سجّل زيارتك'] ].map(([href, sym, title, sub]) => `<a class="quick-card" href="${href}" data-route>${icon(sym)}<span><strong>${title}</strong><small>${sub}</small></span></a>`).join(''); }

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">مساحة المعرفة في مدرسة الأمين</p>
        <h1>ابحث عن كتابك<br><span>التالي.</span></h1>
        <p class="lead">منصة مدرسية تجمع فهرس المكتبة، الإعلانات، المسابقات، الكتب الرقمية، واستقبال الزائرين في تجربة واحدة واضحة.</p>
        <div class="hero-actions"><a class="btn primary" href="/books/paper" data-route>تصفح الكتب <b>←</b></a><a class="btn" href="/support" data-route>اسأل المساعد الذكي</a></div>
        <div class="trust-row"><span><i></i>بيانات منظمة وقابلة للتحديث</span><span><i></i>واجهة مناسبة للهاتف</span><span><i></i>تحت إشراف محمد حامد</span></div>
      </div>
      <div class="hero-board">
        <div class="board-head"><div><strong>نبض المكتبة</strong><small> · تحديث اليوم</small></div><span class="tag">مفتوح الآن</span></div>
        <div class="board-profile"><div class="profile-avatar">م ح</div><div><strong>محمد حامد</strong><small>أخصائي أول مكتبات · مدرسة الأمين الابتدائية</small></div></div>
        <div class="book-shelf"><div class="shelf-book">علوم</div><div class="shelf-book">قصص</div><div class="shelf-book">تاريخ</div><div class="shelf-book">لغتي</div></div>
        <div class="board-stats"><div class="mini-stat"><strong>2,480</strong><small>كتاب مفهرس</small></div><div class="mini-stat"><strong>18</strong><small>نشاطًا هذا الشهر</small></div><div class="mini-stat"><strong>96%</strong><small>جاهزية النظام</small></div></div>
      </div>
    </section>
    <section class="section soft"><div class="section-head"><div><p class="eyebrow">أرقام سريعة</p><h2>كل ما تحتاجه في نظرة</h2></div><span class="muted">بيانات تجريبية قابلة للربط بقاعدة البيانات</span></div><div class="stats-grid">${statCards()}</div></section>
    <section class="section"><div class="section-head"><div><p class="eyebrow">الوصول السريع</p><h2>أقسام المنصة</h2></div></div><div class="quick-links">${quickCards()}</div></section>
    <section class="section"><div class="content-grid"><article class="card"><div class="card-body"><div class="section-head"><div><p class="eyebrow">من الفهرس</p><h2>ابحث عن كتابك التالي</h2></div>${routeLink('/books/paper','فتح الفهرس →')}</div><form class="search-box" id="homeSearch"><span>⌕</span><input id="searchInput" type="search" placeholder="اكتب عنوانًا أو مؤلفًا أو موضوعًا" autocomplete="off"><button type="submit">بحث</button></form><div class="book-results" id="searchResults">${bookResultItems(data.books.slice(0,3))}</div></div></article><article class="card"><div class="card-body"><div class="section-head"><div><p class="eyebrow">ابقَ على اطلاع</p><h2>آخر الإعلانات</h2></div>${routeLink('/announcements','كل الإعلانات →')}</div><div class="announcement-list">${announcementItems(3)}</div></div></article></div></section>
    <section class="section soft"><div class="content-grid"><article><div class="section-head"><div><p class="eyebrow">شارك وتعلّم</p><h2>المسابقات النشطة</h2></div>${routeLink('/competitions','كل المسابقات →')}</div><div class="card"><div class="card-body"><div class="competition-list">${competitionItems(3)}</div></div></div></article><article class="assistant-promo"><div><p class="eyebrow" style="color:var(--gold)">مساعدك داخل المكتبة</p><h2>اسأل عن كتاب، إجراء، أو مسابقة.</h2><p>المساعد التجريبي يجيب من معلومات المدرسة، ويمكن ربطه لاحقًا بقاعدة معرفة ومزوّد ذكاء اصطناعي عبر الخادم.</p><a class="btn gold" style="margin-top:18px" href="/support" data-route>ابدأ الحوار ←</a></div><div class="assistant-bubble">?</div></article></div></section>
  `;
  bindHomeSearch();
}

function bookResultItems(books) { return books.length ? books.map(book => `<div class="book-result"><div class="book-cover">${book.type}</div><div><strong>${book.title}</strong><small>${book.author} · ${book.shelf} · <span style="color:${book.status === 'متاح' ? 'var(--teal)' : 'var(--brick)'}">${book.status}</span></small></div></div>`).join('') : '<div class="empty-state">لم نجد كتابًا بهذه الكلمات. جرّب عنوانًا أو مؤلفًا مختلفًا.</div>'; }
function bindHomeSearch() { const form = document.querySelector('#homeSearch'); if (!form) return; form.addEventListener('submit', event => { event.preventDefault(); const term = document.querySelector('#searchInput').value.trim().toLowerCase(); const found = data.books.filter(book => [book.title, book.author, book.shelf].join(' ').toLowerCase().includes(term)); document.querySelector('#searchResults').innerHTML = bookResultItems(term ? found : data.books.slice(0,3)); }); }

function renderCatalog(kind, title, text, type) {
  const books = data.books.filter(book => book.type === type);
  app.innerHTML = `<div class="page-shell">${pageHead(type === 'ورقي' ? 'فهرس المكتبة' : 'المكتبة الرقمية', title, text, '<button class="btn primary" data-action="notify">اقتراح إضافة كتاب</button>')}<div class="search-box"><span>⌕</span><input id="catalogSearch" type="search" placeholder="ابحث في هذا القسم..." autocomplete="off"><button type="button" id="catalogSearchButton">بحث</button></div><div class="catalog-grid" id="catalogGrid">${catalogCards(books)}</div></div>`;
  const runSearch = () => { const term = document.querySelector('#catalogSearch').value.trim().toLowerCase(); const found = books.filter(book => [book.title, book.author, book.shelf].join(' ').toLowerCase().includes(term)); document.querySelector('#catalogGrid').innerHTML = catalogCards(found); };
  document.querySelector('#catalogSearchButton').addEventListener('click', runSearch); document.querySelector('#catalogSearch').addEventListener('input', runSearch);
}
function catalogCards(books) { return books.length ? books.map(book => `<article class="catalog-card"><div class="catalog-cover">${book.type}</div><div><span class="tag">${book.status}</span><h3>${book.title}</h3><p>${book.author}<br>${book.shelf}</p><button class="btn subtle" data-action="notify">${book.type === 'رقمي' ? 'قراءة تجريبية' : 'طلب استعارة'} ↗</button></div></article>`).join('') : '<div class="empty-state" style="grid-column:1/-1">لا توجد نتائج مطابقة في هذا القسم.</div>'; }
function renderAnnouncements() { app.innerHTML = `<div class="page-shell">${pageHead('لوحة الأخبار', 'الإعلانات والأنشطة', 'كل ما يخص مواعيد المكتبة والكتب الجديدة والفعاليات المدرسية.', '<button class="btn primary" data-action="notify">إضافة إعلان</button>')}<div class="card"><div class="card-body"><div class="announcement-list">${announcementItems(10)}</div></div></div></div>`; }
function renderCompetitions() { app.innerHTML = `<div class="page-shell">${pageHead('تعلّم وشارك', 'المسابقات', 'مساحات صغيرة للقراءة والبحث والكتابة، مع مواعيد وشروط قابلة للتحديث.', '<button class="btn primary" data-action="notify">سجّل في مسابقة</button>')}<div class="catalog-grid">${data.competitions.map(item => `<article class="catalog-card"><div class="catalog-cover" style="background:${item.color === 'gold' ? 'var(--gold)' : item.color === 'brick' ? 'var(--brick)' : 'var(--teal)'}">✦</div><div><span class="tag">${item.deadline}</span><h3>${item.title}</h3><p>${item.text}</p><button class="btn subtle" data-action="notify">عرض التفاصيل ↗</button></div></article>`).join('')}</div></div>`; }
function renderVisitors() { app.innerHTML = `<div class="page-shell">${pageHead('أهلًا بك', 'استقبال الزائرين', 'سجّل زيارتك أو تعرّف على خدمات المكتبة قبل بدء الحوار مع المساعد الذكي.', '<button class="btn primary" data-action="notify">بدء تسجيل زيارة</button>')}<div class="content-grid"><article class="card"><div class="card-body"><p class="eyebrow">خطوات بسيطة</p><h2>زيارة منظمة وودية</h2><div class="dashboard-grid" style="grid-template-columns:1fr 1fr;margin-top:18px"><div class="dashboard-card">${icon('١')}<h3>سجّل بياناتك</h3><p>الاسم، الوظيفة، الجهة، وسبب الزيارة.</p></div><div class="dashboard-card">${icon('٢')}<h3>تعرّف على المكتبة</h3><p>استكشف الكتب والخدمات المتاحة للزائرين.</p></div><div class="dashboard-card">${icon('٣')}<h3>اسأل المساعد</h3><p>ينقلك الموقع إلى حوار يجيب عن استفسارك.</p></div><div class="dashboard-card">${icon('٤')}<h3>سجّل وقت المغادرة</h3><p>سجل زيارة واضح يساعد الإدارة على المتابعة.</p></div></div></div></article><article class="card"><div class="card-body"><p class="eyebrow">معلومة سريعة</p><h2>خدمات المكتبة</h2><div class="announcement-list"><div class="announcement-item"><div class="date-box">▥</div><div class="item-content"><h3>بحث وفهرسة</h3><p>ابحث في الكتب الورقية والرقمية.</p></div></div><div class="announcement-item"><div class="date-box">✦</div><div class="item-content"><h3>أنشطة ومسابقات</h3><p>شارك في فعاليات القراءة والبحث.</p></div></div><div class="announcement-item"><div class="date-box">?</div><div class="item-content"><h3>دعم فني ذكي</h3><p>إجابة أولية على أسئلتك داخل المنصة.</p></div></div></div><a class="btn primary block" href="/support" data-route style="margin-top:15px">انتقل إلى المساعد الذكي</a></div></article></div></div>`; }
function renderSupport() { app.innerHTML = `<div class="page-shell">${pageHead('دعم فني وإرشاد', 'المساعد الذكي', 'مساعد تجريبي يفهم أسئلة المكتبة، ويرشد الزائر إلى القسم المناسب.', '<span class="tag">نسخة تجريبية محلية</span>')}<div class="support-layout"><article class="card chat-card"><div class="chat-head"><div class="bot-dot">?</div><div><strong>مساعد مكتبة الأمين</strong><small style="display:block;color:var(--muted);font-size:11px">متصل بالمعرفة التجريبية</small></div></div><div class="chat-log" id="chatLog"><div class="message bot">أهلًا بك. اسألني عن كتاب، استعارة، مسابقة، أو طريقة تسجيل زيارة.</div></div><form class="chat-form" id="chatForm"><input id="chatInput" placeholder="اكتب سؤالك هنا..." autocomplete="off"><button type="submit">إرسال</button></form></article><aside class="card"><div class="card-body"><p class="eyebrow">أسئلة مقترحة</p><h2>ابدأ من هنا</h2><div class="faq-list">${['كيف أبحث عن كتاب؟','ما مواعيد المكتبة؟','كيف أسجل في مسابقة؟','كيف أسجل كزائر؟'].map(q => `<button class="faq-button" data-question="${q}">${q} <span>←</span></button>`).join('')}</div><div class="security-note" style="margin-top:18px"><div>!</div><div><strong>نقطة الربط المستقبلية</strong><p>سيتم توصيل هذا الحوار لاحقًا بخدمة ذكاء اصطناعي عبر الخادم، مع قاعدة معرفة المدرسة، دون وضع مفاتيح الخدمة في الواجهة.</p></div></div></div></aside></div></div>`; bindSupport(); }
function assistantReply(question) { const q = question.toLowerCase(); if (q.includes('مواعيد') || q.includes('وقت')) return 'المكتبة مفتوحة تجريبيًا من الساعة 8 صباحًا حتى 12 ظهرًا. يمكن تعديل المواعيد من لوحة التحكم.'; if (q.includes('مسابقة')) return 'تستطيع مشاهدة المسابقات النشطة من تبويب المسابقات، ثم اختيار المسابقة والضغط على التسجيل.'; if (q.includes('زائر')) return 'افتح تبويب الزائرين، وسجّل الاسم والوظيفة وسبب الزيارة، ثم يمكنك متابعة الحوار معي.'; if (q.includes('بحث') || q.includes('كتاب')) return 'استخدم فهرس الكتب واكتب العنوان أو اسم المؤلف أو القسم. ستظهر حالة الكتاب ومكانه.'; return 'فهمت سؤالك مبدئيًا. في النسخة الكاملة سأرجع إلى قاعدة معرفة المدرسة وأرشدك للإجراء المناسب.'; }
function bindSupport() { const log = document.querySelector('#chatLog'); const form = document.querySelector('#chatForm'); const input = document.querySelector('#chatInput'); const ask = question => { if (!question.trim()) return; log.insertAdjacentHTML('beforeend', `<div class="message user">${esc(question)}</div><div class="message bot">${esc(assistantReply(question))}</div>`); log.scrollTop = log.scrollHeight; input.value = ''; }; form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); }); document.querySelectorAll('[data-question]').forEach(btn => btn.addEventListener('click', () => ask(btn.dataset.question))); }
function renderDashboard() { app.innerHTML = `<div class="page-shell">${pageHead('إدارة المنصة', 'لوحة التحكم', 'مركز متابعة الكتب والإعارات والزائرين والمحتوى المنشور.', '<button class="btn primary" data-action="notify">حفظ التغييرات</button>')}<div class="security-note" style="margin-bottom:18px"><div>!</div><div><strong>تنبيه أمني قبل الإنتاج</strong><p>كلمات المرور الاختبارية التي تم تحديدها للمشروع لا يجب تخزينها مباشرة داخل واجهة المتصفح. يلزم تنفيذ المصادقة والصلاحيات على خادم آمن مع تجزئة كلمات المرور وسجل نشاط.</p></div></div><div class="stats-grid" style="margin-bottom:18px">${statCards()}</div><div class="dashboard-grid"><article class="dashboard-card"><p class="eyebrow">الهوية</p><h3>بيانات المدرسة</h3><p>تعديل اسم المدرسة، المحافظة، الإدارة، الشعار، صورة المدير والوكيل وصورة محمد حامد.</p><button class="btn" data-action="notify">فتح الإعدادات ↗</button></article><article class="dashboard-card"><p class="eyebrow">المحتوى</p><h3>الكتب والإعلانات</h3><p>إضافة الكتب الورقية والرقمية، نشر إعلان، وإدارة المسابقات والأنشطة.</p><button class="btn" data-action="notify">إدارة المحتوى ↗</button></article><article class="dashboard-card"><p class="eyebrow">السجلات</p><h3>التقارير والجرد</h3><p>متابعة الإعارات، الزائرين، الجرد والتقارير الشهرية مع التصدير والطباعة.</p><button class="btn" data-action="notify">عرض التقارير ↗</button></article></div><div class="card" style="margin-top:18px"><div class="card-body"><p class="eyebrow">آخر النشاط</p><h2>ملخص اليوم</h2><div class="table-card"><table><thead><tr><th>النشاط</th><th>الحالة</th><th>الوقت</th></tr></thead><tbody><tr><td>إضافة كتاب «موسوعة العلوم المبسطة»</td><td><span class="tag">مكتمل</span></td><td>09:20</td></tr><tr><td>تسجيل زيارة جديدة</td><td><span class="tag">بانتظار المراجعة</span></td><td>10:05</td></tr><tr><td>تحديث إعلان أسبوع القراءة</td><td><span class="tag">منشور</span></td><td>11:15</td></tr></tbody></table></div></div></div></div>`; }

function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800); }
function currentPath() { return window.location.pathname === '/index.html' ? '/' : window.location.pathname.replace(/\/$/, '') || '/'; }
function navigate(path, replace = false) { const next = routes[path] ? path : '/'; if (replace) history.replaceState({}, '', next); else history.pushState({}, '', next); routes[next](); document.title = next === '/' ? 'مكتبة الأمين الذكية' : `${document.querySelector('.page-hero h1')?.textContent || 'منصة مكتبة الأمين'} · مكتبة الأمين`; document.querySelectorAll('[data-route]').forEach(link => link.classList.toggle('active', link.getAttribute('href') === next)); window.scrollTo({ top: 0, behavior: 'smooth' }); app.focus({ preventScroll: true }); }

document.addEventListener('click', event => { const link = event.target.closest('a[data-route]'); if (link) { event.preventDefault(); navigate(link.getAttribute('href')); } const action = event.target.closest('[data-action]'); if (action) showToast('هذه وظيفة تجريبية، وستتصل بالبيانات في المرحلة التالية.'); });
window.addEventListener('popstate', () => navigate(currentPath(), true));
document.querySelector('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('aminlib-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
if (localStorage.getItem('aminlib-theme') === 'dark') document.body.classList.add('dark');
document.querySelector('#menuToggle').addEventListener('click', () => { const nav = document.querySelector('.primary-nav'); const shown = nav.style.display === 'flex'; nav.style.display = shown ? '' : 'flex'; nav.style.position = shown ? '' : 'absolute'; nav.style.top = shown ? '' : '65px'; nav.style.right = shown ? '' : '15px'; nav.style.left = shown ? '' : '15px'; nav.style.padding = shown ? '' : '14px'; nav.style.flexDirection = shown ? '' : 'column'; nav.style.alignItems = shown ? '' : 'stretch'; nav.style.borderRadius = shown ? '' : '14px'; nav.style.background = shown ? '' : 'var(--ink)'; });
navigate(currentPath(), true);
