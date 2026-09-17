/* ==========================================================================
   AUSTIN KIDS EVENTS - INTERACCIONES DEL DIRECTORIO (DIRECTORY.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FILTRADO INTERACTIVO DE MUNDOS (THEME FILTER)
    const filterButtons = document.querySelectorAll('[data-world-filter]');
    const worldCards = document.querySelectorAll('.world-showcase-card');

    if (filterButtons.length > 0 && worldCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTheme = button.getAttribute('data-world-filter');
                
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filtrar tarjetas
                worldCards.forEach(card => {
                    const cardTheme = card.getAttribute('data-theme');
                    if (targetTheme === 'all' || cardTheme === targetTheme) {
                        card.style.display = 'grid';
                        card.style.animation = 'fadeInUp 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. FUNCIÓN COPIAR AL PORTAPAPELES (Para Teléfono y Email)
    const copyTriggers = document.querySelectorAll('[data-copy-text]');
    
    copyTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Si el usuario hace clic en el botón de copiar específico
            const textToCopy = trigger.getAttribute('data-copy-text');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const currentLang = document.body.dataset.lang || 'es';
                const message = currentLang === 'es'
                    ? `¡"${textToCopy}" copiado al portapapeles! ✨`
                    : `Copied "${textToCopy}" to clipboard! ✨`;
                showToast(message);
            }).catch(err => {
                console.error('Error copying text:', err);
            });
        });
    });

    // 3. TOAST NOTIFICATION LÚDICO
    function showToast(message) {
        let toast = document.getElementById('dir-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'dir-toast';
            toast.className = 'dir-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 4. ANIMACIÓN AL HACER CLIC EN LAS ILUSTRACIONES (BOUNCE INTERACTIVO)
    const artFigures = document.querySelectorAll('.art-figure');
    artFigures.forEach(fig => {
        fig.addEventListener('click', () => {
            fig.classList.remove('is-bopped');
            void fig.offsetWidth; // Reflow
            fig.classList.add('is-bopped');
        });
    });
});

