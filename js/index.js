document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Simple i18n: EN <-> SV + localStorage ---------- */
    let currentLang = "en";
    let glitchDisabled = false; // después de cambiar idioma, desactivamos animación glitch

    function syncGlitchText(lang, fromToggle = false) {
        if (!fromToggle) return;

        const langAttr = lang === "sv" ? "svText" : "enText";
        glitchDisabled = true; // no volvemos a animar, mostramos estático

        document.querySelectorAll(".excel-word").forEach(word => {
            const newText = word.dataset[langAttr];
            if (newText === undefined) return;

            const real = word.querySelector(".real-text");
            const error = word.querySelector(".excel-error");

            if (real) {
                real.textContent = newText || "";
            }
            if (error) {
                error.classList.add("hidden");
                error.classList.remove("glitch");
            }
        });
    }

    function setLanguage(lang, options = {}) {
        const fromToggle = options.fromToggle || false;

        // Texto plano
        document.querySelectorAll("[data-en][data-sv]").forEach(el => {
            const value = el.dataset[lang];
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        // Contenido con HTML
        document.querySelectorAll("[data-en-html][data-sv-html]").forEach(el => {
            const key = lang + "Html";
            const value = el.dataset[key];
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        document.documentElement.lang = lang === "sv" ? "sv" : "en";
        currentLang = lang;

        // Sincronizar glitch (solo en cambios de idioma explícitos)
        syncGlitchText(lang, fromToggle);
    }

    const langBtn = document.getElementById("lang-toggle-btn");

    // Leer idioma guardado
    const savedLang = localStorage.getItem("auravid-lang");
    const initialLang = savedLang === "sv" ? "sv" : "en";
    setLanguage(initialLang, { fromToggle: false });

    // Ajustar texto inicial del botón
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

    /* ---------- GLITCH TITLE ---------- */

    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$/!?";

    function revealWord(wordEl, delay) {
        if (glitchDisabled) {
            const realTextEl = wordEl.querySelector(".real-text");
            const errorEl = wordEl.querySelector(".excel-error");
            const langAttr = currentLang === "sv" ? "svText" : "enText";
            const fullText = wordEl.dataset[langAttr] || "";

            if (realTextEl) realTextEl.textContent = fullText;
            if (errorEl) {
                errorEl.classList.add("hidden");
                errorEl.classList.remove("glitch");
            }
            return;
        }

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

                n++;

                if (n >= cycles) {
                    clearInterval(interval);
                    errorEl.classList.remove("glitch");
                    errorEl.classList.add("hidden");

                    letters.forEach((span, i) => {
                        setTimeout(() => {
                            span.textContent = span.dataset.finalChar;
                        }, i * 60);
                    });
                }
            }, 50);
        }, delay);
    }

    const problemSection = document.querySelector("#problem-section");

    if (problemSection) {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const words = e.target.querySelectorAll(".excel-word");
                        words.forEach((word, i) => {
                            revealWord(word, 700 + i * 480);
                        });
                    }
                });
            },
            { threshold: 0.4 }
        );
        obs.observe(problemSection);
    }

    /* ---------- MARKET LEADER PROGRESS BAR ON VIEW ---------- */

    const strategicSection = document.querySelector("#strategic-section");
    if (strategicSection) {
        const fill = strategicSection.querySelector(".progress-fill");

        const obs2 = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        fill.classList.add("progress-animate");
                        obs2.unobserve(strategicSection);
                    }
                });
            },
            { threshold: 0.4 }
        );

        obs2.observe(strategicSection);
    }

    /* ---------- PARALLAX HERO BLOB ---------- */

    const scrollContainer = document.querySelector(".snap-container");
    const heroBlob = document.querySelector(".hero-blob");

    if (scrollContainer && heroBlob) {
        scrollContainer.addEventListener("scroll", () => {
            const offset = scrollContainer.scrollTop || 0;
            heroBlob.style.setProperty("--parallax-offset", offset * 0.15 + "px");
        });
    }

});