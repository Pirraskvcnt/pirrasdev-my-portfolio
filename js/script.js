
const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;

// Alterna entre os temas
themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);

    // Atualiza o estado do botão
    themeToggle.setAttribute(
        "aria-pressed",
        newTheme === "dark" ? "true" : "false"
    );
});

/* =========================================
   HEADER - SEÇÃO ATIVA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(
        ".main-nav a[href^='#']"
    );

    const sections = Array.from(navLinks)
        .map(link => {
            return document.querySelector(
                link.getAttribute("href")
            );
        })
        .filter(Boolean);

    if (!("IntersectionObserver" in window)) {
        return;
    }

    function setActiveLink(sectionId) {

        navLinks.forEach(link => {

            const isActive =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }

        });
    }

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });

    // Atualiza o destaque imediatamente ao clicar
    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const sectionId = link
                .getAttribute("href")
                .replace("#", "");

            setActiveLink(sectionId);

        });

    });

});


/* =========================================
   ABOUT - CARDS EXPANSÍVEIS
========================================= */

(() => {

    function initAboutCards() {

        const cards = document.querySelectorAll(".about-info-card");

        if (!cards.length) return;

        cards.forEach(card => {

            const trigger = card.querySelector(".about-card-trigger");
            const details = card.querySelector(".about-card-details");

            if (!trigger || !details) return;

            trigger.addEventListener("click", () => {

                const alreadyOpen =
                    trigger.getAttribute("aria-expanded") === "true";

                // Fecha todos os cards
                cards.forEach(otherCard => {

                    const otherTrigger =
                        otherCard.querySelector(".about-card-trigger");

                    const otherDetails =
                        otherCard.querySelector(".about-card-details");

                    otherCard.classList.remove("is-open");
                    otherTrigger.setAttribute("aria-expanded", "false");
                    otherDetails.hidden = true;

                });

                // Abre o card clicado, caso estivesse fechado
                if (!alreadyOpen) {

                    card.classList.add("is-open");
                    trigger.setAttribute("aria-expanded", "true");
                    details.hidden = false;

                }

            });

        });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAboutCards);
    } else {
        initAboutCards();
    }

})();
