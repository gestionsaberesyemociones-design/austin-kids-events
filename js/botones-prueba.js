/* ==========================================
    LÓGICA: INTERACCIÓN POR HOVER Y TOUCH
    ========================================== */

function initializeRentalCards() {
    const cards = document.querySelectorAll('[data-rental-card]');
    let activeSound = null;
    let lastSoundTouch = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const minimumTouchDuration = 180;
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
            touchStartX = event.clientX;
            touchStartY = event.clientY;
            touchStartTime = Date.now();
            playSoundFromButton(button);
        });

        button?.addEventListener('pointerup', (event) => {
            if (!isTouchDevice) return;
            event.preventDefault();
            event.stopPropagation();

            const movedDistance = Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY);
            const touchDuration = Date.now() - touchStartTime;
            if (movedDistance > 12) return;

            const responseDelay = Math.max(0, minimumTouchDuration - touchDuration);
            setTimeout(() => navigateToDestination(button), responseDelay);
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

function initializeSoundButtons() {
    document.querySelectorAll('[data-sound]').forEach((button) => {
        const playSound = () => {
            const sound = new Audio(button.getAttribute('data-sound'));
            sound.play().catch(() => {});
        };

        button.addEventListener('mouseenter', playSound);
        button.addEventListener('focus', playSound);
        button.addEventListener('click', playSound);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRentalCards);
    document.addEventListener('DOMContentLoaded', initializeSoundButtons);
} else {
    initializeRentalCards();
    initializeSoundButtons();
}