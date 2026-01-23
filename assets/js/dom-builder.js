/**
 * Constructor de elementos DOM dinámicos - OPTIMIZADO
 * Con soporte para responsive images (srcset)
 */

export const DOMBuilder = {
    /**
     * Crea una tarjeta de funcionalidad
     * @param {Object} feature - Datos de la funcionalidad
     * @returns {HTMLElement}
     */
    createFeatureCard(feature) {
        const article = document.createElement('article');
        article.className = 'feature-card fade-in';
        
        article.innerHTML = `
            <div class="feature-icon">${feature.icon}</div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
        
        return article;
    },

    /**
     * Crea una tarjeta de captura de pantalla O video
     * @param {Object} screenshot - Datos de la captura o video
     * @returns {HTMLElement}
     */
    createScreenshotCard(screenshot) {
        const article = document.createElement('article');
        article.className = 'screenshot-card fade-in';
        
        if (screenshot.type === 'video') {
            // Card especial para video de YouTube
            article.innerHTML = `
                <div class="screenshot-wrapper video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${screenshot.videoId}" 
                        title="${screenshot.alt}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen
                        loading="lazy"
                        class="youtube-video">
                    </iframe>
                </div>
                <div class="screenshot-caption">
                    <h3>${screenshot.icon} ${screenshot.title}</h3>
                    <p>${screenshot.description}</p>
                </div>
            `;
        } else {
            // Card normal de imagen
            const imagePath = screenshot.image;
            const imageExt = imagePath.split('.').pop();
            const imageBase = imagePath.replace(`.${imageExt}`, '');
            
            article.innerHTML = `
                <div class="screenshot-wrapper">
                    <picture>
                        <source 
                            media="(max-width: 480px)" 
                            srcset="${imageBase}-400w.${imageExt}"
                            type="image/${imageExt}">
                        
                        <source 
                            media="(max-width: 768px)" 
                            srcset="${imageBase}-768w.${imageExt}"
                            type="image/${imageExt}">
                        
                        <img 
                            src="${imagePath}" 
                            alt="${screenshot.alt}" 
                            class="screenshot-img"
                            loading="lazy"
                            width="1200"
                            height="675"
                            decoding="async">
                    </picture>
                    <div class="screenshot-overlay"></div>
                </div>
                <div class="screenshot-caption">
                    <h3>${screenshot.icon} ${screenshot.title}</h3>
                    <p>${screenshot.description}</p>
                </div>
            `;
        }
        
        return article;
    },

    /**
     * FALLBACK: Crea screenshot card sin versiones responsivas
     * Usar si no tienes las imágenes redimensionadas
     */
    createScreenshotCardSimple(screenshot) {
        const article = document.createElement('article');
        article.className = 'screenshot-card fade-in';
        
        article.innerHTML = `
            <div class="screenshot-wrapper">
                <img 
                    src="${screenshot.image}" 
                    alt="${screenshot.alt}" 
                    class="screenshot-img"
                    loading="lazy"
                    width="1200"
                    height="675"
                    decoding="async">
                <div class="screenshot-overlay"></div>
            </div>
            <div class="screenshot-caption">
                <h3>${screenshot.icon} ${screenshot.title}</h3>
                <p>${screenshot.description}</p>
            </div>
        `;
        
        return article;
    },

    /**
     * Crea un paso de instalación
     * @param {Object} step - Datos del paso
     * @returns {HTMLElement}
     */
    createInstallationStep(step) {
        const article = document.createElement('article');
        article.className = 'step fade-in';
        
        // Crear header
        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <span class="step-number">${step.number}</span>
            <h3>${step.title}</h3>
        `;
        
        // Crear párrafo de descripción
        const description = document.createElement('p');
        
        // Si no hay código, usar innerHTML directamente
        if (!step.code) {
            description.innerHTML = step.description;
        } else {
            // Si hay código, añadirlo después
            description.innerHTML = step.description;
            const code = document.createElement('code');
            code.textContent = step.code;
            description.appendChild(document.createTextNode(' '));
            description.appendChild(code);
        }
        
        // Añadir elementos al article
        article.appendChild(header);
        article.appendChild(description);
        
        // Añadir enlace si existe
        if (step.link) {
            const linkPara = document.createElement('p');
            linkPara.innerHTML = `<a href="${step.link.url}" target="_blank" rel="noopener" style="${step.link.style || ''}">${step.link.text}</a>`;
            article.appendChild(linkPara);
        }
        
        return article;
    },

    /**
     * Renderiza funcionalidades en contenedores separados por categoría
     * @param {Array} features - Array de funcionalidades
     */
    renderFeatures(features) {
        const trainingContainer = document.getElementById('features-grid-training');
        const productivityContainer = document.getElementById('features-grid-productivity');
        
        if (!trainingContainer || !productivityContainer) {
            console.warn('Feature containers not found');
            return;
        }

        trainingContainer.innerHTML = '';
        productivityContainer.innerHTML = '';
        
        const sortedFeatures = features.sort((a, b) => a.order - b.order);
        
        // Separar por categoría
        const trainingFeatures = sortedFeatures.filter(f => f.category === 'training');
        const productivityFeatures = sortedFeatures.filter(f => f.category === 'productivity');
        
        // Renderizar entrenamiento
        trainingFeatures.forEach(feature => {
            const card = this.createFeatureCard(feature);
            trainingContainer.appendChild(card);
        });
        
        // Renderizar productividad
        productivityFeatures.forEach(feature => {
            const card = this.createFeatureCard(feature);
            productivityContainer.appendChild(card);
        });
        
        console.log(`✅ ${trainingFeatures.length} training features + ${productivityFeatures.length} productivity features rendered`);
    },

    /**
     * Renderiza capturas en el contenedor - OPTIMIZADO
     * @param {Array} screenshots - Array de capturas
     * @param {String} containerId - ID del contenedor
     * @param {Boolean} useResponsive - Usar imágenes responsivas (requiere versiones redimensionadas)
     */
    renderScreenshots(screenshots, containerId = 'screenshots-gallery', useResponsive = false) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = '';
        const sortedScreenshots = screenshots.sort((a, b) => a.order - b.order);

        // Decidir qué método usar
        const createMethod = useResponsive ? 
            this.createScreenshotCard.bind(this) : 
            this.createScreenshotCardSimple.bind(this);

        // Renderizar en chunks para no bloquear
        const chunkSize = 2;
        let index = 0;

        const renderChunk = () => {
            const chunk = sortedScreenshots.slice(index, index + chunkSize);
            
            chunk.forEach(screenshot => {
                const card = createMethod(screenshot);
                container.appendChild(card);
            });

            index += chunkSize;

            if (index < sortedScreenshots.length) {
                requestAnimationFrame(renderChunk);
            } else {
                console.log(`✅ ${sortedScreenshots.length} screenshots rendered (responsive: ${useResponsive})`);
            }
        };

        renderChunk();
    },

    /**
     * Renderiza pasos de instalación en el contenedor
     * @param {Array} steps - Array de pasos
     * @param {String} containerId - ID del contenedor
     */
    renderInstallationSteps(steps, containerId = 'installation-steps') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = '';
        const sortedSteps = steps.sort((a, b) => a.number - b.number);

        // Renderizar todos de una vez (son pocos)
        sortedSteps.forEach(step => {
            const stepElement = this.createInstallationStep(step);
            container.appendChild(stepElement);
        });

        console.log(`✅ ${sortedSteps.length} installation steps rendered`);
    },

    /**
     * UTILIDAD: Verifica si existen las versiones redimensionadas de una imagen
     * @param {String} imagePath - Ruta de la imagen
     * @returns {Promise<Boolean>}
     */
    async checkResponsiveVersionsExist(imagePath) {
        const imageExt = imagePath.split('.').pop();
        const imageBase = imagePath.replace(`.${imageExt}`, '');
        
        const versions = [
            `${imageBase}-400w.${imageExt}`,
            `${imageBase}-768w.${imageExt}`
        ];

        try {
            const checks = await Promise.all(
                versions.map(url => 
                    fetch(url, { method: 'HEAD' })
                        .then(res => res.ok)
                        .catch(() => false)
                )
            );
            
            return checks.every(exists => exists);
        } catch (error) {
            return false;
        }
    },

    /**
     * Renderiza screenshots detectando automáticamente si usar responsive
     * @param {Array} screenshots - Array de capturas
     * @param {String} containerId - ID del contenedor
     */
    async renderScreenshotsAuto(screenshots, containerId = 'screenshots-gallery') {
        if (screenshots.length === 0) {
            console.warn('No screenshots to render');
            return;
        }

        // Verificar si existe la primera versión responsive
        const firstImage = screenshots[0].image;
        const hasResponsive = await this.checkResponsiveVersionsExist(firstImage);

        console.log(`📸 Responsive images ${hasResponsive ? 'FOUND' : 'NOT FOUND'} - using ${hasResponsive ? 'responsive' : 'simple'} mode`);

        // Renderizar con el modo apropiado
        this.renderScreenshots(screenshots, containerId, hasResponsive);
    }
};