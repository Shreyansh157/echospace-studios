document.addEventListener("DOMContentLoaded", () => {
  // --- Booking System (LocalStorage) ---

  // Get all elements
  const studioContainer = document.getElementById("studio-selection-container");

  // NEW Calendar elements
  const monthYearEl = document.getElementById("calendar-month-year");
  const daysGridEl = document.getElementById("calendar-days-grid");
  const prevMonthBtn = document.getElementById("calendar-prev");
  const nextMonthBtn = document.getElementById("calendar-next");

  const timeSlotsContainer = document.getElementById("time-slots-container");
  const summaryList = document.getElementById("summary-list");
  const bookingsList = document.getElementById("bookings-list");
  const clearAllBtn = document.getElementById("clear-all-bookings");
  const openBookingModalBtn = document.getElementById("open-booking-modal-btn");

  // Modal Elements
  const bookingModal = new bootstrap.Modal(document.getElementById("bookingConfirmationModal"));
  const confirmBookingBtn = document.getElementById("confirm-booking-btn");
  const successModal = new bootstrap.Modal(document.getElementById("bookingSuccessModal"));
  const modalConfirmStudio = document.getElementById("modal-confirm-studio");
  const modalConfirmDate = document.getElementById("modal-confirm-date");
  const modalConfirmTime = document.getElementById("modal-confirm-time");
  const modalConfirmName = document.getElementById("modal-confirm-name");
  const modalConfirmEmail = document.getElementById("modal-confirm-email");
  const modalConfirmContact = document.getElementById("modal-confirm-contact");
  const modalConfirmPurpose = document.getElementById("modal-confirm-purpose");

  const STORAGE_KEY = "echoSpaceBookings";
  let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  let currentSelection = {
    studio: null,
    date: null,
    time: null,
  };

  // --- Calendar Logic ---
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  let navDate = new Date(today); // This is the date we use for navigation

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 2); // Set max navigation to 3 months (Current, +1, +2)

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

  function renderCalendar() {
    navDate.setDate(1); // Start logic from the 1st of the month

    const month = navDate.getMonth();
    const year = navDate.getFullYear();

    monthYearEl.textContent = monthFormatter.format(navDate); // "November 2025"
    daysGridEl.innerHTML = ""; // Clear old days

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = navDate.getDay(); // 0 (Sun) - 6 (Sat)

    // 1. Add empty cells for offset
    for (let i = 0; i < startDayIndex; i++) {
      daysGridEl.innerHTML += `<div class="day-cell empty"></div>`;
    }

    // 2. Add day cells
    for (let i = 1; i <= daysInMonth; i++) {
      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = i;

      const cellDate = new Date(year, month, i);

      // --- THIS IS THE FIX ---
      // We manually build the YYYY-MM-DD string to avoid timezone conversion
      const formattedMonth = (month + 1).toString().padStart(2, "0");
      const formattedDay = i.toString().padStart(2, "0");
      const cellDateString = `${year}-${formattedMonth}-${formattedDay}`;
      // --- END FIX ---

      cell.dataset.date = cellDateString;

      // 3. Check states
      if (cellDate < today) {
        cell.classList.add("past-date");
      } else {
        cell.classList.add("available");
      }

      if (cellDateString === currentSelection.date) {
        cell.classList.add("selected");
      }

      daysGridEl.appendChild(cell);
    }

    // 4. Update nav button states
    prevMonthBtn.disabled = navDate.getMonth() === today.getMonth() && navDate.getFullYear() === today.getFullYear();
    nextMonthBtn.disabled = navDate.getMonth() === maxDate.getMonth() && navDate.getFullYear() === maxDate.getFullYear();
  }

  // --- Calendar Nav Listeners ---
  prevMonthBtn.addEventListener("click", () => {
    navDate.setMonth(navDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    navDate.setMonth(navDate.getMonth() + 1);
    renderCalendar();
  });

  // --- Calendar Day Click Listener ---
  daysGridEl.addEventListener("click", (e) => {
    const cell = e.target.closest(".day-cell.available");
    if (!cell) return; // Clicked on empty or past date

    // Remove selected from all
    daysGridEl.querySelectorAll(".day-cell").forEach((c) => c.classList.remove("selected"));

    // Add selected to clicked
    cell.classList.add("selected");

    currentSelection.date = cell.dataset.date;
    currentSelection.time = null; // Reset time
    updateUI();
  });

  // --- (The rest of the file is the same) ---

  const availableTimes = ["09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 21:00"];

  studioContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".studio-select-card");
    if (!card) return;
    studioContainer.querySelectorAll(".studio-select-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    currentSelection.studio = card.dataset.studioName;
    currentSelection.time = null;
    updateUI();
  });

  timeSlotsContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("time-slot") || e.target.classList.contains("booked")) {
      return;
    }
    timeSlotsContainer.querySelectorAll(".time-slot").forEach((slot) => slot.classList.remove("selected"));
    e.target.classList.add("selected");
    currentSelection.time = e.target.dataset.time;
    updateUI();
  });

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function updateUI() {
    renderTimeSlots();
    renderSummary();
    checkBookButton();
  }

  function renderSummary() {
    summaryList.innerHTML = "";
    if (currentSelection.studio) {
      summaryList.innerHTML += `<li>Studio: <strong>${currentSelection.studio.split("(")[0]}</strong></li>`;
    }
    if (currentSelection.date) {
      summaryList.innerHTML += `<li>Date: <strong>${currentSelection.date}</strong></li>`;
    }
    if (currentSelection.time) {
      summaryList.innerHTML += `<li>Time: <strong>${currentSelection.time}</strong></li>`;
    }
    if (!currentSelection.studio && !currentSelection.date && !currentSelection.time) {
      summaryList.innerHTML = "<li>Please make your selections.</li>";
    }
  }

  function checkBookButton() {
    if (currentSelection.studio && currentSelection.date && currentSelection.time) {
      openBookingModalBtn.disabled = false;
    } else {
      openBookingModalBtn.disabled = true;
    }
  }

  function renderBookingSummaryList() {
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
    timeSlotsContainer.innerHTML = "";
    if (!currentSelection.studio || !currentSelection.date) {
      timeSlotsContainer.innerHTML = '<p class="text-secondary">Please select a studio and a date to see available times.</p>';
      return;
    }

    // BUG FIX CHECK: Double-check if date is in the past
    // We create a date from the string, which will be local midnight
    const selectedCalDate = new Date(currentSelection.date + "T00:00:00");
    if (selectedCalDate < today) {
      timeSlotsContainer.innerHTML = '<p class="text-danger">You cannot book a time in the past.</p>';
      return;
    }

    const dayBookings = bookings[currentSelection.date]?.[currentSelection.studio] || [];
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
        if (time === currentSelection.time) {
          slot.classList.add("selected");
        }
      }
      timeSlotsContainer.appendChild(slot);
    });
  }

  function handleOpenModal() {
    modalConfirmStudio.value = currentSelection.studio;
    modalConfirmDate.value = currentSelection.date;
    modalConfirmTime.value = currentSelection.time;
    modalConfirmName.value = "";
    modalConfirmEmail.value = "";
    modalConfirmContact.value = "";
    modalConfirmPurpose.value = "";
    bookingModal.show();
  }

  function confirmBooking() {
    const { studio, date, time } = currentSelection;
    const name = modalConfirmName.value;
    const email = modalConfirmEmail.value;
    const contact = modalConfirmContact.value;
    const purpose = modalConfirmPurpose.value;

    if (!name || !email || !contact) {
      alert("Please fill in your Name, Email, and Contact No.");
      return;
    }

    if (!bookings[date]) bookings[date] = {};
    if (!bookings[date][studio]) bookings[date][studio] = [];

    bookings[date][studio].push({
      time: time,
      name: name,
      email: email,
      contact: contact,
      purpose: purpose,
    });

    saveBookings();
    currentSelection.time = null;
    updateUI();
    renderBookingSummaryList();

    // Hide the form modal
    bookingModal.hide();

    // NEW: Show the success modal
    successModal.show();
  }

  function initBookingPage() {
    // Listeners
    openBookingModalBtn.addEventListener("click", handleOpenModal);
    confirmBookingBtn.addEventListener("click", confirmBooking);
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear ALL bookings? This cannot be undone.")) {
        bookings = {};
        saveBookings();
        renderCalendar(); // Re-render calendar
        updateUI();
        renderBookingSummaryList();
      }
    });

    // Initial Render
    renderCalendar(); // Render the new calendar
    renderSummary();
    renderBookingSummaryList();

    // Set 'today' as the default selection
    // --- TIMEZONE BUG FIX ---
    // const todayString = today.toISOString().split('T')[0]; // OLD BUGGY CODE
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const todayString = `${year}-${month}-${day}`; // NEW FIXED CODE
    // --- END FIX ---

    const todayCell = daysGridEl.querySelector(`[data-date="${todayString}"]`);
    if (todayCell) {
      todayCell.classList.add("selected");
      currentSelection.date = todayString;
    }

    updateUI(); // Call this to render time slots for the default date
  }
  initBookingPage();
});
