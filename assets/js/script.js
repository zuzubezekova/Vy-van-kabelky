/* =============================================
   VK Studio — script.js
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------------------------
       1. DARK MODE
    ----------------------------------------------- */
    const darkBtn = document.getElementById("dark-mode-btn");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "true") {
        body.classList.add("dark-mode");
        if (darkBtn) darkBtn.textContent = "☀️ Svetlý režim";
    }

    if (darkBtn) {
        darkBtn.addEventListener("click", () => {
            body.classList.toggle("dark-mode");

            const isDark = body.classList.contains("dark-mode");
            darkBtn.textContent = isDark ? "☀️ Svetlý režim" : "🌙 Tmavý režim";

            localStorage.setItem("darkMode", isDark);
        });
    }

    /* -----------------------------------------------
       2. POČÍTADLO ZNAKOV V TEXTAREA
    ----------------------------------------------- */
    const sprava = document.getElementById("sprava");
    const pocitadlo = document.getElementById("pocitadlo-znakov");

    if (sprava && pocitadlo) {
        sprava.addEventListener("input", () => {
            const max = parseInt(sprava.getAttribute("maxlength"));
            const zostava = max - sprava.value.length;
            pocitadlo.textContent = zostava;
        });
    }

    /* -----------------------------------------------
       3. VALIDÁCIA FORMULÁRA + TOAST
    ----------------------------------------------- */
    const form = document.getElementById("kontakt-formular");
    const toastEl = document.getElementById("kontaktToast");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let valid = true;

            form.querySelectorAll(".custom-input, .form-check-input").forEach((el) => {
                el.classList.remove("is-invalid", "is-valid");
            });

            const meno = document.getElementById("meno");
            const email = document.getElementById("email");
            const telefon = document.getElementById("telefon");
            const typ = document.getElementById("typ");
            const suhlas = document.getElementById("suhlas");

            if (!meno.value.trim() || meno.value.trim().length < 2) {
                meno.classList.add("is-invalid");
                valid = false;
            } else {
                meno.classList.add("is-valid");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.classList.add("is-invalid");
                valid = false;
            } else {
                email.classList.add("is-valid");
            }

            if (telefon.value.trim()) {
                const telRegex = /^[0-9]{9,10}$/;
                if (!telRegex.test(telefon.value.trim())) {
                    telefon.classList.add("is-invalid");
                    valid = false;
                } else {
                    telefon.classList.add("is-valid");
                }
            }

            if (!typ.value) {
                typ.classList.add("is-invalid");
                valid = false;

                // RADIO VALIDÁCIA (kontaktSpôsob)
                const kontaktRadios = document.querySelectorAll('input[name="kontaktSpôsob"]');
                const selectedKontakt = document.querySelector('input[name="kontaktSpôsob"]:checked');

                // nájdi aktívny input podľa výberu
                let kontaktInput = null;

                if (selectedKontakt) {
                    if (selectedKontakt.value === "email") {
                        kontaktInput = document.querySelector("#box-email input");
                    }
                    if (selectedKontakt.value === "telefon") {
                        kontaktInput = document.querySelector("#box-telefon input");
                    }
                    if (selectedKontakt.value === "instagram") {
                        kontaktInput = document.querySelector("#box-instagram input");
                    }
                }

                // validácia aktívneho inputu
                if (!kontaktInput || !kontaktInput.value.trim()) {
                    kontaktInput.classList.add("is-invalid");
                    valid = false;
                } else {
                    kontaktInput.classList.add("is-valid");
                }
            } else {
                typ.classList.add("is-valid");
            }

            if (!sprava.value.trim() || sprava.value.trim().length < 10) {
                sprava.classList.add("is-invalid");
                valid = false;
            } else {
                sprava.classList.add("is-valid");
            }

            if (!suhlas.checked) {
                suhlas.classList.add("is-invalid");
                valid = false;
            } else {
                suhlas.classList.add("is-valid");
            }

            if (valid) {
                form.reset();
                if (pocitadlo) pocitadlo.textContent = "200";

                form.querySelectorAll(".is-valid").forEach((el) => {
                    el.classList.remove("is-valid");
                });

                if (toastEl) {
                    const toast = new bootstrap.Toast(toastEl);
                    toast.show();
                }
            }
        });
    }

    /* -----------------------------------------------
       4. SCROLL FADE ANIMÁCIA
    ----------------------------------------------- */
    const fadeSections = document.querySelectorAll(".section-fade");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    fadeSections.forEach((section) => observer.observe(section));

    /* -----------------------------------------------
          5. FORMULÁR VYBER TYPU KONTAKTU
      ----------------------------------------------- */

    // všetky radio buttony
    const radios = document.querySelectorAll('input[name="kontaktSpôsob"]');

    // mapovanie input boxov
    const boxes = {
        email: document.querySelector('#box-email input'),
        telefon: document.querySelector('#box-telefon input'),
        instagram: document.querySelector('#box-instagram input')
    };

    // funkcia na reset required
    function clearRequired() {
        Object.values(boxes).forEach(input => {
            input.required = false; // všetky vypne povinnosť
        });
    }

    // zobrazenie + required logika
    function showBox(value) {
        // skry všetky boxy
        document.querySelectorAll('#box-email, #box-telefon, #box-instagram')
            .forEach(box => box.style.display = 'none');

        // zruš required všade
        clearRequired();

        // zobraz správny box
        const box = document.getElementById('box-' + value);
        if (box) {
            box.style.display = 'block';

            // nastav required len na aktívny input
            const input = box.querySelector('input');
            if (input) {
                input.required = true;
            }
        }
    }

    // listener na zmenu rádia
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            showBox(e.target.value);
        });
    });

    // init po načítaní
    const checked = document.querySelector('input[name="kontaktSpôsob"]:checked');
    if (checked) {
        showBox(checked.value);
    }

});