document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("servicesMain");

    const themes = [
        { id: "ranch" },
        { id: "space" },
        { id: "city" }
    ];

    let currentIndex = 0;

    function rotateTheme() {
        currentIndex = (currentIndex + 1) % themes.length;
        const currentTheme = themes[currentIndex];

        mainContainer.setAttribute("data-theme", currentTheme.id);

    }

    setInterval(rotateTheme, 6000);
});