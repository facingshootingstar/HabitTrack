// HabitTrack — Daily Habit Tracker
const today = new Date().toISOString().split('T')[0];
let habits = JSON.parse(localStorage.getItem('habits') || '[]');

function save() { localStorage.setItem('habits', JSON.stringify(habits)); }

function render() {
    document.getElementById('today-date').textContent = new Date().toLocaleDateString('en',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

    document.getElementById('habits').innerHTML = habits.map((h, i) => {
        const isDone = h.log.includes(today);
        const streak = getStreak(h.log);
        return `<div class="habit ${isDone ? 'done' : ''}" data-i="${i}">
            <div class="habit-check" onclick="toggleHabit(${i})">${isDone ? '✓' : ''}</div>
            <span class="habit-icon">${h.icon}</span>
            <div class="habit-info"><div class="habit-name">${esc(h.name)}</div><div class="habit-streak">🔥 ${streak} day streak · ${h.log.length} total</div></div>
            <button class="habit-del" onclick="delHabit(${i})">✕</button>
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

document.addEventListener('DOMContentLoaded', render);
