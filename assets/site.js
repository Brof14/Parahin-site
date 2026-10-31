"use strict";

const SUPPORTED_LANGUAGES = new Set(["en", "ru"]);

function storedLanguage() {
    try {
        const value = localStorage.getItem("lang");
        return SUPPORTED_LANGUAGES.has(value) ? value : "en";
    } catch {
        return "en";
    }
}

function persistLanguage(lang) {
    try {
        localStorage.setItem("lang", lang);
    } catch {
        // A privacy setting must not prevent language switching.
    }
}

// Page-owned translations permit only bold markup, never arbitrary HTML.
function renderTranslation(element, source) {
    const fragment = document.createDocumentFragment();
    const pattern = /<b>(.*?)<\/b>/gs;
    let cursor = 0;
    for (const match of source.matchAll(pattern)) {
        fragment.append(document.createTextNode(source.slice(cursor, match.index)));
        const strong = document.createElement("strong");
        strong.textContent = match[1];
        fragment.append(strong);
        cursor = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(source.slice(cursor)));
    element.replaceChildren(fragment);
}

function setLanguage(value) {
    const lang = SUPPORTED_LANGUAGES.has(value) ? value : "en";
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en][data-ru]").forEach((element) => {
        renderTranslation(element, element.dataset[lang]);
    });

    document.querySelectorAll(".lang-btn").forEach((button) => {
        const active = button.dataset.lang === lang;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-label-en][data-label-ru]").forEach((element) => {
        const label = lang === "ru" ? element.dataset.labelRu : element.dataset.labelEn;
        element.setAttribute("aria-label", label);
    });

    const title = lang === "ru" ? document.body.dataset.titleRu : document.body.dataset.titleEn;
    if (title) document.title = title;
    persistLanguage(lang);
}

function initLanguages() {
    setLanguage(storedLanguage());
    document.querySelectorAll(".lang-btn").forEach((button) => {
        button.addEventListener("click", () => setLanguage(button.dataset.lang));
    });
}

function initClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Barnaul",
        hour: "2-digit",
        minute: "2-digit",
    });
    const update = () => { clock.textContent = formatter.format(new Date()); };
    update();
    window.setInterval(() => {
        if (!document.hidden) update();
    }, 60_000);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) update();
    });
    window.addEventListener("pageshow", update);
}

function initSpotlight() {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let scheduled = false;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    window.addEventListener("pointermove", (event) => {
        x = event.clientX;
        y = event.clientY;
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
            document.documentElement.style.setProperty("--x", x + "px");
            document.documentElement.style.setProperty("--y", y + "px");
            scheduled = false;
        });
    }, { passive: true });
    document.addEventListener("mouseleave", () => {
        document.documentElement.style.setProperty("--x", "50%");
        document.documentElement.style.setProperty("--y", "50%");
    });
}

initLanguages();
initClock();
initSpotlight();
