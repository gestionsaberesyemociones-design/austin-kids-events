/* ==========================================
    LÓGICA: INTERACCIÓN POR HOVER Y TOUCH
    ========================================== */

function initializeRentalCards() {
    const cards = document.querySelectorAll('[data-rental-card]');
    let activeSound = null;

    cards.forEach(card => {
        const button = card.querySelector('.rental-cta');
        const soundFile = button?.getAttribute('data-sound');
        const buttonSound = soundFile ? new Audio(soundFile) : null;

        const activateCard = () => {
            card.classList.add('is-active');

            if (buttonSound) {
                if (activeSound && activeSound !== buttonSound) {
                    activeSound.pause();
                    activeSound.currentTime = 0;
                }

                activeSound = buttonSound;
                buttonSound.currentTime = 0;
                buttonSound.play().catch(() => {});
            }
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
            if (!card.classList.contains('is-active')) {
                event.preventDefault();
                activateCard();
            }
        });

    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRentalCards);
} else {
    initializeRentalCards();
}