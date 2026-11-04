/* Se ejecuta antes del primer pintado para aplicar el tema guardado sin destello. */
(function () {
    var d = document.documentElement;
    d.classList.add('js');
    try {
        var t = localStorage.getItem('theme');
        if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
    } catch (e) { /* almacenamiento no disponible */ }
})();
