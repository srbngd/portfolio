document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active state
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(section => {
        observer.observe(section);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 10, 20, 0.95)';
            navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        } else {
            navbar.style.background = 'rgba(5, 10, 20, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        lastScrollY = window.scrollY;

        // Update active navigation link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';
        let closestSection = '';
        let minDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const scrollPosition = window.scrollY + 150; // Offset for navbar

            // Find the section we're currently in
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }

            // Find the closest section as a fallback
            const distance = Math.abs(scrollPosition - sectionTop);
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section.getAttribute('id');
            }
        });

        // Use currentSection if found, otherwise use closestSection
        const activeSection = currentSection || closestSection;

        // Update active class on nav links - only one at a time
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    });
});
