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

    // Button Hover Pulse Animation (Social Links Only)
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

  // Get all elements
  const studioSelect = document.getElementById("studio-select");
  const dateSelect = document.getElementById("date-select");
  const timeSlotsContainer = document.getElementById("time-slots-container");
  const bookingsList = document.getElementById("bookings-list");
  const clearAllBtn = document.getElementById("clear-all-bookings");
  const openBookingModalBtn = document.getElementById("open-booking-modal-btn");

  // Modal Elements
  const bookingModal = new bootstrap.Modal(document.getElementById("bookingConfirmationModal"));
  const confirmBookingBtn = document.getElementById("confirm-booking-btn");
  const modalConfirmStudio = document.getElementById("modal-confirm-studio");
  const modalConfirmDate = document.getElementById("modal-confirm-date");
  const modalConfirmTime = document.getElementById("modal-confirm-time");
  const modalConfirmName = document.getElementById("modal-confirm-name");
  const modalConfirmEmail = document.getElementById("modal-confirm-email");
  const modalConfirmContact = document.getElementById("modal-confirm-contact");
  const modalConfirmPurpose = document.getElementById("modal-confirm-purpose");

  const STORAGE_KEY = "echoSpaceBookings";
  let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  let tempBookingDetails = {}; // To hold details before confirmation

  // 3-hour time slots
  const availableTimes = ["09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 21:00"];

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function renderBookingSummary() {
    bookingsList.innerHTML = "";
    let hasBookings = false;

    Object.keys(bookings)
      .sort()
      .forEach((date) => {
        const dateBookings = bookings[date];
        if (!dateBookings) return;

        Object.keys(dateBookings).forEach((studio) => {
          if (dateBookings[studio] && dateBookings[studio].length > 0) {
            hasBookings = true;
            dateBookings[studio].forEach((booking) => {
              const li = document.createElement("li");
              li.innerHTML = `
                            <strong>${booking.time}</strong> on ${date} <br>
                            Studio: ${studio} <br>
                            Name: ${booking.name} (${booking.email})
                        `;
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
    timeSlotsContainer.innerHTML = "";

    // Reset button and temp selection when re-rendering slots
    openBookingModalBtn.disabled = true;
    tempBookingDetails = {};

    if (!selectedDate) {
      timeSlotsContainer.innerHTML = '<p class="text-secondary">Please select a date first.</p>';
      return;
    }

    const dayBookings = bookings[selectedDate]?.[selectedStudio] || [];
    const bookedTimes = dayBookings.map((booking) => booking.time);

    availableTimes.forEach((time) => {
      const slot = document.createElement("div");
      slot.classList.add("time-slot");
      slot.textContent = time;
      slot.dataset.time = time;

      if (bookedTimes.includes(time)) {
        slot.classList.add("booked");
      } else {
        slot.classList.add("available");
      }

      timeSlotsContainer.appendChild(slot);
    });
  }

  // Click handler just selects a slot
  function handleTimeSlotClick(e) {
    if (!e.target.classList.contains("time-slot") || e.target.classList.contains("booked")) {
      return;
    }

    // Remove 'selected' from any other slot
    const allSlots = timeSlotsContainer.querySelectorAll(".time-slot");
    allSlots.forEach((slot) => slot.classList.remove("selected"));

    // Add 'selected' to the clicked slot
    e.target.classList.add("selected");

    // Store details temporarily
    tempBookingDetails = {
      studio: studioSelect.value,
      date: dateSelect.value,
      time: e.target.dataset.time,
    };

    // Enable the "Book Now" button
    openBookingModalBtn.disabled = false;
  }

  // Function to open the modal
  function handleOpenModal() {
    if (!tempBookingDetails.time) {
      alert("Something went wrong. Please select a time slot.");
      return;
    }

    // Populate and show the modal
    modalConfirmStudio.value = tempBookingDetails.studio;
    modalConfirmDate.value = tempBookingDetails.date;
    modalConfirmTime.value = tempBookingDetails.time;
    // Clear old values
    modalConfirmName.value = "";
    modalConfirmEmail.value = "";
    modalConfirmContact.value = "";
    modalConfirmPurpose.value = "";

    bookingModal.show();
  }

  function confirmBooking() {
    const { studio, date, time } = tempBookingDetails;
    const name = modalConfirmName.value;
    const email = modalConfirmEmail.value;
    const contact = modalConfirmContact.value;
    const purpose = modalConfirmPurpose.value;

    // Validation
    if (!name || !email || !contact) {
      alert("Please fill in your Name, Email, and Contact No.");
      return;
    }

    if (!bookings[date]) bookings[date] = {};
    if (!bookings[date][studio]) bookings[date][studio] = [];

    // Add the new booking object
    bookings[date][studio].push({
      time: time,
      name: name,
      email: email,
      contact: contact,
      purpose: purpose,
    });

    saveBookings();
    renderTimeSlots(); // This will re-render slots, disabling the button
    renderBookingSummary();

    bookingModal.hide();
    tempBookingDetails = {}; // Clear temp details
  }

  function initBookingSystem() {
    const today = new Date().toISOString().split("T")[0];
    dateSelect.value = today;
    dateSelect.min = today;

    // Main Listeners
    studioSelect.addEventListener("change", renderTimeSlots);
    dateSelect.addEventListener("change", renderTimeSlots);
    timeSlotsContainer.addEventListener("click", handleTimeSlotClick);

    // Listener for the "Book Now" button
    openBookingModalBtn.addEventListener("click", handleOpenModal);

    // Modal book button listener
    confirmBookingBtn.addEventListener("click", confirmBooking);

    // Clear All button listener
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear ALL bookings? This cannot be undone.")) {
        bookings = {};
        saveBookings();
        renderTimeSlots();
        renderBookingSummary();
      }
    });

    // Initial render
    renderTimeSlots();
    renderBookingSummary();
  }
  // --- 5. Fix Modal Scroll Bug ---
  function initModalBookButtons() {
    const bookButtons = document.querySelectorAll(".btn-book-from-modal");

    bookButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // 1. Find the modal this button is inside
        const modalElement = button.closest(".modal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);

        // 2. Manually hide the modal
        if (modalInstance) {
          modalInstance.hide();
        }

        // 3. Manually scroll to the booking section
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
          // We use a small delay to ensure the modal is closing first
          setTimeout(() => {
            bookingSection.scrollIntoView({ behavior: "smooth" });
          }, 300); // A 100ms delay is usually enough
        }
      });
    });
  }

  // --- Initialize All Systems ---
  initGsapAnimations();
  initSmoothScroll();
  initBookingSystem();
  initModalBookButtons();
});
