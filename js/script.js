document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Lógica de Idiomas (i18n) ---------- */
    let currentLang = "en";
    let glitchDisabled = false; 

    function syncGlitchText(lang, fromToggle = false) {
        if (!fromToggle) return;
        const langAttr = lang === "sv" ? "svText" : "enText";
        glitchDisabled = true; 

        document.querySelectorAll(".excel-word").forEach(word => {
            const newText = word.dataset[langAttr];
            if (newText === undefined) return;
            const real = word.querySelector(".real-text");
            const error = word.querySelector(".excel-error");
            if (real) real.textContent = newText || "";
            if (error) {
                error.classList.add("hidden");
                error.classList.remove("glitch");
            }
        });
    }

    function setLanguage(lang, options = {}) {
        const fromToggle = options.fromToggle || false;

        // Traducción de texto simple
        document.querySelectorAll("[data-en][data-sv]").forEach(el => {
            const value = el.dataset[lang];
            if (value !== undefined) el.textContent = value;
        });

        // Traducción de bloques con HTML (gradientes, etc)
        document.querySelectorAll("[data-en-html][data-sv-html]").forEach(el => {
            const key = lang + "Html";
            const value = el.dataset[key];
            if (value !== undefined) el.innerHTML = value;
        });

        document.documentElement.lang = lang === "sv" ? "sv" : "en";
        currentLang = lang;
        syncGlitchText(lang, fromToggle);
    }

    const langBtn = document.getElementById("lang-toggle-btn");
    const savedLang = localStorage.getItem("auravid-lang");
    const initialLang = savedLang === "sv" ? "sv" : "en";
    
    setLanguage(initialLang, { fromToggle: false });

    if (langBtn) {
        langBtn.textContent = initialLang === "en" ? "SV" : "EN";
        langBtn.addEventListener("click", () => {
            if (currentLang === "en") {
                setLanguage("sv", { fromToggle: true });
                localStorage.setItem("auravid-lang", "sv");
                langBtn.textContent = "EN";
            } else {
                setLanguage("en", { fromToggle: true });
                localStorage.setItem("auravid-lang", "en");
                langBtn.textContent = "SV";
            }
        });
    }

    /* ---------- Efecto Glitch de Excel (Sección Problem) ---------- */
    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$/!?";

    function revealWord(wordEl, delay) {
        if (glitchDisabled) return;

        const errorEl = wordEl.querySelector(".excel-error");
        const realTextEl = wordEl.querySelector(".real-text");
        const langAttr = currentLang === "sv" ? "svText" : "enText";
        const fullText = wordEl.dataset[langAttr] || "";

        realTextEl.innerHTML = "";
        const letters = [];
        [...fullText].forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.dataset.finalChar = char;
            realTextEl.appendChild(span);
            letters.push(span);
        });

        setTimeout(() => {
            errorEl.classList.add("glitch");
            let cycles = 10;
            let n = 0;
            const interval = setInterval(() => {
                letters.forEach((span) => {
                    span.classList.add("visible");
                    span.textContent = randomChars[Math.floor(Math.random() * randomChars.length)];
                });
                if (++n >= cycles) {
                    clearInterval(interval);
                    errorEl.classList.remove("glitch");
                    errorEl.classList.add("hidden");
                    letters.forEach((span, i) => {
                        setTimeout(() => { span.textContent = span.dataset.finalChar; }, i * 60);
                    });
                }
            }, 50);
        }, delay);
    }

    /* ---------- Observadores de Intersección (Animaciones al hacer scroll) ---------- */
    const observerOptions = { threshold: 0.4 };

    // Glitch en sección Problema
    const problemSection = document.querySelector("#problem-section");
    if (problemSection) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll(".excel-word").forEach((word, i) => {
                        revealWord(word, 700 + i * 480);
                    });
                    obs.unobserve(e.target);
                }
            });
        }, observerOptions);
        obs.observe(problemSection);
    }

    // Barra de progreso en sección Estratégica
    const strategicSection = document.querySelector("#strategic-section");
    if (strategicSection) {
        const fill = strategicSection.querySelector(".progress-fill");
        const obs2 = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    fill.classList.add("progress-animate");
                    obs2.unobserve(strategicSection);
                }
            });
        }, observerOptions);
        obs2.observe(strategicSection);
    }

    /* ---------- Parallax del Hero Blob ---------- */
    const scrollContainer = document.querySelector(".snap-container");
    const heroBlob = document.querySelector(".hero-blob");

    if (scrollContainer && heroBlob) {
        scrollContainer.addEventListener("scroll", () => {
            const offset = scrollContainer.scrollTop || 0;
            heroBlob.style.setProperty("--parallax-offset", offset * 0.15 + "px");
        });
    }
});