// Portfolio Website JavaScript

// Global variable to track if typing animation is running
let isTypingAnimationRunning = false;

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate skill bars on skills page
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.style.width;
                    skillBar.style.width = '0%';
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 200);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card, .education-card, .experience-card, .skill-category, .individual-skill-card, .skill-card-beautiful');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Add typing animation to home page (only if not already running)
    const typingElement = document.querySelector('.typing-text span');
    if (typingElement && !isTypingAnimationRunning) {
        isTypingAnimationRunning = true;
        const texts = [
            'Computer Science Student',
            'Full Stack Developer',
            'Software Engineer'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next text
            }
            
            setTimeout(typeText, typeSpeed);
        }
        
        // Start typing animation
        typeText();
    }

    // Form submission handler for Formspree
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = '#4ade80';
                    this.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                // Error handling
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#f87171';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
                console.error('Error:', error);
            });
        });
    }
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
    }
});

// Spider-Man Canvas Animation
let dotsAnimation = null;

function initDotsAnimation() {
    const homeSection = document.querySelector('.home');
    const canvas = document.getElementById('dotsCanvas');

    if (!homeSection || !canvas) {
        console.log('Home section or canvas not found, retrying...');
        setTimeout(initDotsAnimation, 100);
        return;
    }

    // Clear any existing animation
    if (dotsAnimation) {
        cancelAnimationFrame(dotsAnimation);
    }

    // Set canvas size
    canvas.width = homeSection.offsetWidth;
    canvas.height = homeSection.offsetHeight;
    const ctx = canvas.getContext('2d');

    // Initialize dots array
    let dots = [];
    const arrayColors = ['#eee', '#545454', '#596d91', '#bb5a68', '#696541'];

    // Create initial dots (optimized for performance)
    function createDots() {
        dots = [];
        for (let index = 0; index < 30; index++) { // 30 dots for good balance
            dots.push({
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height),
                size: Math.random() * 2 + 4, // Slightly smaller dots
                color: arrayColors[Math.floor(Math.random() * 5)]
            });
        }
    }

    // Draw dots on canvas
    const drawDots = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(dot => {
            ctx.fillStyle = dot.color;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Initialize dots
    createDots();
    drawDots();

    // Mouse move event for interactive lines (optimized with throttling)
    let mouseMoveTimeout;
    let isMouseInHomeSection = false;
    
    homeSection.addEventListener('mouseenter', () => {
        isMouseInHomeSection = true;
    });
    
    homeSection.addEventListener('mouseleave', () => {
        isMouseInHomeSection = false;
        drawDots(); // Clear lines when mouse leaves
    });
    
    homeSection.addEventListener('mousemove', (event) => {
        // Only process mouse events when actually in the home section
        if (!isMouseInHomeSection) return;
        
        // Throttle mouse move events to reduce lag
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            drawDots();
            
            let mouse = {
                x: event.pageX - homeSection.getBoundingClientRect().left,
                y: event.pageY - homeSection.getBoundingClientRect().top
            };
            
            // Only draw lines for dots within a reasonable distance
            dots.forEach(dot => {
                let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
                if (distance < 200) { // Reduced from 300 to 200 for better performance
                    ctx.strokeStyle = dot.color;
                    ctx.lineWidth = 0.5; // Thinner lines for better performance
                    ctx.beginPath();
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });
        }, 16); // ~60fps throttling
    });

    // Window resize event
    window.addEventListener('resize', () => {
        canvas.width = homeSection.offsetWidth;
        canvas.height = homeSection.offsetHeight;
        createDots();
        drawDots();
    });

    // Button click event
    const homeButton = homeSection.querySelector('.btn');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            // Add some animation effect
            homeButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                homeButton.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Add some floating animation to dots (optimized)
    let lastTime = 0;
    const animationSpeed = 100; // Only animate every 100ms instead of every frame
    
    function animateDots(currentTime) {
        if (currentTime - lastTime > animationSpeed) {
            dots.forEach(dot => {
                // Add very subtle floating motion
                dot.x += (Math.random() - 0.5) * 0.2;
                dot.y += (Math.random() - 0.5) * 0.2;
                
                // Keep dots within canvas bounds
                if (dot.x < 0) dot.x = canvas.width;
                if (dot.x > canvas.width) dot.x = 0;
                if (dot.y < 0) dot.y = canvas.height;
                if (dot.y > canvas.height) dot.y = 0;
            });
            
            // Only redraw if there's no mouse interaction in the home section
            if (!isMouseInHomeSection) {
                drawDots();
            }
            
            lastTime = currentTime;
        }
        
        dotsAnimation = requestAnimationFrame(animateDots);
    }

    // Start subtle animation after a delay
    setTimeout(() => {
        animateDots(0);
    }, 2000);
}

// Initialize dots animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDotsAnimation();
});

// Also try to initialize after a short delay in case DOM isn't ready
setTimeout(() => {
    initDotsAnimation();
}, 500);