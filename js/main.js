document.addEventListener('DOMContentLoaded', () => {
    console.log("Preloader inicializado");
    const preloader = document.getElementById('preloader');
    const leftContainer = document.getElementById('curtain-left');
    const rightContainer = document.getElementById('curtain-right');

    // Generar nubes
    function generateClouds(container) {
        for (let i = 0; i < 20; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'curtain-cloud';
            cloud.style.left = (Math.random() * 80) + '%';
            cloud.style.top = (Math.random() * 90) + '%';
            const size = 200 + Math.random() * 150;
            cloud.style.width = size + 'px';
            cloud.style.height = (size * 0.6) + 'px';
            container.appendChild(cloud);
        }
    }

    generateClouds(leftContainer);
    generateClouds(rightContainer);

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
    const heroKicker = document.querySelector('.hero-kicker');
    const heroTitle = document.querySelector('.hero-copy h1');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const carouselCaption = document.querySelector('.carousel-caption span:nth-child(2)');
    let currentSlide = 0;
    let touchStartX = null;

    const slideThemes = [
        {
            theme: 'ranch',
            kicker: 'AUSTIN KIDS EVENTS',
            title: 'Create magical memories',
            subtitle: 'Unforgettable parties and events for kids in Austin',
            caption: 'Certified play areas for celebrating big'
        },
        {
            theme: 'space',
            kicker: 'SPACE EXPLORERS',
            title: 'Explore new galaxies',
            subtitle: 'A space mission filled with play and discovery',
            caption: 'Blast off into a celebration out of this world'
        },
        {
            theme: 'city',
            kicker: 'MINI CITY',
            title: 'Make every adventure count',
            subtitle: 'A little city made for big imaginations',
            caption: 'Drive, discover and create your own story'
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

        if (heroKicker) heroKicker.textContent = content.kicker;
        if (heroTitle) heroTitle.textContent = content.title;
        if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
        if (carouselCaption) carouselCaption.textContent = content.caption;
    }

    function moveSlide(step) {
        renderSlide(currentSlide + step);
    }

    previousButton?.addEventListener('click', () => moveSlide(-1));
    nextButton?.addEventListener('click', () => moveSlide(1));

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
            preloader.classList.add('show-logo');
            setTimeout(() => preloader.classList.add('fade-out'), 2000);
            setTimeout(() => preloader.remove(), 3500);
        }, 500);
    });
});