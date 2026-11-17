document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Atualizar o ano atual no Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Lógica de Alternância de Tema (Dark / Light) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Verificar se já existe um tema salvo no LocalStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeButtonIcon(savedTheme);
    } else {
        // Padrão inicial é dark
        updateThemeButtonIcon('dark');
    }

    // Evento de clique no botão de tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Aplicar o novo tema no atributo data-theme da tag <html>
            htmlElement.setAttribute('data-theme', newTheme);
            
            // Salvar a preferência no navegador
            localStorage.setItem('theme', newTheme);

            // Atualizar o ícone do botão
            updateThemeButtonIcon(newTheme);
        });
    }

    function updateThemeButtonIcon(theme) {
        if (themeToggleBtn) {
            // Se o tema for dark, mostra a lua (🌙) para indicar que se clicar vai pro light, e vice-versa.
            // Ou o inverso: ícone representa o tema ATUAL ou o PRÓXIMO. Vamos usar o padrão: 
            // Modo Dark ativo -> mostra ☀️ (para mudar para light). Modo Light ativo -> mostra 🌙 (para mudar para dark).
            themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
});