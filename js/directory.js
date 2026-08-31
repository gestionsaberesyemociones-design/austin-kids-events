/* ==========================================================================
   AUSTIN KIDS EVENTS - INTERACCIONES DEL DIRECTORIO (DIRECTORY.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. FILTRADO INTERACTIVO DE PERSONAJES (THEME FILTER)
    const filterButtons = document.querySelectorAll('[data-world-filter]');
    const worldCards = document.querySelectorAll('.world-card');

    if (filterButtons.length > 0 && worldCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTheme = button.getAttribute('data-world-filter');
                
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filtrar tarjetas
                worldCards.forEach(card => {
                    if (targetTheme === 'all' || card.classList.contains(`world-${targetTheme}`)) {
                        card.style.display = 'block';
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
                showToast(`Copied "${textToCopy}" to clipboard! ✨`);
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

