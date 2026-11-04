/**
 * Corn Grits – Nature's Goodness in Every Granule
 * Master JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initContactModal();
  initBackToTop();
  initSmoothScroll();
  initCornBounce();
  initBrandShowcaseModal();
  initScrollReveal();
  initGradeTabs();
  initRecipeCommunity();
});

/* 1. Header Scroll */
function initHeaderScroll() {
  const header = document.querySelector('.header-wrap');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. Mobile Drawer Navigation */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!toggle || !drawer || !backdrop) return;

  const closeBtn = drawer.querySelector('.mobile-drawer-close');

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    setOpen(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setOpen(false));
  }

  backdrop.addEventListener('click', () => setOpen(false));

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

/* 3. Contact Us Modal */
function initContactModal() {
  const modal = document.querySelector('#contactModal');
  const triggers = document.querySelectorAll('[data-open-modal="contact"]');
  const closeBtn = document.querySelector('#closeContactModal');
  const brandModal = document.querySelector('#brandShowcaseModal');
  if (!modal) return;

  const openModal = (sourceBtn) => {
    // If brand showcase modal is active, close it immediately so the inquiry form opens cleanly in front
    if (brandModal && brandModal.classList.contains('is-active')) {
      brandModal.classList.remove('is-active');
    }

    // Pre-fill & contextualize if opened from an application brand modal
    const brandTitleEl = brandModal ? brandModal.querySelector('#brandModalTitle') : null;
    const productSelect = modal.querySelector('#contactProduct');
    const messageField = modal.querySelector('#contactMessage');
    const modalSubtitle = modal.querySelector('#modalSubtitle') || modal.querySelector('p');

    if (sourceBtn && sourceBtn.closest('#brandShowcaseModal') && brandTitleEl) {
      const activeAppTitle = brandTitleEl.textContent.trim();
      if (modalSubtitle) {
        modalSubtitle.textContent = `Commercial Inquiry for: ${activeAppTitle}`;
      }
      if (productSelect) {
        const lower = activeAppTitle.toLowerCase();
        if (lower.includes('pizza')) {
          productSelect.value = 'Corn Grits 108 (Medium Granulation)';
        } else if (lower.includes('bakery') || lower.includes('fast food')) {
          productSelect.value = 'Corn Grits 108 (Medium Granulation)';
        } else if (lower.includes('polenta')) {
          productSelect.value = 'Corn Meal';
        } else if (lower.includes('snacks')) {
          productSelect.value = 'Corn Grits 101 (Coarse / Flaking)';
        } else if (lower.includes('breakfast')) {
          productSelect.value = 'Corn Grits 101 (Coarse / Flaking)';
        }
      }
      if (messageField && !messageField.value) {
        messageField.placeholder = `Requirements for ${activeAppTitle} (target monthly MT, delivery destination, packaging)...`;
      }
    } else if (sourceBtn && sourceBtn.hasAttribute('data-product')) {
      const prodName = sourceBtn.getAttribute('data-product');
      if (modalSubtitle) {
        modalSubtitle.textContent = `Technical Supply Inquiry: ${prodName}`;
      }
      if (productSelect) {
        const code = prodName.toLowerCase();
        for (let opt of productSelect.options) {
          const optLower = opt.value.toLowerCase();
          if ((code.includes('101a') && optLower.includes('101a')) ||
              (code.includes('101') && !code.includes('101a') && optLower.includes('101')) ||
              (code.includes('108') && optLower.includes('108')) ||
              (code.includes('112') && optLower.includes('112'))) {
            productSelect.value = opt.value;
            break;
          }
        }
      }
      if (messageField && !messageField.value) {
        messageField.placeholder = `Supply inquiry for ${prodName} (volume in MT, custom granulation, packaging specification)...`;
      }
    }

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  triggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn);
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending to contact@corngrits.in... ⏳</span>';
      }

      const name = (form.querySelector('#contactName')?.value || '').trim();
      const company = (form.querySelector('#contactCompany')?.value || '').trim();
      const email = (form.querySelector('#contactEmail')?.value || '').trim();
      const phone = (form.querySelector('#contactPhone')?.value || '').trim();
      const product = (form.querySelector('#contactProduct')?.value || '').trim();
      const message = (form.querySelector('#contactMessage')?.value || '').trim();

      const payload = {
        _subject: `Corn Grits Supply Inquiry: ${product || 'Commercial'} - ${name || 'Prospective Buyer'}`,
        _replyto: email,
        name: name,
        company: company || 'Not specified',
        email: email,
        phone: phone || 'Not provided',
        product: product,
        requirements: message || 'Standard commercial inquiry',
        recipient: 'contact@corngrits.in',
        submitted_at: new Date().toLocaleString()
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/contact@corngrits.in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showFormSuccess(modal, form, name, product);
        } else {
          throw new Error('API submission responded with non-200');
        }
      } catch (err) {
        console.warn('FormSubmit AJAX fallback to mailto:', err);
        // Direct mailto fallback
        const mailSubject = encodeURIComponent(`Corn Grits Commercial Inquiry: ${product || 'Commercial Supply'} - ${name}`);
        const mailBody = encodeURIComponent(
          `Hello Commercial Desk,\n\nI would like to place an inquiry regarding corn grits supply:\n\n` +
          `• Name: ${name}\n` +
          `• Company: ${company}\n` +
          `• Email: ${email}\n` +
          `• Phone/WhatsApp: ${phone}\n` +
          `• Product of Interest: ${product}\n` +
          `• Specific Volume & Requirements: ${message}\n\n` +
          `Best regards,\n${name}`
        );
        window.location.href = `mailto:contact@corngrits.in?subject=${mailSubject}&body=${mailBody}`;
        showFormSuccess(modal, form, name, product);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
}

/* Helper: Display Confirmation on Successful Inquiry Dispatch */
function showFormSuccess(modal, form, name, product) {
  const modalBody = modal.querySelector('.contact-modal-body, .modal-card, .contact-modal-dialog');
  if (!modalBody) {
    alert(`Thank you, ${name || 'Valued Partner'}! Your commercial inquiry for ${product} has been delivered to contact@corngrits.in.`);
    form.reset();
    return;
  }

  const originalDisplay = form.style.display;
  form.style.display = 'none';

  let successDiv = modal.querySelector('.inquiry-success-box');
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'inquiry-success-box';
    successDiv.style.cssText = 'text-align: center; padding: 28px 16px; animation: gradeDetailFadeIn 0.3s ease;';
    form.parentNode.insertBefore(successDiv, form.nextSibling);
  }

  successDiv.innerHTML = `
    <div style="width: 58px; height: 58px; margin: 0 auto 14px; background: #EBF8F0; color: #287247; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; border: 2px solid #A8D5BA;">✓</div>
    <h3 style="color: #163E28; font-size: 1.35rem; font-weight: 800; margin-bottom: 6px;">Inquiry Dispatched!</h3>
    <p style="color: #4A564E; font-size: 0.92rem; line-height: 1.6; max-width: 420px; margin: 0 auto 14px;">
      Thank you, <strong>${name || 'Valued Partner'}</strong>. Your commercial requirements for <strong>${product || 'Corn Grits'}</strong> have been sent directly to <strong style="color: #163E28;">contact@corngrits.in</strong>.
    </p>
    <div style="background: #FFFDF9; border: 1px solid #EBE3D3; border-radius: 12px; padding: 12px 14px; font-size: 0.82rem; color: #7A5B18; margin-bottom: 20px;">
      Our commercial supply desk will review your specifications and contact you shortly.
    </div>
    <button type="button" class="btn-contact" id="btnDoneInquiry" style="padding: 10px 26px; margin: 0 auto; justify-content: center;">
      <span>Done / Close</span>
    </button>
  `;
  successDiv.style.display = 'block';

  const doneBtn = successDiv.querySelector('#btnDoneInquiry');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      successDiv.style.display = 'none';
      form.style.display = originalDisplay || 'block';
      form.reset();
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }
}

/* 4. Back To Top */
function initBackToTop() {
  const btn = document.querySelector('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* 5. Smooth Scroll for Anchor Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.startsWith('#contactModal')) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* 6. Corn Bouncing & Popping Interactive Effect */
function initCornBounce() {
  // Select all interactive tabs, brand logo, and primary buttons
  const clickables = document.querySelectorAll(
    '.nav-item, .btn-contact, .btn-contact-hero, .btn-hero-primary, .btn-hero-secondary, .btn-hero-contact, .dropdown-link, .logo-corn, .btn-know-more, .mobile-nav-link, .hero-glass-pill'
  );

  clickables.forEach(el => {
    // Pointerdown gives instant tactile feedback upon click/touch
    el.addEventListener('pointerdown', (e) => {
      // Add bouncy pulse to the clicked element
      el.classList.remove('nav-clicked-bounce');
      // Trigger reflow to restart animation if clicked repeatedly
      void el.offsetWidth;
      el.classList.add('nav-clicked-bounce');

      setTimeout(() => {
        el.classList.remove('nav-clicked-bounce');
      }, 500);

      // Coordinates for popping corn kernels
      const rect = el.getBoundingClientRect();
      const x = e.clientX && e.clientX > 0 ? e.clientX : rect.left + rect.width / 2;
      const y = e.clientY && e.clientY > 0 ? e.clientY : rect.top + rect.height / 2;

      spawnCornBounceParticles(x, y, 7);
    });
  });
}

/**
 * Spawns physical bouncing corn kernel particles from (x, y)
 * @param {number} x - Origin X coordinate
 * @param {number} y - Origin Y coordinate
 * @param {number} count - Number of corn kernels to burst
 */
function spawnCornBounceParticles(x, y, count = 6) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'corn-bounce-particle';

    // Randomize kernel size between 10px and 16px
    const size = Math.floor(Math.random() * 6) + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${Math.round(size * 1.15)}px`;

    // Position at click coordinate
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Spread trajectory: left/right spread and upward burst
    const angle = (Math.random() * 120 - 150) * (Math.PI / 180); // between -150 and -30 deg (upwards)
    const distance = Math.random() * 70 + 40; // 40px to 110px burst
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = Math.floor(Math.random() * 360 - 180);

    particle.style.setProperty('--tx', `${tx.toFixed(1)}px`);
    particle.style.setProperty('--ty', `${ty.toFixed(1)}px`);
    particle.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(particle);

    // Remove particle element once animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 900);
  }
}

/* 7. Brand Showcase Modal (Domino's, Pizza Hut, KFC, McDonald's, Cheetos, Kellogg's, Barilla) */
function initBrandShowcaseModal() {
  const brandData = {
    pizza: {
      title: "Pizza Crusts & Stone Oven Dusting",
      subtitle: "Why Global Pizzerias Dust With Corn Grits",
      image: "images/applications/pizza-crust.jpg",
      brands: [
        { name: "Domino's Pizza", icon: "🍕" },
        { name: "Pizza Hut", icon: "🍕" },
        { name: "BOX8", icon: "📦" },
        { name: "Papa John's", icon: "🍅" },
        { name: "La Pino'z", icon: "🧀" }
      ],
      tagline: "The Secret Behind Domino's, Pizza Hut & BOX8's Crispy Crust",
      secrets: [
        "<strong>Effortless Peel Glide:</strong> Coarse corn grits act like millions of microscopic ball bearings underneath stretched pizza dough, allowing pizzas to slide effortlessly off the wooden peel onto 600°F stone deck ovens without sticking or tearing.",
        "<strong>Signature Blistered Crunch:</strong> Fine wheat flour burns into bitter black ash at high pizza baking temperatures. Corn grits withstand intense heat, toast into a golden crunchy bottom layer, and provide that signature Domino's & Pizza Hut crust bite.",
        "<strong>Zero Sogginess During Delivery:</strong> Corn grits create a protective granular buffer zone that absorbs excess condensation and moisture underneath the hot pizza, keeping delivery boxes crisp from oven to doorstep."
      ],
      grade: "Grits 108 (Medium Granulation, 14–20 Mesh) & Corn Meal"
    },
    bakery: {
      title: "Fast Food Coatings & Bakery Dusting",
      subtitle: "QSR Chains & Commercial Industrial Bakeries",
      image: "images/applications/savory-upma-grits.jpg",
      brands: [
        { name: "McDonald's", icon: "🍔" },
        { name: "KFC", icon: "🍗" },
        { name: "Burger King", icon: "👑" },
        { name: "Subway", icon: "🥖" },
        { name: "Popeyes", icon: "🍗" }
      ],
      tagline: "How KFC & McDonald's Engineer Unstoppable Crunch",
      secrets: [
        "<strong>KFC Extra-Crispy Breading:</strong> Coarse degermed corn grits are blended directly into KFC's seasoned flour dredge. The angular corn granules form crackling crispy peaks that stay crunchy under commercial heat lamps without absorbing excess grease.",
        "<strong>McDonald's English Muffins:</strong> Every McDonald's breakfast McMuffin is rolled and baked over a bed of coarse yellow corn grits, creating the iconic griddled texture and stopping dough from sticking during high-speed automated baking.",
        "<strong>Burger King & Subway Artisan Crusts:</strong> Cornmeal and fine grits provide sweet aromatic crust browning and distinctive rustic artisan dusting on specialty sandwich breads."
      ],
      grade: "Grits 108 & Grits 112 (Fine-to-Medium Cuts)"
    },
    polenta: {
      title: "Italian Polenta & European Gourmet Cuisine",
      subtitle: "Traditional Bistro Heritage & Authentic Fine Dining",
      image: "images/applications/italian-polenta.jpg",
      brands: [
        { name: "Italian Trattorias", icon: "🍝" },
        { name: "Barilla", icon: "🇮🇹" },
        { name: "De Cecco", icon: "🌾" },
        { name: "European Bistros", icon: "🍷" }
      ],
      tagline: "The Ancient Northern Italian Culinary Staple",
      secrets: [
        "<strong>Velvety Polenta Concia:</strong> Coarse-ground flint maize grits simmered slowly with vegetable stock, sweet farm butter, and aged parmesan, fontina, or gorgonzola cheese for a luxurious, comforting consistency.",
        "<strong>Gourmet Roasted Vegetable Bowls:</strong> Served hot as a rich, gluten-free bed for roasted balsamic mushrooms, sweet bell peppers, caramelised shallots, and fresh rosemary.",
        "<strong>Crispy Polenta Frites & Croquettes:</strong> Cooled polenta sets firmly into blocks that can be sliced into geometric cakes, grilled over charcoal, or fried into shatteringly crisp golden appetizers."
      ],
      grade: "Grits 101 & Grits 108 (Coarse Flaking & Medium Granulation)"
    },
    snacks: {
      title: "Extruded Snacks, Curls & Tortilla Nachos",
      subtitle: "Global Extrusion Snack Titans",
      image: "images/applications/extruded-snacks.jpg",
      brands: [
        { name: "Cheetos", icon: "🐆" },
        { name: "Doritos", icon: "🔺" },
        { name: "Kurkure", icon: "🌶️" },
        { name: "Lay's", icon: "🥔" },
        { name: "Takis", icon: "🔥" }
      ],
      tagline: "How Cheetos, Doritos & Kurkure Achieve Melt-In-Mouth Crunch",
      secrets: [
        "<strong>High-Pressure Twin-Screw Extrusion:</strong> Degermed corn grits with low fat (<1.0%) enter extrusion chambers under high heat and shear friction. Upon exiting the die nozzle, trapped superheated water instantly flashes to steam, causing the maize dough to expand into ultra-airy puffs and curls.",
        "<strong>Nacho & Tortilla Chip Structure:</strong> Corn grits provide structural tensile strength in fried chips, ensuring tortillas withstand heavy dips, melted queso, and spicy salsas without crumbling.",
        "<strong>Superior Flavor Slurry Absorption:</strong> The open cellular matrix of expanded corn grits bonds flawlessly with cheese powders, chili oils, and savory seasonings."
      ],
      grade: "Grits 108 (Snack Benchmark, 14–20 Mesh)"
    },
    breakfast: {
      title: "Breakfast Cereals & Morning Porridges",
      subtitle: "Flaked Cereals & Ready-To-Eat Breakfast Brands",
      image: "images/applications/honey-fruit-porridge.jpg",
      brands: [
        { name: "Kellogg's Corn Flakes", icon: "🐓" },
        { name: "Quaker Oats & Grits", icon: "🥣" },
        { name: "General Mills", icon: "🌾" },
        { name: "Post Cereals", icon: "🍯" }
      ],
      tagline: "The World's Favorite Morning Breakfast Fuel",
      secrets: [
        "<strong>Flaked Corn Flakes Production:</strong> The largest, cleanest degermed corn endosperm fragments (Grits 101 flaking hominy) are pressure-cooked with malt syrup, dried to exact moisture, flattened between heavy chilled steel rolls, and toasted in hot air ovens.",
        "<strong>Instant & Quick Breakfast Bowls:</strong> Micronized grits (Grits 112) hydrate within 3 minutes in hot milk or water, offering busy families a sustained, natural low-glycemic carbohydrate morning fuel.",
        "<strong>Fortified Porridges:</strong> Naturally rich in dietary fiber, iron, phosphorus, and carotenoid antioxidants (lutein and zeaxanthin)."
      ],
      grade: "Grits 101 (Coarse Flaking Grit, 10–14 Mesh) & Grits 112"
    }
  };

  const modal = document.querySelector('#brandShowcaseModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('#closeBrandModal');
  const titleEl = modal.querySelector('#brandModalTitle');
  const subtitleEl = modal.querySelector('#brandModalSubtitle');
  const imgEl = modal.querySelector('#brandModalImg');
  const badgesEl = modal.querySelector('#brandModalBadges');
  const taglineEl = modal.querySelector('#brandModalTagline');
  const secretsEl = modal.querySelector('#brandModalSecrets');
  const gradeEl = modal.querySelector('#brandModalGrade');

  const openBrandModal = (key) => {
    const data = brandData[key] || brandData.pizza;
    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }
    if (taglineEl) taglineEl.innerHTML = data.tagline;
    if (gradeEl) gradeEl.innerHTML = `<strong>Recommended Calibrated Cut:</strong> ${data.grade}`;

    if (badgesEl) {
      badgesEl.innerHTML = '';
      data.brands.forEach((brand, idx) => {
        const badge = document.createElement('span');
        badge.className = 'brand-badge-item';
        badge.style.animationDelay = `${idx * 0.07}s`;
        badge.innerHTML = `<span>${brand.icon}</span> <span>${brand.name}</span>`;
        badgesEl.appendChild(badge);
      });
    }

    if (secretsEl) {
      secretsEl.innerHTML = '';
      data.secrets.forEach(sec => {
        const li = document.createElement('li');
        li.innerHTML = sec;
        secretsEl.appendChild(li);
      });
    }

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeBrandModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-brand-key]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-brand-key');
      openBrandModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeBrandModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBrandModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeBrandModal();
    }
  });
}

/* 8. Scroll-Reveal Observer for Editorial & Product Sections */
function initScrollReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* 9. Interactive Commercial Grade Filter Tabs */
function initGradeTabs() {
  const tabPills = document.querySelectorAll('.grade-tab-pill');
  const gridView = document.querySelector('.grade-cards-grid');
  const detailContainer = document.querySelector('#gradeDetailPanels');
  const detailPanels = document.querySelectorAll('.grade-detail-panel');
  const backButtons = document.querySelectorAll('.btn-back-all');
  const cardItems = document.querySelectorAll('.grade-card-item');

  if (!tabPills.length || !gridView || !detailContainer) return;

  const switchToGrade = (gradeCode, shouldScroll = false) => {
    // 1. Update tab active state
    tabPills.forEach(pill => {
      const pGrade = pill.getAttribute('data-grade');
      const isMatch = (pGrade === gradeCode);
      pill.classList.toggle('is-active', isMatch);
      pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (gradeCode === 'all') {
      // Show All: 4 small cards grid (hide single big view)
      detailContainer.classList.remove('is-active');
      detailContainer.style.display = 'none';
      gridView.style.display = 'grid';

      cardItems.forEach(card => {
        card.classList.remove('is-dimmed', 'is-focused');
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
      });
    } else {
      // Single Grade: Hide small cards grid, show big expanded panel with detailed info
      gridView.style.display = 'none';
      detailContainer.style.display = 'block';
      detailContainer.classList.add('is-active');

      detailPanels.forEach(panel => {
        const pGrade = panel.getAttribute('data-detail-grade');
        if (pGrade === gradeCode) {
          panel.classList.add('is-active');
        } else {
          panel.classList.remove('is-active');
        }
      });
    }

    if (shouldScroll) {
      const section = document.querySelector('#commercial-grades');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Tab buttons click
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const grade = pill.getAttribute('data-grade');
      switchToGrade(grade, false);
    });
  });

  // "Back to All 4 Grades" buttons
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchToGrade('all', false);
    });
  });

  // Small cards click in Grid View -> opens big detailed view!
  cardItems.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking the contact inquiry button, let modal open normally
      if (e.target.closest('[data-open-modal]')) return;
      const grade = card.getAttribute('data-grade-code');
      if (grade) {
        switchToGrade(grade, true);
      }
    });
  });

  // Check URL hash on page load (e.g. #grits-101)
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('101a')) {
    switchToGrade('101a', true);
  } else if (hash.includes('101')) {
    switchToGrade('101', true);
  } else if (hash.includes('108')) {
    switchToGrade('108', true);
  } else if (hash.includes('112')) {
    switchToGrade('112', true);
  }
}





/* --------------------------------------------------------------------------
   10. Community Recipes & Admin Approval Workflow
   -------------------------------------------------------------------------- */
function initRecipeCommunity() {
  const STORAGE_KEY = 'corngrits_community_recipes';

  const DEFAULT_RECIPES = [
    {
      id: 'rec_101',
      title: 'Spicy Cajun Shrimp & Golden Grits',
      author: 'Chef Marcus Vance',
      category: 'Savory Mains & Bowls',
      grade: 'Grits 101 (Coarse / Flaking)',
      prepTime: '30 Mins',
      servings: '4 Servings',
      image: 'images/recipes/shrimp-and-grits.jpg',
      ingredients: '1 lb Fresh Jumbo Shrimp (peeled & deveined)\n1 cup Coarse Corn Grits 101\n4 slices Thick Smoked Bacon\n3 cloves Minced Garlic\n1 tbsp Cajun Creole Seasoning\n1 cup Whole Milk\n3 cups Chicken Broth\n2 tbsp Unsalted Butter\n2 tbsp Sliced Green Scallions\nFresh Lemon Wedges',
      instructions: '1. In a heavy saucepan, bring chicken broth and whole milk to a rolling boil. Whisk in coarse corn grits in a steady stream to avoid lumps.\n2. Lower heat to minimum, cover tightly, and simmer for 25 minutes, stirring occasionally until velvety and thick. Whisk in 1 tbsp butter and pinch of salt.\n3. In a large skillet over medium-high heat, fry chopped bacon until crisp. Remove bacon with a slotted spoon, keeping the flavorful drippings in the pan.\n4. Toss shrimp with cajun seasoning. Sauté in the hot bacon drippings for 2 minutes per side until pink and succulent. Stir in minced garlic and lemon juice for 30 seconds.\n5. Spoon warm golden grits into bowls, top with sautéed cajun shrimp, drizzle garlic butter pan sauce, and garnish with crisp bacon and scallions.',
      status: 'approved',
      createdAt: '2026-10-28T10:00:00Z',
      approvedAt: '2026-10-28T10:30:00Z'
    },
    {
      id: 'rec_102',
      title: 'Crispy Pan-Seared Rosemary Grit Cakes',
      author: 'Chef Elena Rossi • Trattoria Rustica',
      category: 'Crispy Snacks & Appetizers',
      grade: 'Grits 108 (Medium Granulation)',
      prepTime: '20 Mins + Chill',
      servings: '6 Servings',
      image: 'images/recipes/fried-grit-cakes.jpg',
      ingredients: '1 cup Corn Grits 108 (Medium)\n3.5 cups Seasoned Vegetable Broth\n1/2 cup Freshly Grated Parmesan Cheese\n1 tbsp Fresh Rosemary (finely chopped)\n2 tbsp Extra Virgin Olive Oil\n1 tbsp Farm Butter\nFlaky Maldon Sea Salt & Coarse Black Pepper',
      instructions: '1. Bring vegetable broth to a boil in a medium pot. Whisk in medium corn grits and cook over low heat for 18 minutes until very thick.\n2. Remove from heat; fold in grated parmesan, chopped rosemary, butter, salt, and freshly ground black pepper.\n3. Line an 8x8 inch baking dish with parchment and lightly grease. Spread the hot grits into an even 3/4-inch thick layer. Refrigerate for 45 minutes until firm and chilled.\n4. Invert onto a cutting board and cut into neat triangles or squares.\n5. Heat olive oil in a cast-iron skillet over medium-high heat. Fry grit cakes for 4–5 minutes per side without crowding until deeply golden and crackling crisp. Drain on paper towels, sprinkle with flaky sea salt, and serve with garlic aioli or tomato coulis.',
      status: 'approved',
      createdAt: '2026-10-29T14:00:00Z',
      approvedAt: '2026-10-29T14:45:00Z'
    }
  ];

  // Storage Helpers
  function getRecipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      return parsed;
    } catch (e) {
      return DEFAULT_RECIPES.slice();
    }
  }

  function saveRecipes(recipes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }

  // Update Badge Counts
  function updateBadges() {
    const recipes = getRecipes();
    const pendingCount = recipes.filter(r => r.status === 'pending').length;
    const approvedCount = recipes.filter(r => r.status === 'approved').length;

    document.querySelectorAll('.admin-pending-count').forEach(el => {
      el.textContent = pendingCount;
      el.classList.toggle('is-zero', pendingCount === 0);
    });

    const approvedEl = document.querySelector('#adminApprovedCount');
    if (approvedEl) {
      approvedEl.textContent = approvedCount;
    }
  }

  // Modal Open/Close Management
  const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('is-active');
    // If no other modals active, restore overflow
    if (!document.querySelector('.modal-overlay.is-active')) {
      document.body.style.overflow = '';
    }
  };

  // Close buttons and click outside
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const target = document.querySelector('#' + modalId + 'Modal') || btn.closest('.modal-overlay');
      closeModal(target);
    });
  });

  const uploadModal = document.querySelector('#recipeUploadModal');
  const adminModal = document.querySelector('#recipeAdminModal');
  const detailModal = document.querySelector('#recipeDetailModal');
  const successModal = document.querySelector('#recipeSubmitSuccessModal');

  [uploadModal, adminModal, detailModal, successModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        closeModal(m);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [uploadModal, adminModal, detailModal, successModal].forEach(m => {
        if (m && m.classList.contains('is-active')) closeModal(m);
      });
    }
  });

  // Open triggers for Upload & Admin
  document.querySelectorAll('[data-open-modal="recipeUpload"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(uploadModal);
    });
  });

  document.querySelectorAll('[data-open-modal="recipeAdmin"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdminList('pending');
      openModal(adminModal);
    });
  });

  // Success dialog buttons
  const btnSuccessClose = document.querySelector('#btnSuccessClose');
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => closeModal(successModal));
  }

  const btnSuccessOpenAdmin = document.querySelector('#btnSuccessOpenAdmin');
  if (btnSuccessOpenAdmin) {
    btnSuccessOpenAdmin.addEventListener('click', () => {
      closeModal(successModal);
      renderAdminList('pending');
      openModal(adminModal);
    });
  }

  // Render Community Recipes Grid (applications.html)
  function renderCommunityGrid() {
    const grid = document.querySelector('#communityRecipesGrid');
    if (!grid) return;

    const recipes = getRecipes().filter(r => r.status === 'approved');

    if (recipes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FAF8F2; border: 1.5px dashed #D5CEBE; border-radius: 16px; padding: 36px 20px; text-align: center;">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">🍳</span>
          <strong style="color: var(--color-forest); font-size: 1.1rem; display: block; margin-bottom: 6px;">No Community Recipes Published Yet</strong>
          <p style="font-size: 0.88rem; color: #5B665E; max-width: 460px; margin: 0 auto 16px;">Be the first chef or home cook to share your favorite corn grits dish with the community!</p>
          <button type="button" class="btn-know-more btn-upload-recipe-main" data-open-modal="recipeUpload">
            <span>🍳 Upload Your Recipe &rarr;</span>
          </button>
        </div>`;
      // Re-bind upload button
      grid.querySelectorAll('[data-open-modal="recipeUpload"]').forEach(b => {
        b.addEventListener('click', () => openModal(uploadModal));
      });
      return;
    }

    grid.innerHTML = recipes.map(r => {
      const ingLines = (r.ingredients || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const ingPreview = ingLines.slice(0, 4);
      const ingRemaining = ingLines.length > 4 ? `+${ingLines.length - 4} more` : '';

      return `
        <article class="community-recipe-card" data-recipe-id="${r.id}">
          <div class="recipe-img-wrap">
            <img src="${r.image || 'images/recipes/cheese-grits.jpg'}" alt="${r.title}" width="400" height="260" loading="lazy">
            <span class="recipe-badge-floating">
              <span>⏱️ ${r.prepTime || '25 Mins'}</span> &bull; <span>🍽️ ${r.servings || '4 Servings'}</span>
            </span>
            <span class="badge-chef-approved">
              <span>✨ Approved Recipe</span>
            </span>
          </div>
          <div class="recipe-content">
            <div>
              <span class="recipe-tag-grade">${r.grade || 'Corn Grits'}</span>
              <h4 class="recipe-title" style="margin-top: 4px;">${r.title}</h4>
              <div class="recipe-author-byline">
                <span>👨‍🍳 By <strong>${r.author || 'Community Chef'}</strong></span>
                <span>&bull;</span>
                <span>📂 ${r.category || 'Dishes'}</span>
              </div>
              <ul class="recipe-ingredients-list" style="margin-bottom: 8px;">
                ${ingPreview.map(ing => `<li class="recipe-ingredient-chip">${ing}</li>`).join('')}
                ${ingRemaining ? `<li class="recipe-ingredient-chip" style="background: #FFF5DD; color: #8C5E11; font-weight: 700;">${ingRemaining}</li>` : ''}
              </ul>
            </div>
            <div>
              <button type="button" class="btn-view-recipe" data-view-recipe="${r.id}">
                <span>View Full Recipe &amp; Cooking Steps 📖</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Bind "View Full Recipe" buttons
    grid.querySelectorAll('[data-view-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-recipe');
        openRecipeDetail(id);
      });
    });
  }

  // Render Homepage Preview Card (index.html)
  function renderHomePreview() {
    const previewContainer = document.querySelector('#homeRecipePreview');
    if (!previewContainer) return;

    const approvedRecipes = getRecipes().filter(r => r.status === 'approved');
    if (approvedRecipes.length === 0) {
      previewContainer.innerHTML = '';
      return;
    }

    // Pick latest approved recipe
    const latest = approvedRecipes[0];
    previewContainer.innerHTML = `
      <div style="background: #FFFFFF; border-radius: 16px; border: 1.5px solid #E4CCA6; overflow: hidden; box-shadow: 0 8px 24px rgba(18, 43, 30, 0.08); transition: transform 0.3s ease;">
        <div style="position: relative; height: 160px; overflow: hidden; background: #163E28;">
          <img src="${latest.image || 'images/recipes/shrimp-and-grits.jpg'}" alt="${latest.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span style="position: absolute; top: 10px; right: 10px; background: rgba(22, 62, 40, 0.9); color: #FAA61A; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 50px; border: 1px solid rgba(250, 166, 26, 0.5);">
            ✨ Featured Community Recipe
          </span>
          <span style="position: absolute; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.75); color: #FFFFFF; font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 50px;">
            ⏱️ ${latest.prepTime} &bull; 🍽️ ${latest.servings}
          </span>
        </div>
        <div style="padding: 16px;">
          <span style="font-size: 0.75rem; color: #8C5E11; font-weight: 700; background: #FFF5DD; padding: 2px 8px; border-radius: 50px; display: inline-block; margin-bottom: 6px;">
            ${latest.grade}
          </span>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #163E28; margin: 0 0 4px; line-height: 1.3;">
            ${latest.title}
          </h4>
          <div style="font-size: 0.78rem; color: #627166; margin-bottom: 12px;">
            By <strong>${latest.author}</strong>
          </div>
          <button type="button" class="btn-know-more" data-view-recipe="${latest.id}" style="width: 100%; justify-content: center; padding: 8px 14px; font-size: 0.82rem;">
            <span>Read Cooking Steps 👨‍🍳</span>
          </button>
        </div>
      </div>
    `;

    previewContainer.querySelectorAll('[data-view-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeDetail(latest.id);
      });
    });
  }

  // Open Recipe Detail Modal
  function openRecipeDetail(id) {
    const recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe || !detailModal) return;

    const imgEl = detailModal.querySelector('#detailRecipeImg');
    const catEl = detailModal.querySelector('#detailRecipeCategory');
    const gradeEl = detailModal.querySelector('#detailRecipeGrade');
    const titleEl = detailModal.querySelector('#detailRecipeTitle');
    const metaEl = detailModal.querySelector('#detailRecipeMeta');
    const ingListEl = detailModal.querySelector('#detailRecipeIngredients');
    const stepsListEl = detailModal.querySelector('#detailRecipeInstructions');

    if (imgEl) {
      imgEl.src = recipe.image || 'images/recipes/cheese-grits.jpg';
      imgEl.alt = recipe.title;
    }
    if (catEl) catEl.textContent = '📂 ' + (recipe.category || 'Corn Grits Recipe');
    if (gradeEl) gradeEl.textContent = '🌾 ' + (recipe.grade || 'Corn Grits');
    if (titleEl) titleEl.textContent = recipe.title;

    if (metaEl) {
      metaEl.innerHTML = `
        <span class="recipe-meta-item">👨‍🍳 Chef: <strong>${recipe.author || 'Community Cook'}</strong></span>
        <span class="recipe-meta-item">⏱️ Prep: <strong>${recipe.prepTime || '25 Mins'}</strong></span>
        <span class="recipe-meta-item">🍽️ Serves: <strong>${recipe.servings || '4'}</strong></span>
        ${recipe.status === 'approved' ? '<span class="recipe-meta-item" style="color: #276749;">✅ Live on Website</span>' : '<span class="recipe-meta-item" style="color: #D69E2E;">⏳ Pending Review</span>'}
      `;
    }

    if (ingListEl) {
      const ings = (recipe.ingredients || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      ingListEl.innerHTML = ings.map(item => `<li><span>🌽</span> <span>${item}</span></li>`).join('');
    }

    if (stepsListEl) {
      const steps = (recipe.instructions || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      stepsListEl.innerHTML = steps.map(step => {
        // Strip leading numbers if already numbered
        const cleanStep = step.replace(/^\d+[.)]\s*/, '');
        return `<li>${cleanStep}</li>`;
      }).join('');
    }

    openModal(detailModal);
  }

  // Render Admin Review List
  let currentAdminTab = 'pending';
  function renderAdminList(tab = 'pending') {
    currentAdminTab = tab;
    const list = document.querySelector('#adminRecipeList');
    if (!list) return;

    // Update active tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      const t = btn.getAttribute('data-admin-tab');
      btn.classList.toggle('is-active', t === tab);
    });

    const recipes = getRecipes();
    const filtered = recipes.filter(r => r.status === tab);

    updateBadges();

    if (filtered.length === 0) {
      if (tab === 'pending') {
        list.innerHTML = `
          <div style="background: #FFFFFF; border: 1.5px dashed #C8DACF; border-radius: 12px; padding: 32px 18px; text-align: center;">
            <span style="font-size: 2rem; display: block; margin-bottom: 6px;">🎉</span>
            <strong style="color: #163E28; font-size: 1rem; display: block;">All Caught Up!</strong>
            <p style="font-size: 0.84rem; color: #5B665E; margin: 4px 0 0;">There are no recipes waiting in the pending moderation queue.</p>
          </div>
        `;
      } else {
        list.innerHTML = `
          <div style="background: #FFFFFF; border: 1.5px dashed #D5CEBE; border-radius: 12px; padding: 32px 18px; text-align: center;">
            <strong style="color: #163E28; font-size: 1rem; display: block;">No Published Recipes Found</strong>
            <p style="font-size: 0.84rem; color: #5B665E; margin: 4px 0 0;">Approved recipes will be displayed here.</p>
          </div>
        `;
      }
      return;
    }

    list.innerHTML = filtered.map(r => {
      const isPending = (r.status === 'pending');
      const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

      return `
        <div class="admin-recipe-item ${isPending ? 'is-pending' : 'is-approved'}" data-item-id="${r.id}">
          <div class="admin-recipe-thumb">
            <img src="${r.image || 'images/recipes/cheese-grits.jpg'}" alt="${r.title}">
          </div>
          <div class="admin-recipe-info">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; background: ${isPending ? '#FEFCBF; color: #975A16;' : '#C6F6D5; color: #22543D;'}">
                ${isPending ? '⏳ PENDING REVIEW' : '✅ PUBLISHED LIVE'}
              </span>
              <span style="font-size: 0.75rem; color: #718076;">Submitted: ${dateStr}</span>
            </div>
            <strong style="color: #163E28; font-size: 1.05rem; display: block; margin-bottom: 2px;">${r.title}</strong>
            <div style="font-size: 0.82rem; color: #556358;">
              By <strong>${r.author}</strong> &bull; ${r.category} &bull; <span style="color: #8C5E11; font-weight: 600;">${r.grade}</span>
            </div>
          </div>
          <div class="admin-recipe-actions">
            ${isPending ? `
              <button type="button" class="btn-admin-approve" data-admin-action="approve" data-id="${r.id}">
                <span>✅ Approve &amp; Publish Live</span>
              </button>
            ` : `
              <button type="button" class="btn-admin-preview" data-admin-action="unpublish" data-id="${r.id}" title="Move back to pending review">
                <span>↩️ Unpublish</span>
              </button>
            `}
            <button type="button" class="btn-admin-preview" data-admin-action="preview" data-id="${r.id}">
              <span>👁️ Preview</span>
            </button>
            <button type="button" class="btn-admin-reject" data-admin-action="delete" data-id="${r.id}">
              <span>🗑️ Delete</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind action handlers
    list.querySelectorAll('[data-admin-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-admin-action');
        const id = btn.getAttribute('data-id');
        handleAdminAction(action, id);
      });
    });
  }

  // Handle Admin Actions: Approve, Reject, Unpublish, Preview
  function handleAdminAction(action, id) {
    let recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    if (action === 'approve') {
      recipe.status = 'approved';
      recipe.approvedAt = new Date().toISOString();
      saveRecipes(recipes);
      updateBadges();
      renderAdminList('pending');
      renderCommunityGrid();
      renderHomePreview();

      // Show toast confirmation
      showToast(`🎉 Approved! "${recipe.title}" is now published live on the website!`);
    } else if (action === 'unpublish') {
      recipe.status = 'pending';
      saveRecipes(recipes);
      updateBadges();
      renderAdminList('approved');
      renderCommunityGrid();
      renderHomePreview();
      showToast(`Recipe moved back to pending review.`);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
        recipes = recipes.filter(r => r.id !== id);
        saveRecipes(recipes);
        updateBadges();
        renderAdminList(currentAdminTab);
        renderCommunityGrid();
        renderHomePreview();
        showToast(`Recipe was removed.`);
      }
    } else if (action === 'preview') {
      openRecipeDetail(id);
    }
  }

  // Admin Tab Switch
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-admin-tab');
      renderAdminList(tab);
    });
  });

  // Photo Upload & Preview Handling
  let currentPhotoData = null;
  const photoFileInput = document.querySelector('#recipePhotoFile');
  const dropZone = document.querySelector('#recipeDropZone');
  const dropZonePrompt = document.querySelector('#recipeDropZonePrompt');
  const previewWrap = document.querySelector('#recipePhotoPreviewWrap');
  const previewImg = document.querySelector('#recipePhotoPreviewImg');
  const btnRemovePhoto = document.querySelector('#btnRemovePhoto');
  const presetPills = document.querySelectorAll('.recipe-preset-btn');

  function setPreview(src) {
    currentPhotoData = src;
    if (previewImg) previewImg.src = src;
    if (previewWrap) previewWrap.classList.add('has-photo');
    if (dropZonePrompt) dropZonePrompt.style.display = 'none';
  }

  function clearPreview() {
    currentPhotoData = null;
    if (photoFileInput) photoFileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewWrap) previewWrap.classList.remove('has-photo');
    if (dropZonePrompt) dropZonePrompt.style.display = 'block';
    presetPills.forEach(p => p.classList.remove('is-selected'));
  }

  if (dropZone && photoFileInput) {
    dropZone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemovePhoto')) return;
      photoFileInput.click();
    });

    photoFileInput.addEventListener('change', () => {
      const file = photoFileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
        presetPills.forEach(p => p.classList.remove('is-selected'));
      };
      reader.readAsDataURL(file);
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('is-dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreview(ev.target.result);
          presetPills.forEach(p => p.classList.remove('is-selected'));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      clearPreview();
    });
  }

  // Preset Dish Style Buttons
  presetPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      presetPills.forEach(p => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      const imgPath = pill.getAttribute('data-img');
      setPreview(imgPath);
    });
  });

  // Recipe Upload Form Submission
  const uploadForm = document.querySelector('#recipeUploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.querySelector('#recipeTitle')?.value.trim();
      const author = document.querySelector('#recipeAuthor')?.value.trim();
      const category = document.querySelector('#recipeCategory')?.value;
      const grade = document.querySelector('#recipeGrade')?.value;
      const prepTime = document.querySelector('#recipePrepTime')?.value.trim();
      const servings = document.querySelector('#recipeServings')?.value.trim();
      const ingredients = document.querySelector('#recipeIngredients')?.value.trim();
      const instructions = document.querySelector('#recipeInstructions')?.value.trim();

      if (!title || !author || !ingredients || !instructions) {
        alert('Please fill in all required recipe fields.');
        return;
      }

      const newRecipe = {
        id: 'rec_' + Date.now(),
        title: title,
        author: author,
        category: category || 'Savory Mains & Bowls',
        grade: grade || 'Grits 101 (Coarse / Flaking)',
        prepTime: prepTime || '25 Mins',
        servings: servings || '4 Servings',
        image: currentPhotoData || 'images/recipes/cheese-grits.jpg',
        ingredients: ingredients,
        instructions: instructions,
        status: 'pending', // Pending admin approval!
        createdAt: new Date().toISOString()
      };

      const recipes = getRecipes();
      recipes.unshift(newRecipe);
      saveRecipes(recipes);

      // Reset form
      uploadForm.reset();
      clearPreview();
      closeModal(uploadModal);

      // Update badge counters immediately
      updateBadges();

      // Show Success Modal
      if (successModal) {
        const authorEl = successModal.querySelector('#successAuthorName');
        const titleEl = successModal.querySelector('#successRecipeTitle');
        if (authorEl) authorEl.textContent = author;
        if (titleEl) titleEl.textContent = `"${title}"`;
        openModal(successModal);
      }
    });
  }

  // Quick In-App Toast
  function showToast(message) {
    let toast = document.querySelector('#recipeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'recipeToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #163E28;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 1.5px solid #FAA61A;
        z-index: 3000;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        text-align: center;
        max-width: 90vw;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 4000);
  }

  // Initial runs
  updateBadges();
  renderCommunityGrid();
  renderHomePreview();
}
