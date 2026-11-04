# AeRForU Website

Sitio web de **AeRForU**, extensión para [Acepta el Reto](https://aceptaelreto.com).

Web publicada: [aerforu.netlify.app](https://aerforu.netlify.app/) · Extensión: [Jaimepas77/AeRForU](https://github.com/Jaimepas77/AeRForU)

## Tecnología

HTML, CSS y JavaScript estáticos, sin paso de compilación ni dependencias.

- Tipografías Source Sans 3 y Source Serif 4 alojadas en `assets/fonts` (licencia OFL).
- Iconos en SVG incrustado (estilo Lucide, licencia ISC).
- Tema claro y oscuro con preferencia guardada en `localStorage`.

## Estructura

```
index.html            Página única con todo el contenido
assets/css/styles.css Estilos, tokens de color en :root
assets/js/main.js     Tema, animaciones de entrada, pestañas, visor, vídeo
assets/fonts/         Fuentes woff2 (latin)
assets/images/        Logo, iconos, imágenes sociales y capturas (showcase/)
_headers              Cabeceras y CSP para Netlify
robots.txt, sitemap.xml
```

## Desarrollo local

```bash
python -m http.server 8123
```

Abre `http://localhost:8123`.

## Despliegue

Netlify sirve la raíz del repositorio tal cual. La política CSP está en `_headers`; si se añade un recurso externo (fuentes, scripts, iframes), hay que permitir su origen allí.
