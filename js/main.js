document.addEventListener('DOMContentLoaded', () => {
    console.log("Preloader inicializado");
    const preloader = document.getElementById('preloader');
    const curtainContainer = document.querySelector('.clouds-curtain-container');

    // Generar nubes
    function generateClouds(container) {
        for (let i = 0; i < 28; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'curtain-cloud';
            cloud.style.left = (Math.random() * 88) + '%';
            cloud.style.top = (Math.random() * 82) + '%';
            cloud.style.setProperty('--cloud-x', `${(Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 180)}px`);
            cloud.style.setProperty('--cloud-y', `${-20 - Math.random() * 80}px`);
            cloud.style.setProperty('--cloud-delay', `${Math.random() * 0.45}s`);
            const size = 210 + Math.random() * 190;
            cloud.style.width = size + 'px';
            cloud.style.height = (size * 0.6) + 'px';
            container.appendChild(cloud);
        }
    }

    if (curtainContainer) generateClouds(curtainContainer);

    document.querySelectorAll('.farm-prop, .space-prop').forEach((prop) => {
        prop.addEventListener('pointerdown', () => {
            prop.classList.remove('is-pressed');
            void prop.offsetWidth;
            prop.classList.add('is-pressed');
        });

        prop.addEventListener('animationend', (event) => {
            if (event.animationName === 'prop-press' || event.animationName === 'space-press') {
                prop.classList.remove('is-pressed');
            }
        });
    });

    const carousel = document.querySelector('[data-carousel]');
    const slides = carousel ? [...carousel.querySelectorAll('[data-slide]')] : [];
    const previousButton = carousel?.querySelector('[data-carousel-button="prev"]');
    const nextButton = carousel?.querySelector('[data-carousel-button="next"]');
    const carouselCaption = document.querySelector('.carousel-caption span:nth-child(2)');
    let currentSlide = 0;
    let touchStartX = null;

    const slideThemes = [
        {
            theme: 'ranch',
            caption: 'Texas Ranch'
        },
        {
            theme: 'space',
            caption: 'Space Explorers'
        },
        {
            theme: 'city',
            caption: 'Mini City'
        }
    ];

    function renderSlide(nextIndex) {
        if (!slides.length) return;

        currentSlide = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            slide.classList.toggle('current', index === currentSlide);
        });

        const content = slideThemes[currentSlide];
        document.body.setAttribute('data-theme', content.theme);

        if (carouselCaption) carouselCaption.textContent = content.caption;
    }

    function moveSlide(step) {
        renderSlide(currentSlide + step);
    }

    previousButton?.addEventListener('click', () => {
        moveSlide(-1);
    });
    nextButton?.addEventListener('click', () => {
        moveSlide(1);
    });

    carousel?.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) {
            touchStartX = null;
            return;
        }

        touchStartX = event.clientX;
    });

    carousel?.addEventListener('pointerup', (event) => {
        if (touchStartX === null) return;

        const distance = event.clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) < 45) return;
        moveSlide(distance < 0 ? 1 : -1);
    });

    carousel?.addEventListener('pointercancel', () => {
        touchStartX = null;
    });

    renderSlide(0);

    // Animación
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('open-curtain');
            setTimeout(() => preloader.classList.add('show-logo'), 700);
            setTimeout(() => preloader.classList.add('fade-out'), 3000);
            setTimeout(() => preloader.remove(), 4300);
        }, 500);
    });
});