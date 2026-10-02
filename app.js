async function askQuestion(q) {
  const log = document.querySelector('#chatLog');
  if (!log) return;
  log.insertAdjacentHTML('beforeend', `<div class="message user">${esc(q)}</div>`);
  log.scrollTop = log.scrollHeight;

  const loadingId = 'bot-' + Date.now();
  log.insertAdjacentHTML('beforeend', `<div class="message bot" id="${loadingId}">جاري التفكير...</div>`);
  
  let reply = '';
  const cleanKey = (db.apiKey || '').trim();

  if (cleanKey.length > 10) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت مساعد رقمي ومراقب لمكتبة مدرسة الأمين الابتدائية ببورسعيد تحت إشراف الأستاذ محمد حامد. أجب بأسلوب ودود وموجز باللغة العربية: ${q}` }] }]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Gemini API Error:', data);
        reply = `⚠️ مفتاح API غير صالح أو غير مفعّل. (السبب: ${data.error?.message || 'خطأ من جوجل'})`;
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
