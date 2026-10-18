/* ==========================================================================
   Shiv Raj Bangad - Portfolio Interactivity Script
   Theme Switcher, Project Filtering, Smooth Scrolling, & Recruiter Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Dark / Light Mode Theme Toggle
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Detect saved theme or system preference
    const savedTheme = localStorage.getItem('srb-portfolio-theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('srb-portfolio-theme', theme);

        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    icon.className = 'fa-solid fa-moon';
                    themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
                    themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
                } else {
                    icon.className = 'fa-solid fa-sun';
                    themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
                    themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
                }
            }
        }
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersLight) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // ----------------------------------------------------------------------
    // 2. Mobile Hamburger Navigation
    // ----------------------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close when nav link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 3. Smooth Scrolling & Active Nav Highlighting
    // ----------------------------------------------------------------------
    const navLinksList = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - (navHeight + 10);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 4. Project Category Filtering
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (filter === 'all' || categories.split(' ').includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. Deep Dive Details Drawer Text Updating
    // ----------------------------------------------------------------------
    document.querySelectorAll('.deep-dive-details').forEach(details => {
        details.addEventListener('toggle', () => {
            const summaryBtn = details.querySelector('.drawer-toggle-btn');
            if (!summaryBtn) return;

            if (details.open) {
                summaryBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Technical Deep-Dive';
            } else {
                summaryBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Explore Technical Deep-Dive';
            }
        });
    });
});

// ----------------------------------------------------------------------
// 6. Global Copy Email & Toast Notification Handler
// ----------------------------------------------------------------------
function copyEmail(event, email = 'sbangad@purdue.edu') {
    if (event) {
        event.preventDefault();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
            fallbackCopy(email);
        });
    } else {
        fallbackCopy(email);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
        showToast(`Email: ${text}`);
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'portfolio-toast';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add('show');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

window.copyEmail = copyEmail;
