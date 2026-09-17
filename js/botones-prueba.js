/* ==========================================
    LÓGICA: INTERACCIÓN POR HOVER Y TOUCH
    ========================================== */

function initializeRentalCards() {
    const cards = document.querySelectorAll('[data-rental-card]');
    let activeSound = null;
    let lastSoundTouch = 0;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

    const playSoundFromButton = (button) => {
        const soundFile = button?.getAttribute('data-sound');
        if (!soundFile) return false;

        const buttonSound = new Audio(soundFile);
        const now = Date.now();

        if (now - lastSoundTouch < 350) return false;
        lastSoundTouch = now;

        if (activeSound && activeSound !== buttonSound) {
            activeSound.pause();
            activeSound.currentTime = 0;
        }

        activeSound = buttonSound;
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
        return true;
    };

    const navigateToDestination = (button) => {
        const destination = button?.getAttribute('data-page');
        if (!destination) return;

        setTimeout(() => {
            window.location.href = destination;
        }, isTouchDevice ? 450 : 150);
    };

    cards.forEach(card => {
        const button = card.closest('.service-card')?.querySelector('.service-feature-button');

        const activateCard = () => {
            card.closest('.service-card')?.classList.add('is-active');
        };

        card.addEventListener('mouseenter', activateCard);

        card.addEventListener('pointerdown', () => {
            cards.forEach((otherCard) => {
                const otherCardWrapper = otherCard.closest('.service-card');
                if (otherCard !== card && otherCardWrapper) otherCardWrapper.classList.remove('is-active');
            });
            activateCard();
        });

        card.addEventListener('click', (event) => {
            if (event.target.closest('.service-feature-button')) return;
            cards.forEach((otherCard) => {
                const otherCardWrapper = otherCard.closest('.service-card');
                if (otherCard !== card && otherCardWrapper) otherCardWrapper.classList.remove('is-active');
            });
            activateCard();
        });

        if (!isTouchDevice) {
            button?.addEventListener('mouseenter', () => playSoundFromButton(button));
            button?.addEventListener('focus', () => playSoundFromButton(button));
        }

        button?.addEventListener('pointerdown', (event) => {
            if (!isTouchDevice) return;
            event.preventDefault();
            event.stopPropagation();
            playSoundFromButton(button);
            navigateToDestination(button);
        });

        button?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!isTouchDevice) {
                playSoundFromButton(button);
                navigateToDestination(button);
                return;
            }

            playSoundFromButton(button);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRentalCards);
} else {
    initializeRentalCards();
}