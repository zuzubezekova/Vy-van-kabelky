/* =============================================
   VK Studio — script.js
   Interaktivita pre stránku Vyšívané kabelky
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. DARK MODE
  ----------------------------------------------- */
  const darkBtn = document.getElementById('dark-mode-btn');
  const body = document.body;

  // Načítaj uloženú preferenciu
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkBtn.textContent = '☀️ Svetlý režim';
  }

  darkBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    darkBtn.textContent = isDark ? '☀️ Svetlý režim' : '🌙 Tmavý režim';
    localStorage.setItem('darkMode', isDark);
  });


  /* -----------------------------------------------
     2. ŽIVÉ VYHĽADÁVANIE V KOLEKCII
  ----------------------------------------------- */
  const vyhladavanie = document.getElementById('vyhladavanie');
  const polozky = document.querySelectorAll('.ponuka-polozka:not(#nenaslo-sa)');
  const nenasloSa = document.getElementById('nenaslo-sa');
  const pocetVysledkov = document.getElementById('pocet-vysledkov');

  if (vyhladavanie) {
    vyhladavanie.addEventListener('input', () => {
      const query = vyhladavanie.value.toLowerCase().trim();
      let viditelnych = 0;

      polozky.forEach(polozka => {
        const text = polozka.textContent.toLowerCase();
        const zodpoveda = query === '' || text.includes(query);
        polozka.style.display = zodpoveda ? '' : 'none';
        if (zodpoveda) viditelnych++;
      });

      nenasloSa.style.display = viditelnych === 0 ? '' : 'none';

      if (query === '') {
        pocetVysledkov.textContent = '';
      } else {
        pocetVysledkov.textContent = `Nájdené: ${viditelnych} ${viditelnych === 1 ? 'kúsok' : viditelnych < 5 ? 'kúsky' : 'kúskov'}`;
      }
    });
  }


  /* -----------------------------------------------
     3. POČÍTADLO ZNAKOV V TEXTARE
  ----------------------------------------------- */
  const sprava = document.getElementById('sprava');
  const pocitadlo = document.getElementById('pocitadlo-znakov');

  if (sprava && pocitadlo) {
    sprava.addEventListener('input', () => {
      const zostatku = parseInt(sprava.getAttribute('maxlength')) - sprava.value.length;
      pocitadlo.textContent = zostatku;
      pocitadlo.style.color = zostatku < 20 ? '#a0522d' : '';
    });
  }


  /* -----------------------------------------------
     4. PODMIENENÁ SEKCIA (detaily rezervácie sa vždy zobrazujú)
     — sekcia_rezervacie je tu vždy viditeľná, pretože
       ide o formulár na mieru
  ----------------------------------------------- */
  // Sekcia je predvolene viditeľná – nič netreba meniť.


  /* -----------------------------------------------
     5. VALIDÁCIA FORMULÁRA
  ----------------------------------------------- */
  const formular = document.getElementById('kontaktny-formular');
  const spravaOdoslana = document.getElementById('sprava-odoslana');

  if (formular) {
    formular.addEventListener('submit', (e) => {
      e.preventDefault();
      let platny = true;

      // Vyčisti predchádzajúce chyby
      formular.querySelectorAll('.custom-input, .form-check-input').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
      });

      // Validuj meno
      const meno = document.getElementById('meno');
      if (!meno.value.trim() || meno.value.trim().length < 2) {
        meno.classList.add('is-invalid');
        platny = false;
      } else {
        meno.classList.add('is-valid');
      }

      // Validuj email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        platny = false;
      } else {
        email.classList.add('is-valid');
      }

      // Validuj telefón (nepovinný, ale ak je vyplnený)
      const telefon = document.getElementById('telefon');
      if (telefon && telefon.value.trim()) {
        const telRegex = /^[0-9]{9,10}$/;
        if (!telRegex.test(telefon.value.trim())) {
          telefon.classList.add('is-invalid');
          platny = false;
        } else {
          telefon.classList.add('is-valid');
        }
      }

      // Validuj správu/popis
      const spravaField = document.getElementById('sprava');
      if (!spravaField.value.trim() || spravaField.value.trim().length < 10) {
        spravaField.classList.add('is-invalid');
        platny = false;
      } else {
        spravaField.classList.add('is-valid');
      }

      // Validuj súhlas
      const suhlas = document.getElementById('suhlas');
      if (!suhlas.checked) {
        suhlas.classList.add('is-invalid');
        platny = false;
      } else {
        suhlas.classList.add('is-valid');
      }

      if (platny) {
        // Simulácia odoslania
        formular.style.opacity = '0.5';
        formular.style.pointerEvents = 'none';
        setTimeout(() => {
          formular.style.opacity = '';
          formular.style.pointerEvents = '';
          spravaOdoslana.style.display = 'block';
          formular.reset();
          // Obnoviť počítadlo znakov
          if (pocitadlo) pocitadlo.textContent = '200';
          // Odscrollovať k správe
          spravaOdoslana.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Skryť po 5 sekundách
          setTimeout(() => { spravaOdoslana.style.display = 'none'; }, 5000);
          // Vyčisti validačné triedy
          formular.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
          });
        }, 800);
      } else {
        // Odscrolluj k prvej chybe
        const prvaChyba = formular.querySelector('.is-invalid');
        if (prvaChyba) {
          prvaChyba.scrollIntoView({ behavior: 'smooth', block: 'center' });
          prvaChyba.focus();
        }
      }
    });

    // Live validácia pri strate fokusu
    formular.querySelectorAll('.custom-input').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value.trim()) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }


  /* -----------------------------------------------
     6. SCROLL ANIMÁCIE — sekcie sa objavujú pri scrollovaní
  ----------------------------------------------- */
  const fadeSections = document.querySelectorAll('.section-fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay pre každú sekciu
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  fadeSections.forEach(section => observer.observe(section));


  /* -----------------------------------------------
     7. AKTÍVNY NAV-LINK PRI SCROLLOVANÍ
  ----------------------------------------------- */
  const navLinks = document.querySelectorAll('#hlavna-nav .nav-link');
  const sekcie = document.querySelectorAll('main section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sekcie.forEach(s => navObserver.observe(s));

});
