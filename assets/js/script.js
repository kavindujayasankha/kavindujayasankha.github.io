'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
// add click event to all modal items (only if modal markup exists)
if (testimonialsItem.length > 0 && modalContainer && modalCloseBtn && overlay && modalImg && modalTitle && modalText) {

  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (avatar && modalImg) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || '';
      }

      if (title && modalTitle) modalTitle.innerHTML = title.innerHTML;
      if (text && modalText) modalText.innerHTML = text.innerHTML;

      testimonialsModalFunc();

    });

  }

  // add click event to modal close button and overlay
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);

} else {
  // If there's no testimonials/modal markup, ensure we don't try to attach listeners and
  // avoid throwing errors that would prevent the rest of the script from running.
}



// Category filter/select UI removed per request; no filtering JS required.



// Contact form logic with EmailJS
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");
  const formStatus = document.querySelector('.form-status');

  // Function to check form validity and toggle button state
  const checkFormValidity = () => {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  };

  // Add event listener to all form input fields
  formInputs.forEach(input => {
    input.addEventListener("input", checkFormValidity);
  });

  // Initialize EmailJS with your public key
  emailjs.init('_CJet1nP8kkQdESRU');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formBtn.textContent = 'Sending...';

    emailjs.sendForm('service_5h5a0e9', 'template_uelu0om', this)
      .then(function () {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.style.color = 'var(--orange-yellow-crayola)';
        form.reset();
      }, function (error) {
        formStatus.textContent = 'Failed to send message. Please try again.';
        formStatus.style.color = 'var(--bittersweet-shimmer)';
        console.log('FAILED...', error);
      }).finally(function() {
        formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
        checkFormValidity(); // Re-disable button after submission
      });
  });
});

// Legacy nav handler removed; current DOMContentLoaded handler below handles navigation reliably.

document.addEventListener('DOMContentLoaded', function () {
  try {
    // Nav / page switcher - robust: prefers explicit data-target or data-page, falls back to button text
    const navButtons = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');

    function clearActive() {
      navButtons.forEach(btn => btn.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));
    }

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetPage = button.textContent.toLowerCase();
        let pageFound = false;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          if (page.dataset.page === targetPage) {
            // Deactivate all pages and nav links
            for (let j = 0; j < pages.length; j++) {
              pages[j].classList.remove("active");
              navButtons[j].classList.remove("active");
            }
            // Activate the clicked link and corresponding page
            page.classList.add("active");
            button.classList.add("active");
            window.scrollTo(0, 0);
            pageFound = true;
            break;
          }
        }
        if (!pageFound) {
          console.warn(`No page found for nav target "${targetPage}"`);
          return;
        }

      });
    });
  } catch (err) {
    console.error('Nav handler initialization failed:', err);
  }
});