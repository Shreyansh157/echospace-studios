document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  gsap.registerPlugin(ScrollTrigger);

  // --- 1. GSAP Animations ---

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
          start: "top 80%", // Start animation when 80% of the viewport is reached
        },
      });
    });

    // Studio Card Entrance
    // gsap.from(".studio-card", {
    //   scale: 0.8,
    //   opacity: 0,
    //   stagger: 0.2,
    //   duration: 0.7,
    //   ease: "back.out(1.7)",
    //   scrollTrigger: {
    //     trigger: "#studios",
    //     start: "top 70%",
    //   },
    // });

    // Button Hover Pulse Animation
    const socialLinks = gsap.utils.toArray(".social-links a");
    socialLinks.forEach((link) => {
      const pulse = gsap.to(link, {
        scale: 1.1, // A little more pulse for icons
        duration: 0.3,
        ease: "power1.inOut",
        paused: true,
      });

      link.addEventListener("mouseenter", () => pulse.play());
      link.addEventListener("mouseleave", () => pulse.reverse());
    });
  }

  // --- 2. Smooth Scroll ---

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

  // --- 3. Booking System (LocalStorage) ---

  const studioSelect = document.getElementById("studio-select");
  const dateSelect = document.getElementById("date-select");
  const timeSlotsContainer = document.getElementById("time-slots-container");
  const bookingsList = document.getElementById("bookings-list");

  const STORAGE_KEY = "echoSpaceBookings";
  let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function renderBookingSummary() {
    bookingsList.innerHTML = ""; // Clear list

    let hasBookings = false;
    // Sort bookings by date
    const sortedDates = Object.keys(bookings).sort();

    sortedDates.forEach((date) => {
      const dateBookings = bookings[date];
      if (!dateBookings) return;

      Object.keys(dateBookings).forEach((studio) => {
        if (dateBookings[studio] && dateBookings[studio].length > 0) {
          hasBookings = true;
          dateBookings[studio].forEach((time) => {
            const li = document.createElement("li");
            li.textContent = `${studio} on ${date} at ${time}`;
            bookingsList.appendChild(li);
          });
        }
      });
    });

    if (!hasBookings) {
      bookingsList.innerHTML = "<li>No bookings yet.</li>";
    }
  }

  function renderTimeSlots() {
    const selectedStudio = studioSelect.value;
    const selectedDate = dateSelect.value;
    timeSlotsContainer.innerHTML = ""; // Clear slots

    if (!selectedDate) {
      timeSlotsContainer.innerHTML = '<p class_="text-secondary">Please select a date first.</p>';
      return;
    }

    const dayBookings = bookings[selectedDate]?.[selectedStudio] || [];

    availableTimes.forEach((time) => {
      const slot = document.createElement("div");
      slot.classList.add("time-slot");
      slot.textContent = time;
      slot.dataset.time = time;

      if (dayBookings.includes(time)) {
        slot.classList.add("booked");
      } else {
        slot.classList.add("available");
      }

      timeSlotsContainer.appendChild(slot);
    });
  }

  function handleTimeSlotClick(e) {
    if (!e.target.classList.contains("time-slot") || e.target.classList.contains("booked")) {
      return; // Do nothing if not a slot or already booked
    }

    const selectedStudio = studioSelect.value;
    const selectedDate = dateSelect.value;
    const selectedTime = e.target.dataset.time;

    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    // Initialize data structure if not present
    if (!bookings[selectedDate]) {
      bookings[selectedDate] = {};
    }
    if (!bookings[selectedDate][selectedStudio]) {
      bookings[selectedDate][selectedStudio] = [];
    }

    // Add booking
    bookings[selectedDate][selectedStudio].push(selectedTime);

    // Save and re-render
    saveBookings();
    renderTimeSlots();
    renderBookingSummary();
  }

  function initBookingSystem() {
    // Set date input to today by default
    const today = new Date().toISOString().split("T")[0];
    dateSelect.value = today;
    dateSelect.min = today; // Prevent booking past dates

    // Add event listeners
    studioSelect.addEventListener("change", renderTimeSlots);
    dateSelect.addEventListener("change", renderTimeSlots);
    timeSlotsContainer.addEventListener("click", handleTimeSlotClick);

    // Initial render
    renderTimeSlots();
    renderBookingSummary();
  }

  // --- 4. Dynamic Modal Content ---

  // --- Initialize All Systems ---
  initGsapAnimations();
  initSmoothScroll();
  initBookingSystem();
});
