document.addEventListener("DOMContentLoaded", () => {
  // --- Fix Modal Scroll Bug ---
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
          }, 300);
        }
      });
    });
  }
  // --- Initialize All Systems ---
  initModalBookButtons();
});
