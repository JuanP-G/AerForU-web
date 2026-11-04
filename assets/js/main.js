/**
 * AeRForU web. Un único módulo pequeño: tema, entrada animada, pestañas,
 * visor de imágenes, vídeo bajo demanda, botón de copiar y versión actual.
 */

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Tema claro / oscuro ---------- */
function currentTheme() {
    return root.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function initTheme() {
    const btn = $('#themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
    });
}

/* ---------- Cabecera con borde al hacer scroll ---------- */
function initHeader() {
    const header = $('#top');
    if (!header) return;
    const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Entrada al hacer scroll ---------- */
function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
}

/* ---------- Pestañas de "Cómo funciona" ---------- */
function initTabs() {
    const tabs = $$('[role="tab"]');
    if (!tabs.length) return;

    const select = (tab, focus) => {
        tabs.forEach((t) => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            if (!panel) return;
            panel.hidden = !on;
            panel.classList.toggle('show', on);
            if (on) panel.classList.add('in');
        });
        if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
            const key = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (key) {
                e.preventDefault();
                select(tabs[(i + key + tabs.length) % tabs.length], true);
            } else if (e.key === 'Home' || e.key === 'End') {
                e.preventDefault();
                select(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true);
            }
        });
    });
}

/* ---------- Visor de imágenes ---------- */
function initLightbox() {
    const box = $('#lightbox');
    const img = $('#lightboxImg');
    const close = $('#lightboxClose');
    if (!box || !img) return;

    let opener = null;
    const open = (src, alt, from) => {
        opener = from;
        img.src = src;
        img.alt = alt || 'Imagen ampliada';
        box.classList.add('open');
        document.body.classList.add('no-scroll');
        close.focus();
    };
    const hide = () => {
        box.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (opener) opener.focus();
    };

    $$('img.zoomable').forEach((el) => {
        el.addEventListener('click', () => open(el.currentSrc || el.src, el.alt, el));
    });
    close.addEventListener('click', hide);
    box.addEventListener('click', (e) => { if (e.target === box) hide(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && box.classList.contains('open')) hide();
    });
}

/* ---------- Vídeo: el iframe solo se crea al pulsar ---------- */
function initVideo() {
    const btn = $('#videoPlay');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.video}?autoplay=1&rel=0`;
        iframe.title = 'Demostración de AeRForU';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        // Un iframe no puede ir dentro de un button: se sustituye por un contenedor
        const wrapper = document.createElement('div');
        wrapper.className = 'video in';
        wrapper.appendChild(iframe);
        btn.replaceWith(wrapper);
        iframe.focus();
    }, { once: true });
}

/* ---------- Copiar al portapapeles ---------- */
function initCopy() {
    $$('[data-copy]').forEach((btn) => {
        const label = $('span', btn);
        const original = label.textContent;
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.classList.add('done');
                label.textContent = 'Copiado';
            } catch (e) {
                label.textContent = 'Copia manual';
            }
            setTimeout(() => {
                btn.classList.remove('done');
                label.textContent = original;
            }, 1800);
        });
    });
}

/* ---------- Versión actual de la extensión ---------- */
async function initVersion() {
    const targets = $$('[data-version]');
    if (!targets.length) return;
    try {
        const res = await fetch('https://raw.githubusercontent.com/Jaimepas77/AeRForU/main/manifest.json');
        if (!res.ok) return;
        const { version } = await res.json();
        if (/^\d+(\.\d+)*$/.test(version)) targets.forEach((el) => { el.textContent = version; });
    } catch (e) {
        /* se queda la versión escrita en el HTML */
    }
}

// initReveal va primero: si algo falla despues, el contenido sigue visible.
// Cada inicializador es independiente para que un error no arrastre a los demas.
[initReveal, initTheme, initHeader, initTabs, initLightbox, initVideo, initCopy, initVersion]
    .forEach((init) => {
        try { init(); } catch (e) { console.error(`${init.name}:`, e); }
    });
