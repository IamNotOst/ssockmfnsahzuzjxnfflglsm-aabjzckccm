document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('site_lang') || 'ru';
    let currentTheme = localStorage.getItem('site_theme') || 'dark';

    const langBtn = document.getElementById('langBtn');
    const langText = document.getElementById('langText');
    const themeBtn = document.getElementById('themeBtn');
    const emailBtn = document.getElementById('emailBtn');
    const emailText = document.getElementById('emailText').innerText;
    const tooltip = document.getElementById('tooltip');

    // 1. Инициализация Иконок Lucide
    const initIcons = () => { if (window.lucide) lucide.createIcons(); };

    // 2. Система Языков (i18n)
    const updateLanguage = (lang) => {
        document.querySelectorAll('.wrapper').forEach(el => el.classList.add('lang-changing'));

        setTimeout(() => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    element.innerHTML = translations[lang][key];
                }
            });

            langText.innerText = lang === 'ru' ? 'EN' : 'RU';
            document.getElementById('statusDot').title = translations[lang].statusBadge;
            initIcons();

            document.querySelectorAll('.wrapper').forEach(el => el.classList.remove('lang-changing'));
        }, 150);
    };

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('site_lang', currentLang);
        updateLanguage(currentLang);
    });

    // 3. Система Тем (Light/Dark)
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('site_theme', theme);
    };

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });

    // Первоначальная загрузка настроек
    setTheme(currentTheme);
    updateLanguage(currentLang);

    // 4. Копирование Email с фидбеком
    emailBtn.addEventListener('click', async (e) => {
        try {
            await navigator.clipboard.writeText(emailText);
            const originalText = translations[currentLang].tooltipCopy;
            
            tooltip.innerText = translations[currentLang].tooltipCopied;
            tooltip.style.color = '#22c55e';

            setTimeout(() => {
                tooltip.innerText = originalText;
                tooltip.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Ошибка:', err);
        }
    });

    // 5. Анимация нажатия (Ripple Effect) на кликабельных элементах
    document.querySelectorAll('.ripple-btn, .tool-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) ripple.remove();

            this.appendChild(circle);
        });
    });

    // 6. 3D Tilt эффект при наведении мыши на карточки
    if (window.innerWidth > 768) {
        document.querySelectorAll('.tilt-effect').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                card.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }
});

