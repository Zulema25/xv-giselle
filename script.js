const target = new Date('2026-12-05T16:00:00-06:00').getTime();

function tick() {
    const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const values = {
        days: Math.floor(remaining / 86400),
        hours: Math.floor(remaining / 3600) % 24,
        minutes: Math.floor(remaining / 60) % 60,
        seconds: remaining % 60
    };
    for (const [id, value] of Object.entries(values)) document.getElementById(id).textContent = String(value).padStart(2, '0');
    if (!remaining) document.getElementById('count-message').textContent = '¡Llegó el gran día!';
}

tick();
setInterval(tick, 1000);
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('pending');
            observer.unobserve(entry.target);
        }
    }), {threshold: .08});
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('pending');
        observer.observe(el);
    });
}
const dialog = document.getElementById('lightbox');
for (const number of [3, 5, 4, 1, 2, 7, 9, 8]) {
    const button = document.createElement('button');
    const img = document.createElement('img');
    img.src = `assets/foto-${number}.jpg`;
    img.alt = 'Katherine Giselle en su sesión de XV años';
    img.loading = 'lazy';
    button.append(img);
    button.addEventListener('click', () => {
        document.getElementById('full').src = img.src;
        dialog.showModal();
    });
    document.getElementById('gallery').append(button);
}
document.getElementById('close').onclick = () => dialog.close();
dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
});
document.getElementById('calendar').onclick = () => {
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitacion Katherine//ES', 'BEGIN:VEVENT', 'UID:katherine-xv-20261205@invitacion', 'DTSTAMP:20261119T000000Z', 'DTSTART:20261205T220000Z', 'SUMMARY:XV años de Katherine Giselle', 'LOCATION:Iglesia San Francisco de Asís - Tihuatlán', 'DESCRIPTION:Misa 4 pm. Recepción 6 pm en Domo de Buena Vista.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([content], {type: 'text/calendar;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'XV-Katherine.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const progress = document.getElementById('music-progress');
const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
const updateMusicButton = () => {
    const playing = !music.paused;
    musicToggle.textContent = playing ? 'Ⅱ Pausar música' : '♫ Reproducir música';
    musicToggle.setAttribute('aria-label', playing ? 'Pausar música de fondo' : 'Reproducir música de fondo');
    musicToggle.setAttribute('aria-pressed', String(playing));
};
const startMusic = (withSound = false) => {
    if (withSound) music.muted = false;
    music.play().then(updateMusicButton).catch(() => {});
};
music.addEventListener('loadedmetadata', () => {
    progress.max = 100;
});
music.addEventListener('timeupdate', () => {
    if (!music.duration) return;
    progress.value = (music.currentTime / music.duration) * 100;
    progress.title = `${formatTime(music.currentTime)} / ${formatTime(music.duration)}`;
});
progress.addEventListener('input', () => {
    if (music.duration) music.currentTime = (progress.value / 100) * music.duration;
});
musicToggle.onclick = () => {
    if (music.paused) startMusic(true);
    else {
        music.pause();
        updateMusicButton();
    }
};
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
startMusic();
const activateMusic = event => {
    if (event.target.closest('#music-toggle')) return;
    music.muted = false;
    startMusic(true);
};
['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, activateMusic, {once: true, passive: true});
});
