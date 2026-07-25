/* =========================================================
   Cozy Corner Bookstore — script.js
   Shared external JavaScript file, linked from every page.
   Each block checks that its target elements exist before
   running, so the same file works everywhere with no errors.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. WELCOME MESSAGE (Home page)
     Prompt the visitor for their name once, remember it for
     next time, and show a personalised greeting.
     --------------------------------------------------------- */
  var welcomeEl = document.getElementById('welcome-message');
  if (welcomeEl) {
    var storedName = localStorage.getItem('cc_visitor_name');

    if (!storedName) {
      var typed = window.prompt('Welcome to Cozy Corner Bookstore! What is your name?');
      if (typed && typed.trim() !== '') {
        storedName = typed.trim();
        localStorage.setItem('cc_visitor_name', storedName);
      }
    }

    welcomeEl.textContent = storedName
      ? '👋 Welcome back, ' + storedName + '! Glad to see you again at Cozy Corner.'
      : '👋 Welcome, book lover! Feel free to browse our shelves.';
  }

  /* ---------------------------------------------------------
     2. FORM VALIDATION (Contact page)
     Every required field must be filled in before the form
     "submits". Clear, specific error messages are shown next
     to each field, plus a summary banner.
     --------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var statusBox = document.getElementById('formStatus');

    var fields = {
      name: {
        input: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: function (value) {
          if (value.trim() === '') return 'Please enter your full name.';
          if (value.trim().length < 2) return 'Your name looks too short.';
          return '';
        }
      },
      email: {
        input: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: function (value) {
          if (value.trim() === '') return 'Please enter your email address.';
          var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
          return '';
        }
      },
      message: {
        input: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: function (value) {
          if (value.trim() === '') return 'Please tell us a little about your order or question.';
          return '';
        }
      }
    };

    function validateField(key) {
      var field = fields[key];
      var msg = field.validate(field.input.value);
      if (msg) {
        field.input.classList.add('field-error');
        field.error.textContent = msg;
      } else {
        field.input.classList.remove('field-error');
        field.error.textContent = '';
      }
      return msg === '';
    }

    // Live validation as the visitor types/leaves a field
    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener('blur', function () {
        validateField(key);
      });
      fields[key].input.addEventListener('input', function () {
        if (fields[key].input.classList.contains('field-error')) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var allValid = true;
      Object.keys(fields).forEach(function (key) {
        if (!validateField(key)) allValid = false;
      });

      if (!allValid) {
        statusBox.textContent = '⚠️ Please fix the highlighted fields before sending your message.';
        statusBox.className = 'error';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var name = fields.name.input.value.trim();
      statusBox.textContent = '✅ Thank you, ' + name + '! Your message has been sent — we will get back to you soon.';
      statusBox.className = 'success';
      contactForm.reset();
      Object.keys(fields).forEach(function (key) {
        fields[key].input.classList.remove('field-error');
        fields[key].error.textContent = '';
      });
    });

    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        Object.keys(fields).forEach(function (key) {
          fields[key].input.classList.remove('field-error');
          fields[key].error.textContent = '';
        });
        statusBox.className = '';
        statusBox.textContent = '';
      });
    }
  }

  /* ---------------------------------------------------------
     3a. DYNAMIC CONTENT — Home page
     Show/hide the bestseller list, and toggle a dark theme.
     --------------------------------------------------------- */
  var toggleBestBtn = document.getElementById('toggleBestsellers');
  var bestsellerList = document.getElementById('bestsellerList');
  if (toggleBestBtn && bestsellerList) {
    toggleBestBtn.addEventListener('click', function () {
      var hidden = bestsellerList.style.display === 'none';
      bestsellerList.style.display = hidden ? '' : 'none';
      toggleBestBtn.textContent = hidden ? 'Hide bestsellers' : 'Show bestsellers';
    });
  }

  var themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    if (localStorage.getItem('cc_theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
    themeToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      var isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('cc_theme', isDark ? 'dark' : 'light');
      themeToggleBtn.textContent = isDark ? '☀️ Toggle Light Mode' : '🌙 Toggle Dark Mode';
    });
  }

  /* ---------------------------------------------------------
     3b. DYNAMIC CONTENT — Catalog page
     "View" buttons reveal a short description for each book.
     --------------------------------------------------------- */
  var detailButtons = document.querySelectorAll('.details-btn');
  if (detailButtons.length > 0) {
    detailButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('tr').nextElementSibling;
        if (!row || !row.classList.contains('details-row')) return;
        var isOpen = row.classList.toggle('open');
        btn.textContent = isOpen ? 'Hide' : 'View';
      });
    });
  }

  /* ---------------------------------------------------------
     3c. DYNAMIC CONTENT — Gallery page
     Tap-to-flip cards (for touch devices) and a like counter
     with a confirmation change on each like button.
     --------------------------------------------------------- */
  var flipCards = document.querySelectorAll('.flip-card');
  if (flipCards.length > 0) {
    flipCards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        // Don't flip the card back when the like button itself is tapped
        if (event.target.classList.contains('like-btn')) return;
        card.classList.toggle('flipped');
      });
    });
  }

  var likeButtons = document.querySelectorAll('.like-btn');
  var likeCounter = document.getElementById('likeCounter');
  if (likeButtons.length > 0 && likeCounter) {
    var totalLikes = parseInt(localStorage.getItem('cc_gallery_likes') || '0', 10);
    likeCounter.textContent = '❤️ Total likes: ' + totalLikes;

    likeButtons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        var alreadyLiked = btn.classList.contains('liked');
        if (alreadyLiked) {
          btn.classList.remove('liked');
          btn.textContent = '🤍 Like';
          totalLikes = Math.max(0, totalLikes - 1);
        } else {
          btn.classList.add('liked');
          btn.textContent = '❤️ Liked!';
          totalLikes += 1;
        }
        localStorage.setItem('cc_gallery_likes', String(totalLikes));
        likeCounter.textContent = '❤️ Total likes: ' + totalLikes;
      });
    });
  }

});