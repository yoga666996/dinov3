// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const faqItems = document.querySelectorAll('.faq-item');
const scrollAnimationElements = document.querySelectorAll('.scroll-animation');

// Mobile Menu Toggle
mobileMenuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// FAQ Accordion with Accessibility
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            const btn = faqItem.querySelector('.faq-question');
            const content = faqItem.querySelector('.faq-answer');
            
            btn.setAttribute('aria-expanded', 'false');
            faqItem.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Open clicked item if it wasn't expanded
        if (!isExpanded) {
            question.setAttribute('aria-expanded', 'true');
            item.classList.add('active');
            answer.style.display = 'block';
        }
    });
    
    // Keyboard support
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.feature-card, .review-card, .showcase-item, .faq-item').forEach(el => {
    el.classList.add('scroll-animation');
    observer.observe(el);
});

// Banana Image Upload Simulation with Analytics
const uploadZone = document.querySelector('.upload-zone');
const galleryPlaceholder = document.querySelector('.gallery-placeholder');

uploadZone?.addEventListener('click', () => {
    // Send Google Analytics event for banana image upload attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'banana_image_upload_started', {
            event_category: 'NanoBanana_Core_Feature',
            event_label: 'Upload_Zone_Click',
            custom_parameter_1: 'banana_editor_section',
            custom_parameter_2: 'upload_interaction'
        });
    }
    
    // Simulate file upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Track actual file selection
            if (typeof gtag !== 'undefined') {
                gtag('event', 'banana_image_file_selected', {
                    event_category: 'NanoBanana_Core_Feature',
                    event_label: 'File_Selected',
                    custom_parameter_1: file.type,
                    custom_parameter_2: Math.round(file.size / 1024) + 'KB'
                });
            }
            simulateImageProcessing();
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
});

// Simulate banana image processing with Analytics
function simulateImageProcessing() {
    const placeholderItems = document.querySelectorAll('.placeholder-item');
    const startTime = Date.now();
    
    // Send processing start event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'banana_image_processing_started', {
            event_category: 'NanoBanana_Core_Feature',
            event_label: 'Processing_Started',
            custom_parameter_1: 'simulation',
            custom_parameter_2: placeholderItems.length + '_placeholders'
        });
    }
    
    // Add loading animation
    placeholderItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.background = 'linear-gradient(135deg, #f59e0b, #eab308)';
            item.style.animation = 'pulse 1s ease-in-out infinite';
        }, index * 200);
    });
    
    // Simulate completion
    setTimeout(() => {
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        placeholderItems.forEach(item => {
            item.style.animation = 'none';
            item.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            item.innerHTML = '<div style="color: white; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; height: 100%;">🍌✓</div>';
        });
        
        // Send processing completion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'banana_image_processing_completed', {
                event_category: 'NanoBanana_Core_Feature',
                event_label: 'Processing_Completed',
                custom_parameter_1: processingTime + 'ms',
                custom_parameter_2: 'success',
                value: Math.round(processingTime / 100) // Convert to meaningful number for GA
            });
        }
    }, 3000);
}

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked tab
        button.classList.add('active');
    });
});

// Launch Button Actions with Analytics
document.querySelectorAll('.launch-btn, .btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        // Send Google Analytics event for banana image editor access
        if (typeof gtag !== 'undefined') {
            gtag('event', 'banana_editor_access', {
                event_category: 'NanoBanana_Engagement',
                event_label: 'Editor_Button_Click',
                custom_parameter_1: button.textContent.trim(),
                custom_parameter_2: 'hero_section'
            });
        }
        
        // Scroll to banana editor section
        const bananaEditor = document.getElementById('banana-editor');
        if (bananaEditor) {
            bananaEditor.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
    }
    
    lastScrollY = currentScrollY;
});

// Add pulse animation for loading
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to placeholder items
    const placeholderItems = document.querySelectorAll('.placeholder-item');
    placeholderItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1.05)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
});

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll for better performance
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll-based animations can go here
}, 16));

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
        
        // Close any open FAQ items
        faqItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.display = 'none';
        });
    }
});

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other tracking implementation
    console.log('Event tracked:', eventName, eventData);
}

// Track user interactions
document.querySelectorAll('button, .nav-link').forEach(element => {
    element.addEventListener('click', (e) => {
        trackEvent('click', {
            element: e.target.textContent.trim(),
            location: window.location.pathname
        });
    });
});