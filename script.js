if (window.AOS) {
    AOS.init({
        duration: 950,
        once: true,
        easing: "ease-out-cubic",
        offset: 90
    });
}

const navbar = document.querySelector(".navbar");
const progress = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const hero = document.querySelector(".hero");

const updateScrollEffects = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = docHeight > 0 ? scrollTop / docHeight : 0;

    const isBottomNav = scrollTop > 120;

    if (navbar) {
        navbar.classList.toggle("scrolled", isBottomNav);
    }

    if (document.body) {
        document.body.classList.toggle("bottom-nav", isBottomNav);
    }

    if (progress) {
        progress.style.transform = `scaleX(${progressValue})`;
    }
};

window.addEventListener("scroll", updateScrollEffects, { passive: true });
updateScrollEffects();

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// hero glow removed — no mousemove handler needed

document.querySelectorAll('a[href]:not([href^="#"])').forEach((link) => {
    link.addEventListener("click", (event) => {
        if (link.target || link.hostname !== window.location.hostname) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("is-leaving");

        setTimeout(() => {
            window.location.href = link.href;
        }, 220);
    });
});

const counters = document.querySelectorAll("[data-count]");

const runCounter = (counter) => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || "";
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
        const progressValue = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        const value = Math.floor(eased * target);

        counter.textContent = `${value.toLocaleString()}${suffix}`;

        if (progressValue < 1) {
            requestAnimationFrame(tick);
        } else {
            counter.textContent = `${target.toLocaleString()}${suffix}`;
        }
    };

    requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .45 });

    counters.forEach((counter) => counterObserver.observe(counter));
} else {
    counters.forEach(runCounter);
}

const carousel = document.querySelector(".testimonial-carousel");
const track = document.querySelector(".testimonial-track");
const slides = document.querySelectorAll(".testimonial-card");
let testimonialIndex = 0;
let testimonialTimer;

const showTestimonial = (index) => {
    if (!track || !slides.length) {
        return;
    }

    testimonialIndex = index % slides.length;
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
};

const startTestimonials = () => {
    testimonialTimer = setInterval(() => {
        showTestimonial(testimonialIndex + 1);
    }, 4300);
};

const stopTestimonials = () => clearInterval(testimonialTimer);

if (carousel && track && slides.length) {
    startTestimonials();
    carousel.addEventListener("mouseenter", stopTestimonials);
    carousel.addEventListener("mouseleave", startTestimonials);
}

document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let note = form.querySelector(".form-note");

        if (!note) {
            note = document.createElement("p");
            note.className = "form-note";
            form.appendChild(note);
        }

        note.textContent = "Thank you. Apexstag will contact you shortly.";
        form.reset();
    });
});
