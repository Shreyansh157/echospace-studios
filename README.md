# EchoSpace Studios Website

This is a complete, multi-page frontend website for "EchoSpace Studios," a creative music studio rental company. The project features a fully responsive, artistic, neon-themed design, built from scratch with HTML, CSS, and modern JavaScript.

The site is fully responsive and includes several dynamic, JavaScript-powered features, such as a custom booking system that saves to LocalStorage and a dynamic blog templating system.

## Key Features

- **7-Page Responsive Website:** A full site including Home, About, Services, Gallery, Blog (List), Blog Post (Template), and a dedicated Booking page.
- **Custom Booking System:**
  - A from-scratch, custom-built JavaScript calendar (no libraries).
  - Navigation is limited to the next 3 months.
  - All past dates are disabled, fixing the past-booking bug.
  - Dynamic time-slot rendering based on selected studio and date.
  - Saves all confirmed bookings to **`LocalStorage`**.
  - A booking summary panel that updates in real-time.
- **Dynamic JS-Powered Blog:**
  - Blog posts are stored in a central `assets/js/blog-content.js` file (a simple "database").
  - The `blog-post.html` page is a template that dynamically loads content based on a URL parameter (e.g., `?post=mixing-tips`).
- **Advanced Animations & UX:**
  - Subtle page-reveal animations on scroll using **GSAP (GreenSock)**.
  - A custom "aurora" cursor shadow that follows the mouse, built with CSS and GSAP.
  - A "Scroll to Top" button that appears on scroll.
- **Component-Based Modals:**
  - Dynamic modals for Studio, Service, and Gallery items.
  - A multi-step booking confirmation modal that collects user data.
  - A "Booking Confirmed" success pop-up.
- **Clean File Structure:** Organized with separate CSS and JS files for global styles (`style.css`), shared components (`components.css`), and each specific page (`home.css`, `booking.js`, etc.).

---

## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5**
- **GSAP (GreenSock)**
- **Bootstrap Icons**

---

## File Structure
