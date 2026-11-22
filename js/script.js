
/* =========================================
   PIRRASDEV - SCRIPT PRINCIPAL
   Tema, idiomas, navegação e interações.
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;
    const dictionaries = window.PIRRAS_TRANSLATIONS;

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    /* =====================================
       1. TEMA DARK / LIGHT
    ===================================== */

    const themeToggle = document.querySelector(".theme-toggle");

    function setTheme(theme) {

        const selectedTheme = theme === "light" ? "light" : "dark";

        html.setAttribute("data-theme", selectedTheme);

        if (themeToggle) {

            themeToggle.setAttribute(
                "aria-pressed",
                String(selectedTheme === "dark")
            );

            const language = html.lang === "en" ? "en" : "pt";

            const label = dictionaries?.[language]?.["theme.label"] ||
                "Alternar tema claro ou escuro";

            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
        }

        try {
            localStorage.setItem("pirrasdev-theme", selectedTheme);
        } catch (error) {
            console.warn("Não foi possível salvar a preferência de tema.", error);
        }
    }

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const currentTheme = html.getAttribute("data-theme");

            setTheme(currentTheme === "dark" ? "light" : "dark");

        });

    }

    // Recupera o tema salvo
    try {

        const savedTheme = localStorage.getItem("pirrasdev-theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        } else {
            setTheme(html.dataset.theme || "dark");
        }

    } catch (error) {

        setTheme(html.dataset.theme || "dark");

    }


    /* =====================================
       2. SISTEMA DE IDIOMAS
    ===================================== */

    const languageMenu = document.querySelector("#language-menu");
    const languageTrigger = document.querySelector("#language-trigger");
    const languageDropdown = document.querySelector("#language-options");

    const languageButtons = languageMenu
        ? languageMenu.querySelectorAll("[data-language]")
        : [];

    const currentFlag = languageMenu?.querySelector(".language-flag");
    const currentCode = languageMenu?.querySelector(".language-code");

    const languageSettings = {

        pt: {
            flag: "🇧🇷",
            htmlLang: "pt-BR",
            label: "Selecionar idioma"
        },

        en: {
            flag: "🇺🇸",
            htmlLang: "en",
            label: "Select language"
        }

    };

    // Abre e fecha o menu de idiomas
    function setLanguageMenuOpen(open) {

        if (!languageMenu || !languageTrigger || !languageDropdown) {
            return;
        }

        languageDropdown.hidden = !open;

        languageMenu.classList.toggle("is-open", open);

        languageTrigger.setAttribute(
            "aria-expanded",
            String(open)
        );

    }

    // Aplica as traduções na página
    function applyLanguage(language) {

        if (!dictionaries || !dictionaries[language]) {

            console.error(
                `Dicionário do idioma "${language}" não foi carregado.`
            );

            return;
        }

        const dictionary = dictionaries[language];
        const settings = languageSettings[language];

        // Traduz textos identificados com data-i18n
        document.querySelectorAll("[data-i18n]").forEach(element => {

            const key = element.dataset.i18n;

            if (Object.prototype.hasOwnProperty.call(dictionary, key)) {

                element.textContent = dictionary[key];

            } else {

                console.warn(`Tradução não encontrada: ${key}`);

            }

        });

        // Traduz aria-label
        document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {

            const key = element.dataset.i18nAriaLabel;

            if (dictionary[key] !== undefined) {

                element.setAttribute("aria-label", dictionary[key]);

            }

        });

        // Traduz title
        document.querySelectorAll("[data-i18n-title]").forEach(element => {

            const key = element.dataset.i18nTitle;

            if (dictionary[key] !== undefined) {

                element.setAttribute("title", dictionary[key]);

            }

        });

        // Traduz alt das imagens
        document.querySelectorAll("[data-i18n-alt]").forEach(element => {

            const key = element.dataset.i18nAlt;

            if (dictionary[key] !== undefined) {

                element.setAttribute("alt", dictionary[key]);

            }

        });

        // Atualiza idioma do documento
        html.lang = settings.htmlLang;

        // Atualiza título da aba
        document.title = dictionary["site.title"] || document.title;

        // Atualiza descrição do site
        const descriptionMeta = document.querySelector(
            'meta[name="description"]'
        );

        if (descriptionMeta && dictionary["site.description"]) {

            descriptionMeta.setAttribute(
                "content",
                dictionary["site.description"]
            );

        }

        // Atualiza bandeira e sigla do idioma
        if (currentFlag) {
            currentFlag.textContent = settings.flag;
        }

        if (currentCode) {
            currentCode.textContent = settings.code;
        }

        if (languageTrigger) {

            languageTrigger.setAttribute(
                "aria-label",
                settings.label
            );

        }

        // Atualiza a opção selecionada
        languageButtons.forEach(button => {

            const selected = button.dataset.language === language;

            button.classList.toggle("is-selected", selected);

            button.setAttribute(
                "aria-pressed",
                String(selected)
            );

        });

        // Atualiza acessibilidade do botão de tema
        if (themeToggle && dictionary["theme.label"]) {

            themeToggle.setAttribute(
                "aria-label",
                dictionary["theme.label"]
            );

            themeToggle.setAttribute(
                "title",
                dictionary["theme.label"]
            );

        }

        // Atualiza acessibilidade do menu mobile
        if (menuToggle) {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            const menuKey = isOpen ? "menu.close" : "menu.open";

            if (dictionary[menuKey]) {

                menuToggle.setAttribute(
                    "aria-label",
                    dictionary[menuKey]
                );

            }

        }

        // Salva idioma escolhido
        try {

            localStorage.setItem("pirrasdev-language", language);

        } catch (error) {

            console.warn("Não foi possível salvar o idioma.", error);

        }

    }

    // Eventos do seletor de idioma
    if (languageMenu && languageTrigger && languageDropdown) {

        // Abrir e fechar
        languageTrigger.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const isOpen =
                languageTrigger.getAttribute("aria-expanded") === "true";

            setLanguageMenuOpen(!isOpen);

        });

        // Escolher idioma
        languageButtons.forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();
                event.stopPropagation();

                const language = button.dataset.language;

                if (languageSettings[language]) {

                    applyLanguage(language);

                }

                setLanguageMenuOpen(false);

            });

        });

        // Fechar ao clicar fora
        document.addEventListener("click", event => {

            if (!languageMenu.contains(event.target)) {

                setLanguageMenuOpen(false);

            }

        });

        // Fechar com Escape
        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                languageTrigger.getAttribute("aria-expanded") === "true"
            ) {

                setLanguageMenuOpen(false);

                languageTrigger.focus({
                    preventScroll: true
                });

            }

        });

    }

    // Recuperar idioma salvo
    let initialLanguage = "pt";

    try {

        const savedLanguage = localStorage.getItem("pirrasdev-language");

        if (savedLanguage === "pt" || savedLanguage === "en") {

            initialLanguage = savedLanguage;

        }

    } catch (error) {

        console.warn("Não foi possível recuperar o idioma salvo.", error);

    }

    if (dictionaries) {

        applyLanguage(initialLanguage);

    } else {

        console.error(
            "translations.js não foi carregado. Confira a ordem dos scripts no HTML."
        );

    }

    setLanguageMenuOpen(false);


    /* =====================================
       3. HEADER - SEÇÃO ATIVA
    ===================================== */

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

    function setActiveLink(sectionId) {

        navLinks.forEach(link => {

            const active =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("is-active", active);

            if (active) {

                link.setAttribute("aria-current", "page");

            } else {

                link.removeAttribute("aria-current");

            }

        });

    }

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
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

            sectionObserver.observe(section);

        });

    }

    // Atualiza o destaque ao clicar na navegação
    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const sectionId = link
                .getAttribute("href")
                .slice(1);

            setActiveLink(sectionId);

        });

    });


    /* =====================================
       4. ABOUT - CARDS EXPANSÍVEIS
    ===================================== */

    const aboutCards = document.querySelectorAll(
        ".about-info-card"
    );

    aboutCards.forEach(card => {

        const trigger = card.querySelector(
            ".about-card-trigger"
        );

        const details = card.querySelector(
            ".about-card-details"
        );

        if (!trigger || !details) {
            return;
        }

        trigger.addEventListener("click", () => {

            const wasOpen =
                trigger.getAttribute("aria-expanded") === "true";

            // Fecha todos os cards
            aboutCards.forEach(otherCard => {

                const otherTrigger = otherCard.querySelector(
                    ".about-card-trigger"
                );

                const otherDetails = otherCard.querySelector(
                    ".about-card-details"
                );

                if (!otherTrigger || !otherDetails) {
                    return;
                }

                otherCard.classList.remove("is-open");

                otherTrigger.setAttribute(
                    "aria-expanded",
                    "false"
                );

                otherDetails.hidden = true;

            });

            // Abre o card clicado, caso estivesse fechado
            if (!wasOpen) {

                card.classList.add("is-open");

                trigger.setAttribute(
                    "aria-expanded",
                    "true"
                );

                details.hidden = false;

            }

        });

    });


    /* =====================================
       5. MENU MOBILE
    ===================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const willOpen =
                menuToggle.getAttribute("aria-expanded") !== "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(willOpen)
            );

            mainNav.classList.toggle(
                "is-open",
                willOpen
            );

            const language = html.lang === "en" ? "en" : "pt";

            const key = willOpen ? "menu.close" : "menu.open";

            const label = dictionaries?.[language]?.[key];

            if (label) {

                menuToggle.setAttribute(
                    "aria-label",
                    label
                );

            }

        });

        // Fecha o menu ao selecionar uma seção
        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const language = html.lang === "en" ? "en" : "pt";

                const label =
                    dictionaries?.[language]?.["menu.open"];

                if (label) {

                    menuToggle.setAttribute(
                        "aria-label",
                        label
                    );

                }

            });

        });

        // Fecha o menu com Escape
        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                mainNav.classList.contains("is-open")
            ) {

                mainNav.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.focus({
                    preventScroll: true
                });

            }

        });

    }


    /* =====================================
       6. ANO AUTOMÁTICO DO FOOTER
    ===================================== */

    const currentYear = document.querySelector(
        "#current-year"
    );

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }

});
