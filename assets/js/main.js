// Load all components
document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  gsap.registerPlugin(ScrollTrigger);

  // --- GSAP Animations ---
  function initGsapAnimations() {
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

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll(".nav-link, .btn, .footer-links a").forEach((anchor) => {
      if (anchor.hash) {
        anchor.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      }
    });
  }

  // --- Initialize All Systems ---
  initGsapAnimations();
  initSmoothScroll();
});
