(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primaryNav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = nav ? nav.querySelectorAll("a") : [];
  var form = document.getElementById("enquiryForm");
  var status = document.getElementById("enquiryStatus");
  var year = document.getElementById("year");
  var WHATSAPP_NUMBER = "263782229488";

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Header state on scroll */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* Mobile navigation */
  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      setNav(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1000) setNav(false);
    });
  }

  /* Scroll reveal */
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* Keep the floating chat control clear of the footer */
  var footer = document.querySelector(".footer");
  var waFloat = document.querySelector(".wa-float");

  if (footer && waFloat && "IntersectionObserver" in window) {
    var footerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          waFloat.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.08 }
    );

    footerObserver.observe(footer);
  }

  /* Enquiry form → WhatsApp */
  if (form) {    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.textContent = "Please complete the required fields above.";
          status.classList.add("is-error");
        }
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var interest = String(data.get("interest") || "").trim();
      var message = String(data.get("message") || "").trim();

      var lines = [
        "Hello Caroll, my name is " + name + ".",
        "I'm interested in: " + interest + ".",
        "My contact number is " + phone + "."
      ];

      if (message) {
        lines.push("", message);
      }

      var url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(lines.join("\n"));

      if (status) {
        status.classList.remove("is-error");
        status.textContent = "Opening WhatsApp with your message…";
      }

      var opened = window.open(url, "_blank", "noopener");
      if (!opened) {
        window.location.href = url;
      }
    });
  }
})();
