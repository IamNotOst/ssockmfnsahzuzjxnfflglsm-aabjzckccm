document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('site_lang') || 'ru';
    let currentTheme = localStorage.getItem('site_theme') || 'dark';

    const langBtn = document.getElementById('langBtn');
    const langText = document.getElementById('langText');
    const themeBtn = document.getElementById('themeBtn');
    const emailBtn = document.getElementById('emailBtn');
    const emailText = document.getElementById('emailText').innerText;
    const tooltip = document.getElementById('tooltip');

    const initIcons = () => { if (window.lucide) lucide.createIcons(); };

    // 1. Смена языков
    const updateLanguage = (lang) => {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
                element.classList.add('text-swap');
                setTimeout(() => element.classList.remove('text-swap'), 200);
            }
        });

        langText.innerText = lang === 'ru' ? 'EN' : 'RU';
        initIcons();
    };

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('site_lang', currentLang);
        updateLanguage(currentLang);
    });

    // 2. Смена темы
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('site_theme', theme);
    };

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });

    // Загрузка стартовых настроек
    setTheme(currentTheme);
    updateLanguage(currentLang);

    // 3. Копирование почты
    emailBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(emailText);
            const originalText = translations[currentLang].tooltipCopy;

            tooltip.innerText = translations[currentLang].tooltipCopied;
            tooltip.style.color = '#22c55e';
            tooltip.style.borderColor = '#22c55e';

            setTimeout(() => {
                tooltip.innerText = originalText;
                tooltip.style.color = '';
                tooltip.style.borderColor = '';
            }, 1800);
        } catch (err) {
            console.error(err);
        }
    });

    // 4. Отслеживание курсора для отклика рамок (Glow tracking)
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
