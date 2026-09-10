(() => {
    "use strict";

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const state = {
        lang: localStorage.getItem("lang") || "ru",
        theme: localStorage.getItem("theme") || "dark",
        content: null
    };

    // ---------- Ripple ----------
    function attachRipple(el) {
        el.addEventListener("click", (e) => {
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement("span");
            ripple.className = "ripple";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = e.clientX - rect.left - size / 2 + "px";
            ripple.style.top = e.clientY - rect.top - size / 2 + "px";
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    }

    // ---------- Theme ----------
    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        const icon = $(".theme-icon");
        if (icon) {
            icon.style.transform = "rotate(360deg)";
            setTimeout(() => (icon.style.transform = ""), 600);
        }
    }

    // ---------- Language ----------
    async function loadContent() {
        try {
            const res = await fetch("content.json");
            if (!res.ok) throw new Error("content.json not found");
            state.content = await res.json();
        } catch (err) {
            console.warn("Falling back to inline content:", err);
            state.content = window.__FALLBACK__ || {};
        }
    }

    function render() {
        const data = state.content[state.lang];
        if (!data) return;

        const stage = $("#stage");
        stage.style.opacity = "0";
        stage.style.transform = "translateY(12px)";

        setTimeout(() => {
            stage.innerHTML = `
                <section class="hero">
                    <span class="greet">${data.hero.greet} 🙂</span>
                    <h1>${data.hero.name} <span class="accent">${data.hero.nameAccent}</span>,</h1>
                    <p class="alias">${data.hero.alias} <a href="https://yandex.ru/search/?text=кто+такой+IamNotOst" target="_blank" rel="noopener">${data.hero.aliasList}</a>.</p>
                </section>
                ${data.sections.map((s, i) => `
                    <section class="section" style="animation-delay: ${0.1 + i * 0.12}s">
                        <header class="section-header">
                            <span class="icon">${s.icon}</span>
                            <h2>${s.title}</h2>
                        </header>
                        <ul class="section-list">
                            ${s.items.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </section>
                `).join("")}
            `;

            // collapse toggle
            $$(".section-header").forEach(header => {
                header.addEventListener("click", () => {
                    header.parentElement.classList.toggle("collapsed");
                });
            });

            stage.style.transition = "opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)";
            requestAnimationFrame(() => {
                stage.style.opacity = "1";
                stage.style.transform = "translateY(0)";
            });
        }, 120);

        // Update button label & document title
        $("[data-i18n='langLabel']").textContent = data.langLabel;
        $("[data-i18n='footer']").textContent = data.footer;
        document.documentElement.lang = state.lang;
    }

    function setLang(lang) {
        state.lang = lang;
        localStorage.setItem("lang", lang);
        render();
    }

    // ---------- Clock ----------
    function startClock() {
        const el = $("#clock");
        const tick = () => {
            const d = new Date();
            const pad = n => String(n).padStart(2, "0");
            el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };
        tick();
        setInterval(tick, 1000);
    }

    // ---------- Init ----------
    async function init() {
        await loadContent();
        applyTheme(state.theme);

        const themeBtn = $("#themeToggle");
        const langBtn = $("#langToggle");
        attachRipple(themeBtn);
        attachRipple(langBtn);

        themeBtn.addEventListener("click", () => {
            applyTheme(state.theme === "dark" ? "light" : "dark");
        });

        langBtn.addEventListener("click", () => {
            setLang(state.lang === "ru" ? "en" : "ru");
        });

        render();
        startClock();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
