"use strict";

import millenniumImage from "../assets/images/millennium-park.jpg";
import riverwalkImage from "../assets/images/riverwalk.jpg";
import lakefrontImage from "../assets/images/lakefront.jpg";
import loopImage from "../assets/images/the-loop.jpg";
import wickerImage from "../assets/images/wicker-park.jpg";

const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector("#menuToggle");
const navigationLinks = Array.from(document.querySelectorAll(".nav-links a"));
const scrollLinks = Array.from(document.querySelectorAll("[data-scroll]"));
const navigationSections = Array.from(
  document.querySelectorAll("[data-nav-section]")
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let scrollFrameRequested = false;

const closeMenu = () => {
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
};

menuToggle.addEventListener("click", () => {
  const willOpen = !header.classList.contains("menu-open");
  header.classList.toggle("menu-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute(
    "aria-label",
    willOpen ? "Close navigation" : "Open navigation"
  );
});

scrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();

    const headerOffset = header.getBoundingClientRect().height;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
});

const setActiveNavigation = (sectionId) => {
  navigationLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isCurrent);

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updatePagePosition = () => {
  const scrollTop = window.scrollY;
  const headerBottom = header.getBoundingClientRect().height + 2;
  const pageBottomReached =
    Math.ceil(scrollTop + window.innerHeight) >=
    document.documentElement.scrollHeight - 2;

  header.classList.toggle("is-compact", scrollTop > 36);

  let currentSection = navigationSections[0].id;

  navigationSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerBottom) {
      currentSection = section.id;
    }
  });

  if (pageBottomReached) {
    currentSection = navigationSections[navigationSections.length - 1].id;
  }

  setActiveNavigation(currentSection);
  scrollFrameRequested = false;
};

const requestPositionUpdate = () => {
  if (!scrollFrameRequested) {
    window.requestAnimationFrame(updatePagePosition);
    scrollFrameRequested = true;
  }
};

window.addEventListener("scroll", requestPositionUpdate, { passive: true });
window.addEventListener("resize", () => {
  closeMenu();
  requestPositionUpdate();
});

// Carousel
const carousel = document.querySelector("#cityCarousel");
const carouselTrack = document.querySelector("#carouselTrack");
const carouselSlides = Array.from(carouselTrack.children);
const carouselDots = Array.from(document.querySelectorAll("[data-slide]"));
const currentSlideLabel = document.querySelector("#currentSlide");
const previousSlideButton = document.querySelector("#previousSlide");
const nextSlideButton = document.querySelector("#nextSlide");

let activeSlide = 0;
let pointerStartX = null;

const showSlide = (slideIndex) => {
  activeSlide = (slideIndex + carouselSlides.length) % carouselSlides.length;
  carouselTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
  currentSlideLabel.textContent = String(activeSlide + 1).padStart(2, "0");

  carouselSlides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== activeSlide));
  });

  carouselDots.forEach((dot, index) => {
    const isCurrent = index === activeSlide;
    dot.classList.toggle("is-active", isCurrent);

    if (isCurrent) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
};

previousSlideButton.addEventListener("click", () => showSlide(activeSlide - 1));
nextSlideButton.addEventListener("click", () => showSlide(activeSlide + 1));

carouselDots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide)));
});

carousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showSlide(activeSlide - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showSlide(activeSlide + 1);
  }
});

carousel.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
});

carousel.addEventListener("pointerup", (event) => {
  if (pointerStartX === null) {
    return;
  }

  const horizontalDistance = event.clientX - pointerStartX;
  pointerStartX = null;

  if (Math.abs(horizontalDistance) < 55) {
    return;
  }

  showSlide(activeSlide + (horizontalDistance < 0 ? 1 : -1));
});

// Modal
const placeDetails = {
  millennium: {
    kicker: "01 · Downtown",
    title: "Millennium Park",
    image: millenniumImage,
    alt: "Cloud Gate in Millennium Park framed by trees and downtown buildings",
    body: "Millennium Park brings landscape, public art, music, and downtown architecture into one open room. Cloud Gate reflects the skyline from every angle, making the viewer part of the scene rather than a spectator outside it.",
    tip: "the skyline bending across Cloud Gate, then the garden paths just beyond the plaza.",
  },
  riverwalk: {
    kicker: "02 · Chicago River",
    title: "Chicago Riverwalk",
    image: riverwalkImage,
    alt: "Chicago Riverwalk beside the river and downtown towers",
    body: "The Riverwalk shifts downtown life below street level. Bridges become ceilings, towers rise directly from the water, and each block opens a new view of the city’s architectural canyon.",
    tip: "the changing bridge details and the reflections that arrive near sunset.",
  },
  lakefront: {
    kicker: "03 · Lake Michigan",
    title: "Lakefront",
    image: lakefrontImage,
    alt: "Chicago skyline viewed across Lake Michigan",
    body: "Chicago’s lakefront is the city’s widest room. Paths connect beaches, parks, harbors, and skyline overlooks, while the water creates a strong blue edge beside the downtown grid.",
    tip: "the long skyline view from the south and the color change just before dusk.",
  },
  loop: {
    kicker: "04 · Downtown",
    title: "The Loop",
    image: loopImage,
    alt: "An elevated CTA train crossing a steel bridge in the Loop",
    body: "The Loop is both place and movement: a dense downtown district framed by elevated rail. The trains add rhythm overhead while streets below connect offices, theatres, public art, and the river.",
    tip: "a window seat on the elevated train and the layers of steel at each turn.",
  },
  wicker: {
    kicker: "05 · Northwest Side",
    title: "Wicker Park",
    image: wickerImage,
    alt: "A lively Wicker Park street lined with shops and parked cars",
    body: "Wicker Park trades the downtown skyline for a closer street-level energy. Independent shops, music venues, restaurants, and murals cluster around Milwaukee, Damen, and North Avenues.",
    tip: "the side streets, vintage signs, and small details between the busy intersections.",
  },
};

const modal = document.querySelector("#placeModal");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalKicker = document.querySelector("#modalKicker");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalTip = document.querySelector("#modalTip");
const modalTriggers = Array.from(
  document.querySelectorAll("[data-open-place]")
);
const modalCloseTriggers = Array.from(
  document.querySelectorAll("[data-close-modal]")
);

let lastFocusedElement = null;
let modalCloseTimer = null;

const openModal = (placeKey, trigger) => {
  const details = placeDetails[placeKey];

  if (!details) {
    return;
  }

  window.clearTimeout(modalCloseTimer);
  lastFocusedElement = trigger;
  modalImage.src = details.image;
  modalImage.alt = details.alt;
  modalKicker.textContent = details.kicker;
  modalTitle.textContent = details.title;
  modalBody.textContent = details.body;
  modalTip.textContent = details.tip;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  window.requestAnimationFrame(() => {
    modal.classList.add("is-open");
    modalClose.focus();
  });
};

const closeModal = () => {
  if (modal.hidden) {
    return;
  }

  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  modalCloseTimer = window.setTimeout(
    () => {
      modal.hidden = true;
      modalImage.removeAttribute("src");

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    },
    reduceMotion.matches ? 0 : 250
  );
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () =>
    openModal(trigger.dataset.openPlace, trigger)
  );
});

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = Array.from(
      modal.querySelectorAll(
        "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      )
    ).filter((element) => element.offsetParent !== null);

    if (focusableElements.length === 0) {
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
});

// Reveal animation
const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

showSlide(0);
updatePagePosition();
