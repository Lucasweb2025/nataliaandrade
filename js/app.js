const STORAGE_KEY = 'na-agendamentos';

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return { display: time, period };
}

function whatsappLink(phone, name, service, date, time) {
  const digits = phone.replace(/\D/g, '');
  const msg = encodeURIComponent(
    `Olá! Sou ${name}. Agendei ${service} para ${date} às ${time}.`
  );
  return `https://wa.me/55${digits}?text=${msg}`;
}

function renderDashboard() {
  const bookings = loadBookings();
  const today = dateKey(new Date());
  const todayList = bookings
    .filter((b) => b.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const countEl = document.getElementById('stat-today-count');
  const listEl = document.getElementById('appointments-list');
  const emptyEl = document.getElementById('appointments-empty');

  if (countEl) {
    countEl.innerHTML = `${todayList.length} <span class="text-sm text-slate-300">Hoje</span>`;
  }

  if (!listEl) return;

  if (todayList.length === 0) {
    listEl.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  listEl.innerHTML = todayList
    .map((b) => {
      const { period } = formatTime(b.time);
      const wa =
        b.phone &&
        `href="${whatsappLink(b.phone, b.name, b.service, b.date, b.time)}" target="_blank" rel="noopener"`;
      return `
        <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-4 sm:gap-5 min-w-0">
            <div class="text-center border-r border-slate-100 pr-4 shrink-0">
              <p class="text-sm font-bold text-slate-900">${b.time}</p>
              <p class="text-[10px] text-slate-400 font-bold">${period}</p>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">${b.name}</p>
              <p class="text-[11px] text-rose-gold font-medium truncate">${b.service}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">${b.phone || ''}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span class="w-2 h-2 rounded-full bg-rose-gold"></span>
            ${
              wa
                ? `<a ${wa} class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full">WhatsApp</a>`
                : ''
            }
          </div>
        </div>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', renderDashboard);
