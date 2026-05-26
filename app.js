// HabitTrack — Daily Habit Tracker
const today = new Date().toISOString().split('T')[0];
let habits = JSON.parse(localStorage.getItem('habits') || '[]');

function save() { localStorage.setItem('habits', JSON.stringify(habits)); }

function render() {
    document.getElementById('today-date').textContent = new Date().toLocaleDateString('en',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

    document.getElementById('habits').innerHTML = habits.map((h, i) => {
        const isDone = h.log.includes(today);
        const streak = getStreak(h.log);
        return `<div class="habit ${isDone ? 'done' : ''}" data-i="${i}" onclick="if(!event.target.closest('.habit-check,button')) showHistory(${i})">
            <div class="habit-check" onclick="event.stopImmediatePropagation();toggleHabit(${i})">${isDone ? '✓' : ''}</div>
            <span class="habit-icon">${h.icon}</span>
            <div class="habit-info"><div class="habit-name">${esc(h.name)}</div><div class="habit-streak">🔥 ${streak} day streak · ${h.log.length} total</div></div>
            <button class="habit-del" onclick="event.stopImmediatePropagation();delHabit(${i})">✕</button>
        </div>`;
    }).join('');

    const done = habits.filter(h => h.log.includes(today)).length;
    document.getElementById('today-done').textContent = done;
    document.getElementById('today-total').textContent = habits.length;
    document.getElementById('pct').textContent = habits.length ? Math.round(done / habits.length * 100) + '%' : '0%';
}

function getStreak(log) {
    let streak = 0;
    const d = new Date();
    while (true) {
        const key = d.toISOString().split('T')[0];
        if (log.includes(key)) { streak++; d.setDate(d.getDate() - 1); }
        else break;
    }
    return streak;
}

function addHabit() {
    const name = document.getElementById('habit-input').value.trim();
    if (!name) return;
    const icon = document.getElementById('habit-icon').value;
    habits.push({name, icon, log: []});
    document.getElementById('habit-input').value = '';
    save(); render();
}

function toggleHabit(i) {
    const idx = habits[i].log.indexOf(today);
    if (idx >= 0) habits[i].log.splice(idx, 1);
    else habits[i].log.push(today);
    save(); render();
}

function delHabit(i) { habits.splice(i, 1); save(); render(); }
function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

// ===== Calendar Heatmap Feature =====

function getLongestStreak(log) {
    if (!log || log.length === 0) return 0;
    const sorted = [...log].sort();
    let max = 1, cur = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i-1]);
        const curr = new Date(sorted[i]);
        const diff = Math.round((curr - prev) / 86400000);
        if (diff === 1) { cur++; max = Math.max(max, cur); }
        else { cur = 1; }
    }
    return max;
}

function getRecentDates(daysBack = 180) {
    const dates = [];
    const d = new Date();
    for (let i = 0; i < daysBack; i++) {
        dates.unshift(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() - 1);
    }
    return dates;
}

let currentHabitIndex = null;

function showHistory(i) {
    currentHabitIndex = i;
    const h = habits[i];
    if (!h) return;

    document.getElementById('modal-icon').textContent = h.icon;
    document.getElementById('modal-name').textContent = h.name;
    document.getElementById('modal-current').textContent = getStreak(h.log);
    document.getElementById('modal-longest').textContent = getLongestStreak(h.log);
    document.getElementById('modal-total').textContent = h.log.length;

    renderHeatmap(h.log, document.getElementById('heatmap'), i);

    const modal = document.getElementById('history-modal');
    modal.classList.remove('hidden');
    document.addEventListener('keydown', handleModalKey, { once: true });
}

function closeHistory() {
    document.getElementById('history-modal').classList.add('hidden');
    currentHabitIndex = null;
    render(); // refresh main list in case days were toggled
}

function handleModalKey(e) {
    if (e.key === 'Escape') closeHistory();
}

function renderHeatmap(log, container, habitIndex) {
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.gap = '3px';
    container.style.overflowX = 'auto';

    const dates = getRecentDates(182);

    // Align start to Sunday
    const firstDate = new Date(dates[0]);
    const startPadding = firstDate.getDay(); // 0=Sun

    const paddedDates = [...Array(startPadding).fill(null), ...dates];

    // Build week columns
    for (let i = 0; i < paddedDates.length; i += 7) {
        const weekDates = paddedDates.slice(i, i + 7);
        const col = document.createElement('div');
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        col.style.gap = '3px';

        weekDates.forEach(dateStr => {
            const cell = document.createElement('div');
            cell.className = 'day';

            if (!dateStr) {
                cell.classList.add('empty');
                cell.style.visibility = 'hidden';
            } else {
                const done = log.includes(dateStr);
                if (done) cell.classList.add('level-4');
                else cell.style.background = 'var(--bg2)';

                cell.title = `${dateStr} — ${done ? 'Done' : 'Missed'}`;
                cell.onclick = (e) => {
                    e.stopImmediatePropagation();
                    toggleDateForHabit(habitIndex, dateStr);
                    const h = habits[habitIndex];
                    document.getElementById('modal-current').textContent = getStreak(h.log);
                    document.getElementById('modal-longest').textContent = getLongestStreak(h.log);
                    document.getElementById('modal-total').textContent = h.log.length;
                    renderHeatmap(h.log, container, habitIndex);
                };
            }
            col.appendChild(cell);
        });
        container.appendChild(col);
    }
}

function toggleDateForHabit(i, dateStr) {
    const log = habits[i].log;
    const idx = log.indexOf(dateStr);
    if (idx >= 0) log.splice(idx, 1);
    else log.push(dateStr);
    // keep log sorted for nicer streak math
    habits[i].log.sort();
    save();
}

document.addEventListener('DOMContentLoaded', render);
