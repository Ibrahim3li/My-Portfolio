// Preloader Logic
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.remove();
    });
});

// Set --i for loading text animation
document.addEventListener('DOMContentLoaded', function() {
    const nameLoader = document.getElementById('name-loader');
    if (nameLoader) {
        const spans = nameLoader.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.setProperty('--i', index + 1);
        });
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', function() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        scrollIndicator.style.width = scrolled + '%';
    }
});

// Language Switching Logic
document.addEventListener('DOMContentLoaded', function() {
    const htmlElement = document.documentElement;
    const langToggle = document.getElementById('lang-toggle');
    const langEnSpan = document.querySelector('.lang-toggle .lang-en');
    const langArSpan = document.querySelector('.lang-toggle .lang-ar');

    const allLangContentEn = document.querySelectorAll('.lang-en-content');
    const allLangContentAr = document.querySelectorAll('.lang-ar-content');

    const translatableElements = document.querySelectorAll('[data-en], [data-ar]'); // For elements with data attributes

    // Function to apply language settings
    function applyLanguage(lang) {
        if (lang === 'ar') {
            htmlElement.setAttribute('lang', 'ar');
            htmlElement.setAttribute('dir', 'rtl');
            langEnSpan.classList.remove('active');
            langArSpan.classList.add('active');
        } else {
            htmlElement.setAttribute('lang', 'en');
            htmlElement.setAttribute('dir', 'ltr');
            langArSpan.classList.remove('active');
            langEnSpan.classList.add('active');
        }

        // Show/hide content sections
        allLangContentEn.forEach(el => el.classList.remove('active'));
        allLangContentAr.forEach(el => el.classList.remove('active'));

        if (lang === 'en') {
            allLangContentEn.forEach(el => el.classList.add('active'));
        } else {
            allLangContentAr.forEach(el => el.classList.add('active'));
        }

        // Update text for elements with data attributes (like navbar links, stats)
        translatableElements.forEach(el => {
            if (lang === 'en' && el.dataset.en) {
                el.textContent = el.dataset.en;
            } else if (lang === 'ar' && el.dataset.ar) {
                el.textContent = el.dataset.ar;
            }
        });

        // Reinitialize Typed.js for the active language
        initializeTypedJs(lang);

        // Update footer year
        updateFooterYear(lang);

        // Re-run GitHub API if needed for localized dates/text, or fetch again
        // For simplicity, we just update text for current year in footer and assume GitHub content is language agnostic or handled by browser.
        // For actual localization of GitHub activity dates, you might need to re-fetch or re-render based on language.
    }

    // Get preferred language from localStorage
    const savedLang = localStorage.getItem('portfolioLang') || 'en'; // Default to English
    applyLanguage(savedLang); // Apply saved language on load

    // Toggle language on button click
    langToggle.addEventListener('click', function() {
        const currentLang = htmlElement.getAttribute('lang');
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('portfolioLang', newLang); // Save preference
        applyLanguage(newLang);
    });
});

// Navbar active link on scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    function activateNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar height
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Call on load to set initial active link

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (document.querySelector('.mobile-menu.active')) {
                document.querySelector('.mobile-menu').classList.remove('active');
                document.querySelector('.menu-toggle').classList.remove('active');
            }
        });
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside or on a link
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            navbar.classList.remove('menu-open');
        }
    });
});

// Typed.js for Hero Subtitle
let typedInstanceEn;
let typedInstanceAr;

function initializeTypedJs(lang) {
    if (typedInstanceEn) typedInstanceEn.destroy();
    if (typedInstanceAr) typedInstanceAr.destroy();

    if (lang === 'en') {
        const typedElementEn = document.getElementById('typed-text-en');
        if (typedElementEn) {
            typedInstanceEn = new Typed(typedElementEn, {
                strings: [
                    'Full-Stack Web Developer',
                    'Digital Marketing Specialist',
                    'Web Designer',
                    'Problem Solver'
                ],
                typeSpeed: 50,
                backSpeed: 25,
                loop: true,
                smartBackspace: true,
                showCursor: true,
                cursorChar: '|',
            });
        }
    } else if (lang === 'ar') {
        const typedElementAr = document.getElementById('typed-text-ar');
        if (typedElementAr) {
            typedInstanceAr = new Typed(typedElementAr, {
                strings: [
                    'مطور ويب شامل',
                    'متخصص تسويق رقمي',
                    'مصمم ويب',
                    'حلّال مشاكل'
                ],
                typeSpeed: 50,
                backSpeed: 25,
                loop: true,
                smartBackspace: true,
                showCursor: true,
                cursorChar: '|',
            });
        }
    }
}

// ... (Your existing JavaScript code, like language switcher, Typed.js, smooth scrolling, etc.) ...

// Download CV Button Interaction
const downloadCvBtn = document.getElementById('downloadCvBtn');

if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default button behavior if it's inside a form

        if (this.classList.contains('loading')) {
            return; // Do nothing if already loading
        }

        this.classList.add('loading'); // Add loading class to start animation
        
        // Simulate a download/processing time
        setTimeout(() => {
            // Open the CV file (replace 'assets/Ibrahim_Ali_CV.pdf' with the actual path)
            window.open('assets/Ibrahim Ali.pdf', '_blank'); // Make sure this path is correct
            
            // After a short delay, remove the loading state
            // This delay makes the spinner animation more noticeable
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000); // Wait 1 second before resetting button
            
        }, 1500); // Simulate 1.5 seconds of "download" time
    });
}
// GitHub API Integration
document.addEventListener('DOMContentLoaded', function() {
    const githubUsername = 'Ibrahim3li'; // Replace with your GitHub username

    // Function to update GitHub stats for a given language
    function updateGitHubStats(lang, data, events, languagesData) {
        const reposId = `githubRepos-${lang}`;
        const starsId = `githubStars-${lang}`;
        const followersId = `githubFollowers-${lang}`;
        const commitsId = `githubCommits-${lang}`;
        const activityId = `githubActivity-${lang}`;
        const languagesGridId = `githubLanguages-${lang}`;

        if (data.public_repos) {
            document.getElementById(reposId).textContent = data.public_repos;
        }
        if (data.followers) {
            document.getElementById(followersId).textContent = data.followers;
        }

        let totalStars = 0;
        if (languagesData) { // Assuming languagesData is passed as an array of repos
            languagesData.forEach(repo => {
                totalStars += repo.stargazers_count;
            });
            document.getElementById(starsId).textContent = totalStars;
        }


        const githubActivityDiv = document.getElementById(activityId);
        if (githubActivityDiv) {
            githubActivityDiv.innerHTML = ''; // Clear loading placeholder

            const relevantEvents = events.filter(event =>
                ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
            );

            const translations = {
                en: {
                    pushed: (count) => `pushed ${count} commit${count > 1 ? 's' : ''} to`,
                    created: (type) => `created a new ${type}`,
                    openedPR: (num) => `opened pull request`,
                    closedPR: (num) => `closed pull request`,
                    openedIssue: (num) => `opened issue`,
                    closedIssue: (num) => `closed issue`,
                    madeAction: () => `made an action on`,
                    viewProfile: `View Profile`,
                    loadingActivity: `Loading GitHub activity...`,
                    loadingLanguages: `Loading languages...`,
                    repos: `Repos`
                },
                ar: {
                    pushed: (count) => `دفع ${count} التزام${count > 1 ? 'ات' : ''} إلى`,
                    created: (type) => `أنشأ ${type} جديد`,
                    openedPR: (num) => `فتح طلب سحب`,
                    closedPR: (num) => `أغلق طلب سحب`,
                    openedIssue: (num) => `فتح مشكلة`,
                    closedIssue: (num) => `أغلق مشكلة`,
                    madeAction: () => `قام بإجراء على`,
                    viewProfile: `عرض ملفي الشخصي`,
                    loadingActivity: `جاري تحميل نشاط GitHub...`,
                    loadingLanguages: `جاري تحميل اللغات...`,
                    repos: `مستودعات`
                }
            };
            const currentTranslations = translations[lang];

            relevantEvents.slice(0, 5).forEach(event => {
                const activityItem = document.createElement('div');
                activityItem.classList.add('activity-item');
                let iconClass = '';
                let description = '';
                let repoUrl = event.repo.url.replace('api.github.com/repos', 'github.com');
                let repoName = event.repo.name;
                let actionLink = '';

                switch (event.type) {
                    case 'PushEvent':
                        iconClass = 'fas fa-code-branch';
                        const commitCount = event.payload.commits.length;
                        description = `${currentTranslations.pushed(commitCount)} <a href="${repoUrl}" target="_blank">${repoName}</a>`;
                        break;
                    case 'CreateEvent':
                        iconClass = 'fas fa-plus-circle';
                        description = `${currentTranslations.created(event.payload.ref_type)} <a href="${repoUrl}" target="_blank">${event.payload.ref || repoName}</a>`;
                        break;
                    case 'PullRequestEvent':
                        iconClass = 'fas fa-code-pull-request';
                        actionLink = event.payload.pull_request.html_url;
                        description = `${event.payload.action === 'opened' ? currentTranslations.openedPR() : currentTranslations.closedPR()} <a href="${actionLink}" target="_blank">#${event.payload.number}</a> على <a href="${repoUrl}" target="_blank">${repoName}</a>`;
                        break;
                    case 'IssuesEvent':
                        iconClass = 'fas fa-bug';
                        actionLink = event.payload.issue.html_url;
                        description = `${event.payload.action === 'opened' ? currentTranslations.openedIssue() : currentTranslations.closedIssue()} <a href="${actionLink}" target="_blank">#${event.payload.issue.number}</a> على <a href="${repoUrl}" target="_blank">${repoName}</a>`;
                        break;
                    default:
                        iconClass = 'fas fa-dot-circle';
                        description = `${currentTranslations.madeAction()} <a href="${repoUrl}" target="_blank">${repoName}</a>`;
                }

                activityItem.innerHTML = `
                    <div class="icon"><i class="${iconClass}"></i></div>
                    <div class="content">
                        <p>${description}</p>
                        <span class="date">${new Date(event.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                `;
                githubActivityDiv.appendChild(activityItem);
            });

            const totalCommitsElement = document.getElementById(commitsId);
            if (totalCommitsElement) {
                let totalPushedCommits = 0;
                events.forEach(event => {
                    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
                        totalPushedCommits += event.payload.commits.length;
                    }
                });
                totalCommitsElement.textContent = totalPushedCommits > 0 ? totalPushedCommits : 'N/A';
            }
        }


        // Update top languages
        const languagesGridDiv = document.getElementById(languagesGridId);
        if (languagesGridDiv && languagesData) {
            languagesGridDiv.innerHTML = ''; // Clear loading placeholder
            const languages = {};
            languagesData.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });
            const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a);

            sortedLanguages.slice(0, 5).forEach(([langName, count]) => {
                const langItem = document.createElement('div');
                langItem.classList.add('language-item');
                langItem.innerHTML = `
                    <div class="lang-name">${langName}</div>
                    <div class="lang-percentage">${count} ${currentTranslations.repos}</div>
                `;
                languagesGridDiv.appendChild(langItem);
            });
        }
    }

    let githubUserData = null;
    let githubEventsData = [];
    let githubReposData = [];

    // Fetch all GitHub data once
    Promise.all([
        fetch(`https://api.github.com/users/${githubUsername}`).then(res => res.json()),
        fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=10`).then(res => res.json()),
        fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`).then(res => res.json())
    ])
    .then(([userData, eventsData, reposData]) => {
        githubUserData = userData;
        githubEventsData = eventsData;
        githubReposData = reposData;

        // Update for both English and Arabic content on initial load
        updateGitHubStats('en', githubUserData, githubEventsData, githubReposData);
        updateGitHubStats('ar', githubUserData, githubEventsData, githubReposData);
    })
    .catch(error => console.error('Error fetching GitHub data:', error));
});


// Intersection Observer for Reveal Animations
document.addEventListener('DOMContentLoaded', function() {
    const revealSections = document.querySelectorAll('.reveal-section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    revealSections.forEach(section => {
        observer.observe(section);
    });
});

// Update current year in footer
function updateFooterYear(lang) {
    const currentYearEnSpan = document.getElementById('current-year-en');
    const currentYearArSpan = document.getElementById('current-year-ar');
    const currentYear = new Date().getFullYear();

    if (currentYearEnSpan) {
        currentYearEnSpan.textContent = currentYear;
    }
    if (currentYearArSpan) {
        currentYearArSpan.textContent = currentYear;
    }
}
document.addEventListener('DOMContentLoaded', () => updateFooterYear(document.documentElement.lang));


// Particles.js Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-hero', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#3498db"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#2c3e50",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn("particles.js library not found. Please ensure 'particles.min.js' is correctly linked in your HTML.");
    }
});