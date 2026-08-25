document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
        const slides = Array.from(carousel.querySelectorAll(".detail-slide"));
        const previousButton = carousel.querySelector(".previous");
        const nextButton = carousel.querySelector(".next");
        const dotsContainer = carousel.querySelector(".carousel-dots");
        let currentIndex = 0;

        if (!slides.length) return;

        const showSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === currentIndex);
            });
            dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
                dot.classList.toggle("is-active", dotIndex === currentIndex);
                dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
            });
        };

        slides.forEach((slide, slideIndex) => {
            const dot = document.createElement("button");
            dot.className = "carousel-dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Ver foto ${slideIndex + 1}`);
            dot.addEventListener("click", () => showSlide(slideIndex));
            dotsContainer.appendChild(dot);
        });

        const hasMultipleSlides = slides.length > 1;
        previousButton.hidden = !hasMultipleSlides;
        nextButton.hidden = !hasMultipleSlides;
        previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
        nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
        showSlide(0);
    });
});
