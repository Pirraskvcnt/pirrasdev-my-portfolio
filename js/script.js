
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
