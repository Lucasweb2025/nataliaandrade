const STORAGE_KEY = 'na-agendamentos';

const WORK_DAYS = [2, 3, 4, 5, 6]; // Ter–Sáb (0=Dom)
const SLOT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30'
];

let viewYear, viewMonth;
let selectedDate = null;
let selectedTime = null;
let bookings = [];

const $ = (id) => document.getElementById(id);

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    bookings = raw ? JSON.parse(raw) : [];
  } catch {
    bookings = [];
  }
}

function saveBookings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isBooked(dateStr, time) {
  return bookings.some((b) => b.date === dateStr && b.time === time);
}

function bookingsOnDate(dateStr) {
  return bookings.filter((b) => b.date === dateStr);
}

function isPastDate(d) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(d);
  check.setHours(0, 0, 0, 0);
  return check < today;
}

function isPastTime(dateStr, time) {
  const todayKey = dateKey(new Date());
  if (dateStr !== todayKey) return false;
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const slot = new Date();
  slot.setHours(h, m, 0, 0);
  return slot <= now;
}

function isWorkingDay(d) {
  return WORK_DAYS.includes(d.getDay());
}

function formatDateLabel(dateStr) {
  const d = parseDateKey(dateStr);
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function renderCalendar() {
  const grid = $('calendar-grid');
  const title = $('calendar-title');
  const first = new Date(viewYear, viewMonth, 1);
  const last = new Date(viewYear, viewMonth + 1, 0);

  title.textContent = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  grid.innerHTML = '';

  for (let i = 0; i < startPad; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }

  const todayKey = dateKey(new Date());

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(viewYear, viewMonth, day);
    const key = dateKey(d);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = day;

    const past = isPastDate(d);
    const closed = !isWorkingDay(d);
    const disabled = past || closed;
    const hasBookings = bookingsOnDate(key).length > 0;

    btn.className = [
      'relative aspect-square rounded-xl text-sm font-semibold transition-all',
      disabled ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-800',
      selectedDate === key ? 'day-selected' : '',
      hasBookings && !disabled ? 'day-has-bookings' : ''
    ].filter(Boolean).join(' ');

    if (key === todayKey && !disabled) {
      btn.classList.add('ring-2', 'ring-rose-gold/50');
    }

    if (!disabled) {
      btn.addEventListener('click', () => selectDate(key));
    }

    grid.appendChild(btn);
  }
}

function selectDate(key) {
  selectedDate = key;
  selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  $('slots-section').classList.remove('hidden');
  $('selected-date-label').textContent = formatDateLabel(key);
}

function renderTimeSlots() {
  const container = $('time-slots');
  const emptyMsg = $('slots-empty');
  container.innerHTML = '';

  if (!selectedDate) return;

  const d = parseDateKey(selectedDate);
  if (!isWorkingDay(d)) {
    emptyMsg.classList.remove('hidden');
    emptyMsg.textContent = 'Salão fechado neste dia. Escolha de terça a sábado.';
    return;
  }

  emptyMsg.classList.add('hidden');
  let hasAvailable = false;

  SLOT_TIMES.forEach((time) => {
    const booked = isBooked(selectedDate, time);
    const past = isPastTime(selectedDate, time);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = time;

    if (booked) {
      btn.className = 'py-3 rounded-2xl text-xs font-bold border-2 slot-booked';
      btn.disabled = true;
      btn.title = 'Horário reservado';
    } else if (past) {
      btn.className = 'py-3 rounded-2xl text-xs font-bold border-2 border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed';
      btn.disabled = true;
    } else {
      hasAvailable = true;
      const isSelected = selectedTime === time;
      btn.className = [
        'py-3 rounded-2xl text-xs font-bold border-2 transition-all slot-available',
        isSelected ? 'slot-selected' : 'border-slate-200 bg-white text-slate-700'
      ].join(' ');
      btn.addEventListener('click', () => openBookingModal(time));
    }

    container.appendChild(btn);
  });

  if (!hasAvailable) {
    emptyMsg.classList.remove('hidden');
    emptyMsg.textContent = 'Todos os horários deste dia estão reservados. Tente outra data.';
  }
}

function openBookingModal(time) {
  selectedTime = time;
  renderTimeSlots();
  $('modal-datetime').textContent = `${formatDateLabel(selectedDate)} às ${time}`;
  $('modal').classList.remove('hidden');
  $('modal').classList.add('flex');
  $('booking-form').reset();
}

function closeModal() {
  $('modal').classList.add('hidden');
  $('modal').classList.remove('flex');
  selectedTime = null;
  renderTimeSlots();
}

function showToast() {
  const toast = $('toast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

function init() {
  loadBookings();
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();

  $('btn-prev-month').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  $('btn-next-month').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  $('btn-cancel').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => {
    if (e.target === $('modal')) closeModal();
  });

  $('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    if (isBooked(selectedDate, selectedTime)) {
      alert('Este horário acabou de ser reservado. Escolha outro.');
      closeModal();
      renderTimeSlots();
      return;
    }

    const fd = new FormData(e.target);
    bookings.push({
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'b-' + Date.now(),
      date: selectedDate,
      time: selectedTime,
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      service: fd.get('service'),
      createdAt: new Date().toISOString()
    });
    saveBookings();
    closeModal();
    renderCalendar();
    renderTimeSlots();
    showToast();
  });

  renderCalendar();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  while (!isWorkingDay(tomorrow) || isPastDate(tomorrow)) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  if (!isPastDate(tomorrow)) {
    selectDate(dateKey(tomorrow));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
