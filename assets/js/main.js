document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Gallery Modal Logic ---
  function initGalleryModal() {
    const galleryModal = document.getElementById("galleryModal");
    if (galleryModal) {
      galleryModal.addEventListener("show.bs.modal", (event) => {
        const triggerLink = event.relatedTarget;
        if (!triggerLink) return;
        const imgSrc = triggerLink.getAttribute("data-img-src");
        const modalImage = galleryModal.querySelector(".gallery-modal-img");
        if (modalImage) {
          modalImage.src = imgSrc;
        }
      });
    }
  }

  // --- 2. GSAP Animations ---
  function initGsapAnimations() {
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade-in & Stagger
    gsap.from(".hero-content > *", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.5,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Navbar Scroll Color Change
    ScrollTrigger.create({
      trigger: "body",
      start: "top -50px",
      end: "top -50px",
      onEnter: () => document.getElementById("mainNavbar").classList.add("scrolled"),
      onLeaveBack: () => document.getElementById("mainNavbar").classList.remove("scrolled"),
    });

    // Section Reveals
    gsap.utils.toArray(".section-reveal").forEach((section) => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    });

    // Button Hover Pulse Animation (Social Links Only)
    const socialLinks = gsap.utils.toArray(".social-links a");
    socialLinks.forEach((link) => {
      const pulse = gsap.to(link, {
        scale: 1.1,
        duration: 0.3,
        ease: "power1.inOut",
        paused: true,
      });

      link.addEventListener("mouseenter", () => pulse.play());
      link.addEventListener("mouseleave", () => pulse.reverse());
    });
  }

  // --- 3. Smooth Scroll ---
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      // Find the closest link with a hash
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor && anchor.hash) {
        // Check if the link is on the same page
        const currentPath = window.location.pathname.replace(/\/$/, "");
        const linkPath = anchor.pathname.replace(/\/$/, "");

        // Only scroll if it's a same-page link
        if (currentPath === linkPath) {
          const targetId = anchor.hash;
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    });
  }

  // --- 4. Custom Cursor Shadow ---
  function initCustomCursor() {
    // Create the shadow element
    const cursorShadow = document.createElement("div");
    cursorShadow.id = "cursor-shadow";
    document.body.appendChild(cursorShadow);

    // Use GSAP for smooth following
    window.addEventListener("mousemove", (e) => {
      gsap.to(cursorShadow, {
        duration: 0.7, // A bit of a "lag"
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out",
      });
    });
  }

  // --- Initialize All Systems ---
  initCustomCursor();
  initGalleryModal();
  initGsapAnimations();
  initSmoothScroll();
});
