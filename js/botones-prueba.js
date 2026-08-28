/* ==========================================
    LÓGICA: INTERACCIÓN POR HOVER Y TOUCH
    ========================================== */

function initializeRentalCards() {
    const cards = document.querySelectorAll('[data-rental-card]');
    let activeSound = null;
    let lastSoundTouch = 0;
    let navigationTimer = null;

    cards.forEach(card => {
        const button = card.querySelector('.rental-cta');
        const soundFile = button?.getAttribute('data-sound');
        const buttonSound = soundFile ? new Audio(soundFile) : null;

        const activateCard = () => {
            card.classList.add('is-active');
        };

        const playButtonSound = () => {
            if (!buttonSound) return;
            const now = Date.now();
            if (now - lastSoundTouch < 350) return;
            lastSoundTouch = now;
            if (activeSound && activeSound !== buttonSound) {
                activeSound.pause();
                activeSound.currentTime = 0;
            }
            activeSound = buttonSound;
            buttonSound.currentTime = 0;
            buttonSound.play().catch(() => {});
        };

        card.addEventListener('mouseenter', activateCard);

        card.addEventListener('pointerdown', () => {
            cards.forEach((otherCard) => {
                if (otherCard !== card) otherCard.classList.remove('is-active');
            });
            activateCard();
        });

        card.addEventListener('click', (event) => {
            if (event.target.closest('.rental-cta')) return;
            cards.forEach((otherCard) => {
                if (otherCard !== card) otherCard.classList.remove('is-active');
            });
            activateCard();
        });

        button?.addEventListener('click', (event) => {
            event.preventDefault();
            playButtonSound();

            if (navigationTimer) return;
            navigationTimer = window.setTimeout(() => {
                window.location.href = button.href;
            }, 700);
        });

    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRentalCards);
} else {
    initializeRentalCards();
}