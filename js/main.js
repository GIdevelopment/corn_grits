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
  initBlogFeatures();
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

  // ── Firebase check ──────────────────────────────────
  const firebaseAvailable = (
    typeof CG_FIREBASE_READY !== 'undefined' &&
    CG_FIREBASE_READY &&
    typeof firebase !== 'undefined'
  );

  // If Firebase is available, seed Firestore with defaults if empty,
  // then render community grid from Firestore (approved only).
  if (firebaseAvailable) {
    const firestoreDB = firebase.firestore();
    // Real-time listener for approved recipes on the page grid
    const grid = document.querySelector('#communityRecipesGrid');
    if (grid) {
      firestoreDB.collection('recipes')
        .where('status', '==', 'approved')
        .orderBy('approvedAt', 'desc')
        .onSnapshot(snapshot => {
          const approved = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          renderApprovedGrid(approved, grid);
        }, err => console.warn('Firestore grid error:', err));
    }
  }

  const DEFAULT_RECIPES = [
    {
      id: 'rec_101',
      title: 'Classic Southern Cheddar Cheese Grits',
      author: 'Chef Marcus Vance • Southern Hearth',
      category: 'Savory Mains & Bowls',
      grade: 'Grits 101 or 108',
      prepTime: '25 Mins',
      servings: '4 Servings',
      image: 'images/recipes/cheese-grits.jpg',
      description: 'Slow-simmered golden corn grits folded with rich aged sharp cheddar cheese, sweet cream farm butter, and a touch of black pepper. The undisputed king of Southern comfort cooking.',
      ingredients: '1 cup Coarse Corn Grits\n3 cups Veg / Chicken Broth\n1 cup Whole Milk\n1½ cups Sharp Cheddar\n3 tbsp Butter\nSalt & Pepper to taste',
      instructions: '1. Bring broth, milk, salt, and 1 tbsp butter to a rolling simmer in a heavy saucepan.\n2. Slowly whisk in corn grits in a steady stream to guarantee a lump-free texture.\n3. Reduce heat to low, cover, and simmer for 20–25 minutes, stirring occasionally until thick.\n4. Remove from heat; fold in shredded cheddar and remaining butter until creamy. Serve hot!',
      status: 'approved',
      submittedAt: '2026-10-28T10:00:00Z',
      approvedAt: '2026-10-28T10:30:00Z'
    },
    {
      id: 'rec_102',
      title: 'Lowcountry Garlic Butter Shrimp & Grits',
      author: 'Chef Marcus Vance',
      category: 'Savory Mains & Bowls',
      grade: 'Grits 101 (Coarse)',
      prepTime: '30 Mins',
      servings: '4 Servings',
      image: 'images/recipes/shrimp-and-grits.jpg',
      description: 'Juicy wild shrimp pan-seared with smoked paprika, crisp bacon, and minced garlic, ladled atop a warm, velvety bed of stone-milled coarse corn grits with fresh green scallions.',
      ingredients: '1 lb Fresh Jumbo Shrimp (peeled & deveined)\n1 cup Coarse Grits 101\n4 slices Thick Bacon\n3 cloves Minced Garlic\n1 tbsp Lemon Juice\n1 cup Whole Milk\n3 cups Chicken Broth\n2 tbsp Butter\nSliced Scallions',
      instructions: '1. Cook coarse corn grits in salted water and milk until thick, buttery, and smooth. Keep warm.\n2. Fry chopped bacon until crispy in a skillet; remove bacon bits, reserving pan drippings.\n3. Toss seasoned shrimp in hot skillet for 2 minutes per side until pink; stir in garlic and lemon.\n4. Ladle warm grits into bowls, top with seared shrimp, spoon over garlic butter, and garnish with bacon.',
      status: 'approved',
      submittedAt: '2026-10-28T11:00:00Z',
      approvedAt: '2026-10-28T11:30:00Z'
    },
    {
      id: 'rec_103',
      title: 'Crispy Golden Grit Cakes (Polenta Croquettes)',
      author: 'Chef Elena Rossi • Trattoria Rustica',
      category: 'Crispy Snacks & Appetizers',
      grade: 'Grits 101 or 108',
      prepTime: '20 Mins + Chill',
      servings: '6 Servings',
      image: 'images/recipes/fried-grit-cakes.jpg',
      description: 'Thick savory grits seasoned with parmesan cheese and cracked herbs, chilled into a block, cut into geometric cakes, and pan-seared to deep golden perfection. Crunchy outside, creamy inside!',
      ingredients: '1 cup Corn Grits 108 (Medium)\n3½ cups Seasoned Broth\n½ cup Grated Parmesan\n1 tbsp Chopped Rosemary\nOlive Oil / Butter for frying\nFlaky Sea Salt & Coarse Black Pepper',
      instructions: '1. Cook grits thick; stir in parmesan cheese, fresh chopped rosemary, and black pepper.\n2. Spread into a buttered shallow square dish and chill in refrigerator for 45 minutes until firm.\n3. Slice the chilled block into triangles or squares using a sharp chef\'s knife.\n4. Pan-fry in olive oil over medium-high heat for 4 minutes per side until crackling crisp. Serve with dip!',
      status: 'approved',
      submittedAt: '2026-10-29T14:00:00Z',
      approvedAt: '2026-10-29T14:45:00Z'
    },
    {
      id: 'rec_104',
      title: 'Wildflower Honey & Butter Breakfast Bowl',
      author: 'Chef Anita Roy • Heritage Kitchen',
      category: 'Breakfast Porridge & Bowls',
      grade: 'Grits 108 or 112',
      prepTime: '15 Mins',
      servings: '2 Servings',
      image: 'images/recipes/honey-butter-grits.jpg',
      description: 'A wholesome country morning porridge. Medium corn grits cooked gently in milk and cinnamon, finished with a generous swirl of sweet farm butter, raw wildflower honey, toasted pecans, and berries.',
      ingredients: '¾ cup Corn Grits (Medium)\n2½ cups Milk (or Oat Milk)\n2 tbsp Sweet Butter\n2 tbsp Wildflower Honey\n¼ tsp Ground Cinnamon\nBlueberries & Toasted Pecans',
      instructions: '1. Bring milk, cinnamon, and a tiny pinch of salt to a gentle simmer in a non-stick pot.\n2. Whisk in corn grits gradually; lower heat to low and simmer for 12–15 minutes until velvety.\n3. Stir in butter until melted and glistening throughout the hot porridge.\n4. Pour into warm bowls; swirl raw wildflower honey on top and garnish with berries and toasted pecans.',
      status: 'approved',
      submittedAt: '2026-10-30T09:00:00Z',
      approvedAt: '2026-10-30T09:30:00Z'
    }
  ];

  // Storage Helpers — preserving user unpublish/delete actions
  function getRecipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      // Merge missing default signature recipes if not yet present
      let modified = false;
      DEFAULT_RECIPES.forEach(def => {
        const exists = parsed.some(r => r.id === def.id || r.title === def.title);
        if (!exists) {
          parsed.push({ ...def });
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return DEFAULT_RECIPES.slice();
    }
  }

  function saveRecipes(recipes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
      window.dispatchEvent(new CustomEvent('corngrits_recipes_updated', { detail: recipes }));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }

  // ── Shared grid renderer (used by both Firebase and local path) ──
  function renderApprovedGrid(recipes, grid) {
    if (!grid) return;
    const uploadModal = document.querySelector('#recipeUploadModal');
    if (recipes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;background:#FAF8F2;border:1.5px dashed #D5CEBE;border-radius:16px;padding:36px 20px;text-align:center;">
          <span style="font-size:2.2rem;display:block;margin-bottom:8px;">🍳</span>
          <strong style="color:var(--color-forest);font-size:1.1rem;display:block;margin-bottom:6px;">No Community Recipes Published Yet</strong>
          <p style="font-size:0.88rem;color:#5B665E;max-width:460px;margin:0 auto 16px;">Be the first chef or home cook to share your favorite corn grits dish!</p>
          <button type="button" class="btn-know-more btn-upload-recipe-main" data-open-modal="recipeUpload"><span>🍳 Upload Your Recipe &rarr;</span></button>
        </div>`;
      grid.querySelectorAll('[data-open-modal="recipeUpload"]').forEach(b => {
        b.addEventListener('click', () => { if (uploadModal) uploadModal.classList.add('is-active'); });
      });
      return;
    }
    grid.innerHTML = recipes.map(r => {
      const ingLines   = (r.ingredients||'').split('\n').map(s=>s.trim()).filter(Boolean);
      const ingPreview = ingLines.slice(0,4);
      const ingMore    = ingLines.length > 4 ? `+${ingLines.length-4} more` : '';
      return `
        <article class="community-recipe-card" data-recipe-id="${r.id}">
          <div class="recipe-img-wrap">
            <img src="${r.image||'images/recipes/cheese-grits.jpg'}" alt="${r.title}" width="400" height="260" loading="lazy">
            <span class="recipe-badge-floating"><span>⏱️ ${r.prepTime||'25 Mins'}</span> &bull; <span>🍽️ ${r.servings||'4 Servings'}</span></span>
            <span class="badge-chef-approved"><span>✨ Approved Recipe</span></span>
          </div>
          <div class="recipe-content">
            <div>
              <span class="recipe-tag-grade">${r.grade||r.gritsGrade||'Corn Grits'}</span>
              <h4 class="recipe-title" style="margin-top:4px;">${r.title}</h4>
              <div class="recipe-author-byline">
                <span>👨‍🍳 By <strong>${r.author||'Community Chef'}</strong></span>
                <span>&bull;</span>
                <span>📂 ${r.category||'Dishes'}</span>
              </div>
              <ul class="recipe-ingredients-list" style="margin-bottom:8px;">
                ${ingPreview.map(ing=>`<li class="recipe-ingredient-chip">${ing}</li>`).join('')}
                ${ingMore ? `<li class="recipe-ingredient-chip" style="background:#FFF5DD;color:#8C5E11;font-weight:700;">${ingMore}</li>` : ''}
              </ul>
            </div>
            <div>
              <button type="button" class="btn-view-recipe" data-view-recipe="${r.id}"><span>View Full Recipe &amp; Cooking Steps 📖</span></button>
            </div>
          </div>
        </article>`;
    }).join('');
    // Bind detail buttons — store recipes in closure for lookup
    grid.querySelectorAll('[data-view-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-recipe');
        const recipe = recipes.find(r => r.id === id);
        if (recipe) openRecipeDetailDirect(recipe);
      });
    });
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
    renderApprovedGrid(recipes, grid);
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

  // ── Direct version used by Firebase-loaded recipes ──
  function openRecipeDetailDirect(recipe) {
    if (!detailModal) return;
    const imgEl      = detailModal.querySelector('#detailRecipeImg');
    const catEl      = detailModal.querySelector('#detailRecipeCategory');
    const gradeEl    = detailModal.querySelector('#detailRecipeGrade');
    const titleEl    = detailModal.querySelector('#detailRecipeTitle');
    const metaEl     = detailModal.querySelector('#detailRecipeMeta');
    const ingListEl  = detailModal.querySelector('#detailRecipeIngredients');
    const stepsListEl= detailModal.querySelector('#detailRecipeInstructions');
    if (imgEl)   { imgEl.src = recipe.image || 'images/recipes/cheese-grits.jpg'; imgEl.alt = recipe.title; }
    if (catEl)   catEl.textContent   = '📂 ' + (recipe.category || 'Corn Grits Recipe');
    if (gradeEl) gradeEl.textContent = '🌾 ' + (recipe.grade || recipe.gritsGrade || 'Corn Grits');
    if (titleEl) titleEl.textContent = recipe.title;
    if (metaEl)  metaEl.innerHTML = `
      <span class="recipe-meta-item">👨‍🍳 Chef: <strong>${recipe.author||'Community Cook'}</strong></span>
      <span class="recipe-meta-item">⏱️ Prep: <strong>${recipe.prepTime||'25 Mins'}</strong></span>
      <span class="recipe-meta-item">🍽️ Serves: <strong>${recipe.servings||'4'}</strong></span>
      <span class="recipe-meta-item" style="color:#276749;">✅ Live on Website</span>`;
    if (ingListEl)   ingListEl.innerHTML   = (recipe.ingredients||'').split('\n').map(s=>s.trim()).filter(Boolean).map(i=>`<li><span>🌽</span> <span>${i}</span></li>`).join('');
    if (stepsListEl) stepsListEl.innerHTML = (recipe.instructions||'').split('\n').map(s=>s.trim()).filter(Boolean).map(s=>`<li>${s.replace(/^\d+[.)]\s*/,'')}</li>`).join('');
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
        title: title,
        author: author,
        category: category || 'Savory Mains & Bowls',
        grade: grade || 'Grits 101 (Coarse / Flaking)',
        gritsGrade: grade || 'Grits 101 (Coarse / Flaking)',
        prepTime: prepTime || '25 Mins',
        servings: servings || '4 Servings',
        image: currentPhotoData || 'images/recipes/cheese-grits.jpg',
        ingredients: ingredients,
        instructions: instructions,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      // ── Try Firebase first; fall back to localStorage ──
      const firebaseAvailable = (
        typeof CG_FIREBASE_READY !== 'undefined' &&
        CG_FIREBASE_READY &&
        typeof firebase !== 'undefined'
      );

      if (firebaseAvailable) {
        const submitBtn = uploadForm.querySelector('[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        firebase.firestore().collection('recipes').add({
          ...newRecipe,
          submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          uploadForm.reset();
          clearPreview();
          closeModal(uploadModal);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span>🍳 Submit Recipe for Admin Approval &rarr;</span>'; }
          if (successModal) {
            const authorEl = successModal.querySelector('#successAuthorName');
            const titleEl  = successModal.querySelector('#successRecipeTitle');
            if (authorEl) authorEl.textContent = author;
            if (titleEl)  titleEl.textContent  = `"${title}"`;
            openModal(successModal);
          }
        }).catch(err => {
          console.error('Firebase submit error:', err);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span>🍳 Submit Recipe for Admin Approval &rarr;</span>'; }
          alert('Submission failed. Please try again.');
        });
      } else {
        // Local localStorage fallback
        newRecipe.id = 'rec_' + Date.now();
        const recipes = getRecipes();
        recipes.unshift(newRecipe);
        saveRecipes(recipes);
        uploadForm.reset();
        clearPreview();
        closeModal(uploadModal);
        updateBadges();
        if (successModal) {
          const authorEl = successModal.querySelector('#successAuthorName');
          const titleEl  = successModal.querySelector('#successRecipeTitle');
          if (authorEl) authorEl.textContent = author;
          if (titleEl)  titleEl.textContent  = `"${title}"`;
          openModal(successModal);
        }
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

  // ── Real-time sync: re-render grid when admin changes localStorage from another tab ──
  window.addEventListener('storage', function(e) {
    if (!e.key || e.key === STORAGE_KEY) {
      renderCommunityGrid();
      renderHomePreview();
      updateBadges();
    }
  });

  window.addEventListener('corngrits_recipes_updated', function() {
    renderCommunityGrid();
    renderHomePreview();
    updateBadges();
  });

  // ── Polling fallback (handles same-tab admin edits and fast tab switching) ──
  let _lastSnapshot = localStorage.getItem(STORAGE_KEY);
  setInterval(function() {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current !== _lastSnapshot) {
      _lastSnapshot = current;
      renderCommunityGrid();
      renderHomePreview();
      updateBadges();
    }
  }, 1200);

  // Initial runs
  updateBadges();
  renderCommunityGrid();
  renderHomePreview();
}


/* --------------------------------------------------------------------------
   11. Blog Articles & Reader Modal
   -------------------------------------------------------------------------- */
function initBlogFeatures() {
  const articlesGrid = document.querySelector('#blogArticlesGrid');
  const modal = document.querySelector('#blogArticleModal');
  if (!articlesGrid && !modal) return;

  const BLOG_ARTICLES = {
    'polenta-vs-grits': {
      title: "Corn Grits vs. Polenta: What's the Real Difference?",
      category: "🍝 Culinary Heritage",
      readTime: "⏱️ 3 Min Read",
      image: "images/applications/italian-polenta.jpg",
      body: `
        <h4>Two Culinary Traditions, One Golden Grain</h4>
        <p>At first glance, coarse yellow corn grits and Italian polenta appear interchangeable. Both are derived from dried, ground maize simmered into a hearty porridge. However, their historical origins, kernel varieties, and cooking mechanics differ significantly.</p>
        <h4>Flint Corn vs. Dent Corn</h4>
        <p>The primary distinction lies in the grain variety. Traditional Italian polenta is milled from <strong>Flint Corn (Zea mays indurata)</strong>, known as <em>Polenta Bramata</em>. Flint corn features a dense, glassy outer starch layer that produces hard, angular granulations that retain an 'al dente' toothsome bite even after prolonged cooking.</p>
        <p>In contrast, classic American Southern grits are crafted from <strong>Dent Corn (Zea mays indentata)</strong>. Dent corn is softer and higher in softer starches, releasing an exceptionally rich, velvety creaminess as it gelatinizes over low heat.</p>
        <div class="blog-takeaways-box">
          <div class="blog-takeaways-title">Key Culinary Takeaways</div>
          <ul class="blog-takeaways-list">
            <li><strong>Texture:</strong> Polenta is toothsome, granular, and firm (ideal for chilling and searing). Grits are creamy, buttery, and soft.</li>
            <li><strong>Best Cut:</strong> Use Grits 101 (Coarse) for rustic stone-ground Southern texture, or Grits 108 (Medium) for creamy bistro polenta.</li>
            <li><strong>Finishing:</strong> Polenta embraces parmesan, olive oil, and herbs; Grits excel with aged cheddar, bacon, and farm butter.</li>
          </ul>
        </div>
      `
    },
    'pizza-crust-dusting': {
      title: "Why Top Pizzerias Dust Crusts With Degermed Corn Grits",
      category: "🍕 Commercial Baking",
      readTime: "⏱️ 3 Min Read",
      image: "images/applications/pizza-crust.jpg",
      body: `
        <h4>The Secret Beneath the Crust</h4>
        <p>From global giants like Domino's and Pizza Hut to artisanal Neapolitan pizzerias, professional pizza makers rarely use raw wheat flour to dust the bottom of dough skins. Instead, they rely on degermed corn grits (specifically Medium Cut Grits 108). Here is why.</p>
        <h4>1. The Ball-Bearing Effect on Oven Peels</h4>
        <p>Corn grits particles are hard and spherical compared to sticky wheat flour. When scattered across dough preparation tables, grits act as microscopic ball bearings. This allows high-hydration dough to slide effortlessly off wooden or metal pizza peels into scorching 500°F+ ovens without tearing or sticking.</p>
        <h4>2. High Thermal Scorching Resistance</h4>
        <p>Wheat flour burns and turns bitter at oven deck temperatures above 450°F, creating acrid smoke and black dust. Corn grits, being dense, low-fat endosperm granules, tolerate high stone-oven heat without burning, roasting instead into aromatic, crunchy golden pearls.</p>
        <div class="blog-takeaways-box">
          <div class="blog-takeaways-title">Key Baking Takeaways</div>
          <ul class="blog-takeaways-list">
            <li><strong>Recommended Cut:</strong> Grits 108 (14–20 Mesh) is the global pizzeria gold standard.</li>
            <li><strong>Moisture Shield:</strong> Grits prevent dough from sticking to delivery cardboard and proofing boxes.</li>
            <li><strong>Signature Bite:</strong> Imparts that blistered rustic crunch beneath every slice.</li>
          </ul>
        </div>
      `
    },
    'sieve-mesh-calibration': {
      title: "Sieve Mesh Calibration: Choosing Between Grits 101, 108 & 112",
      category: "⚙️ Industrial Milling",
      readTime: "⏱️ 4 Min Read",
      image: "images/about-corn-grits.jpg",
      body: `
        <h4>The Science of Grain Fractionation</h4>
        <p>In modern industrial dry milling, yellow maize is cleaned, tempered, dehulled, and degermed to separate pure vitreous endosperm from oil-rich germ and high-fiber bran. The resulting endosperm is fractionated through calibrated rotary plansifters into standardized commercial grades.</p>
        <h4>Commercial Grade Overview</h4>
        <p><strong>Grits 101 (Coarse / Flaking):</strong> Retained between 10 to 14 mesh screens. These large, robust particles are pressure-cooked with malt extract and rolled into breakfast corn flakes or simmered in classic stone-ground polenta.</p>
        <p><strong>Grits 108 (Medium Granulation):</strong> Calibrated between 14 to 20 mesh. The versatile workhorse of the food industry, used in high-shear snack extruders (Cheetos, collets), bakery dustings, and savory coatings.</p>
        <p><strong>Grits 112 (Fine Cut):</strong> Calibrated between 20 to 30 mesh. Designed for rapid 3-minute hydration in instant breakfast porridges, muffin mixes, and batters.</p>
        <div class="blog-takeaways-box">
          <div class="blog-takeaways-title">Industrial Specifications</div>
          <ul class="blog-takeaways-list">
            <li><strong>Moisture:</strong> 12.0% – 14.0% maximum for prolonged shelf stability.</li>
            <li><strong>Fat Content:</strong> Strict &le; 1.0% limit to prevent snack rancidity and extruder die plugging.</li>
            <li><strong>Purity:</strong> 100% Non-GMO degermed endosperm free of black specks and hull fragments.</li>
          </ul>
        </div>
      `
    },
    'brewing-adjuncts': {
      title: "Low-Fat Extraction (≤ 0.8%): The Secret to Crisp Lagers",
      category: "🍺 Brewing Adjuncts",
      readTime: "⏱️ 3 Min Read",
      image: "images/grades/grits-101a.jpg",
      body: `
        <h4>Why Global Breweries Love Corn Grits</h4>
        <p>Commercial breweries worldwide utilize degermed corn grits (Grade 101A) as cereal adjuncts alongside malted barley in the mash tun. Grits provide pure, highly fermentable starches with zero residual vegetal protein, producing lagers celebrated for crispness, clarity, and refreshing drinkability.</p>
        <h4>The Fat Rule: Protecting Beer Foam</h4>
        <p>The single most critical technical metric in brewing grits is fat content. Lipids and corn germ oils are lethal enemies of beer foam; even trace amounts of free oil cause bubbles to coalesce and destroy head retention. Grade 101A is precision-degermed to guarantee fat levels below 0.8% (often &le; 0.6%), preserving a creamy, persistent white foam collar.</p>
        <div class="blog-takeaways-box">
          <div class="blog-takeaways-title">Brewing Advantages</div>
          <ul class="blog-takeaways-list">
            <li><strong>Lighter Body:</strong> Replaces heavy malt dextrins, creating a dry, thirst-quenching finish.</li>
            <li><strong>Crystal Clarity:</strong> Low polyphenol and protein content eliminates cold haze.</li>
            <li><strong>Cost Efficiency:</strong> High starch conversion rate maximizes brewhouse extract yield.</li>
          </ul>
        </div>
      `
    },
    'creamy-grits-ratio': {
      title: "The 4:1 Golden Liquid Ratio for Velvet-Smooth Grits",
      category: "🥣 Kitchen Masterclass",
      readTime: "⏱️ 2 Min Read",
      image: "images/recipes/cheese-grits.jpg",
      body: `
        <h4>The Chef's Golden Equation</h4>
        <p>The most common mistake home cooks and commercial kitchen line chefs make is under-hydrating corn grits. Coarse corn endosperm requires substantial liquid and thermal exposure to fully gelatinize without remaining raw or gritty in the center.</p>
        <h4>The Golden 4:1 Formula</h4>
        <p>Always maintain a strict ratio of <strong>4 parts liquid to 1 part corn grits</strong> (by volume). A balanced 50/50 blend of rich chicken or vegetable broth and whole milk produces optimal savory depth and creamy silkiness.</p>
        <h4>3 Non-Negotiable Rules</h4>
        <p><strong>1. Steady Whisking:</strong> Never dump grits all at once. Sprinkle them into rolling simmering liquid in a thin, continuous stream while whisking vigorously for the first 60 seconds.</p>
        <p><strong>2. Low, Covered Simmer:</strong> Lower heat to minimum and cover tightly for 20–25 minutes. Steam circulation allows starch granules to swell evenly.</p>
        <p><strong>3. Finish With Fat Off the Heat:</strong> Take the pot off the flame before folding in cheese and cold butter. This creates a glossy, stable emulsion that never turns greasy.</p>
        <div class="blog-takeaways-box">
          <div class="blog-takeaways-title">Chef Summary</div>
          <ul class="blog-takeaways-list">
            <li>1 cup Grits 101 + 2 cups Broth + 2 cups Whole Milk + 1/2 tsp Salt.</li>
            <li>Simmer 25 minutes on low flame, stirring every 5 minutes.</li>
            <li>Stir in 1.5 cups aged sharp cheddar and 3 tbsp butter off heat. Serve hot!</li>
          </ul>
        </div>
      `
    }
  };

  // Category Filtering
  const filterPills = document.querySelectorAll('.blog-filter-pill');
  const cards = document.querySelectorAll('.blog-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const filterVal = pill.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Article Reader Modal
  const openArticleModal = (articleId) => {
    const data = BLOG_ARTICLES[articleId];
    if (!data || !modal) return;

    const imgEl = modal.querySelector('#modalArticleImg');
    const catEl = modal.querySelector('#modalArticleCategory');
    const timeEl = modal.querySelector('#modalArticleReadTime');
    const titleEl = modal.querySelector('#modalArticleTitle');
    const contentEl = modal.querySelector('#modalArticleContent');

    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }
    if (catEl) catEl.textContent = data.category;
    if (timeEl) timeEl.textContent = data.readTime;
    if (titleEl) titleEl.textContent = data.title;
    if (contentEl) contentEl.innerHTML = data.body;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeArticleModal = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    if (!document.querySelector('.modal-overlay.is-active')) {
      document.body.style.overflow = '';
    }
  };

  // Bind Read Buttons
  document.querySelectorAll('[data-read-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-read-id');
      openArticleModal(id);
    });
  });

  // Bind Modal Close
  document.querySelectorAll('[data-close-modal="blogArticle"]').forEach(btn => {
    btn.addEventListener('click', closeArticleModal);
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeArticleModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeArticleModal();
    }
  });
}
