// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (if needed in future)
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .application-card, .resource-card, .timeline-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    // Statistics counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(target.replace(/[^\d]/g, ''));
            
            if (isNumber) {
                const finalNumber = parseInt(target.replace(/[^\d]/g, ''));
                const suffix = target.replace(/[\d]/g, '');
                let current = 0;
                const increment = finalNumber / 100;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        counter.textContent = finalNumber + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 20);
            }
        });
    }

    // Trigger counter animation when performance section is visible
    const performanceSection = document.querySelector('.performance');
    const performanceObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                performanceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (performanceSection) {
        performanceObserver.observe(performanceSection);
    }

    // Video loading optimization
    const videoContainer = document.querySelector('.video-container iframe');
    if (videoContainer) {
        // Add loading attribute for better performance
        videoContainer.setAttribute('loading', 'lazy');
        
        // Optional: Lazy load video on scroll
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (!iframe.src) {
                        iframe.src = iframe.dataset.src;
                    }
                    videoObserver.unobserve(iframe);
                }
            });
        });
        
        // Store original src and replace with data-src for lazy loading
        if (videoContainer.src) {
            videoContainer.dataset.src = videoContainer.src;
            // Comment out the next line if you want immediate loading
            // videoContainer.src = '';
            // videoObserver.observe(videoContainer);
        }
    }

    // Copy to clipboard functionality for code snippets (if any)
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre, code');
        
        codeBlocks.forEach(block => {
            if (block.textContent.length > 50) {
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.className = 'copy-button';
                copyButton.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #ff6b35;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                `;
                
                block.style.position = 'relative';
                block.appendChild(copyButton);
                
                copyButton.addEventListener('click', function() {
                    navigator.clipboard.writeText(block.textContent.replace('Copy', ''));
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            }
        });
    }
    
    addCopyButtons();

    // FAQ accordion functionality
    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('h3');
            const answer = item.querySelector('[itemprop="acceptedAnswer"]');
            
            // Initially hide all answers
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease';
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('[itemprop="acceptedAnswer"]');
                        otherAnswer.style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
                
                // Track FAQ interactions for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'faq_interaction', {
                        'faq_question': question.textContent,
                        'action': isActive ? 'close' : 'open'
                    });
                }
            });
        });
    }
    
    initializeFAQ();

    // Parallax effect for hero section
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
    
    window.addEventListener('scroll', parallaxEffect);

    // Enhanced analytics tracking for SEO insights
    function trackUserEngagement() {
        // Track time on page
        let timeOnPage = 0;
        const startTime = Date.now();
        
        setInterval(() => {
            timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            
            // Track engagement milestones
            if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 120) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'engagement_time', {
                        'time_seconds': timeOnPage,
                        'engagement_level': timeOnPage > 60 ? 'high' : 'medium'
                    });
                }
            }
        }, 1000);
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', function() {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
                maxScrollDepth = scrollDepth;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'depth_percentage': scrollDepth
                    });
                }
            }
        });
        
        // Track outbound link clicks
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="http"]') || e.target.closest('a[href^="http"]')) {
                const link = e.target.matches('a') ? e.target : e.target.closest('a');
                if (link.hostname !== window.location.hostname) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'outbound_click', {
                            'destination': link.href,
                            'link_text': link.textContent
                        });
                    }
                }
            }
        });
    }
    
    trackUserEngagement();

    // Video interaction functionality
    function initializeVideoFeatures() {
        const videoContainer = document.querySelector('.video-container');
        const videoOverlay = document.querySelector('.video-overlay');
        const iframe = document.querySelector('#hero-video');
        
        // Initially show overlay
        if (videoOverlay) {
            videoOverlay.style.opacity = '1';
        }
        
        // Hide overlay after video interaction
        if (iframe) {
            iframe.addEventListener('load', function() {
                // Set up video event listeners if YouTube API is available
                if (window.YT && window.YT.Player) {
                    const player = new YT.Player('hero-video', {
                        events: {
                            'onStateChange': function(event) {
                                if (event.data == YT.PlayerState.PLAYING) {
                                    videoOverlay.style.opacity = '0';
                                    
                                    // Track video play for analytics
                                    if (typeof gtag !== 'undefined') {
                                        gtag('event', 'video_play', {
                                            'video_title': 'DINOv3 Research Video',
                                            'video_url': './6nQHtKwo-2U77si_.mp4'
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
        
        // Add click tracking for video stats
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('click', function() {
                const statText = this.querySelector('.stat-text').textContent;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'stat_click', {
                        'stat_type': statText
                    });
                }
            });
        });
    }
    
    initializeVideoFeatures();

    // Setup local video player with optimized loading
    function initializeLocalVideo() {
        const video = document.querySelector('#hero-video');
        const loadingOverlay = document.querySelector('#video-loading');
        const playOverlay = document.querySelector('#video-play-overlay');
        
        if (!video) {
            console.error('Video element not found');
            return;
        }
        
        console.log('Initializing video player...');
        console.log('Video src:', video.querySelector('source')?.src);
        
        // Show loading initially
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.classList.remove('hidden');
        }
        if (playOverlay) {
            playOverlay.style.display = 'none';
            playOverlay.classList.add('hidden');
        }
        
        // Check if video file exists
        const videoSource = video.querySelector('source');
        if (videoSource) {
            const videoUrl = videoSource.src;
            console.log('Checking video URL:', videoUrl);
            
            // Try to load video with timeout
            const loadTimeout = setTimeout(() => {
                console.warn('Video loading timeout - showing play overlay anyway');
                hideLoading();
                showPlayOverlay();
            }, 5000); // 5 second timeout (reduced from 10)
            
            // Also show play overlay after a short delay even if video isn't fully loaded
            const quickShowTimeout = setTimeout(() => {
                if (video.readyState >= 1) { // HAVE_METADATA
                    console.log('Video metadata available, showing play overlay');
                    hideLoading();
                    showPlayOverlay();
                    clearTimeout(loadTimeout);
                }
            }, 2000); // Show after 2 seconds if metadata is loaded
            
            video.addEventListener('loadeddata', () => {
                console.log('Video data loaded successfully');
                clearTimeout(loadTimeout);
            });
        }
        
        // Video event listeners
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
            showLoading();
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded');
            console.log('Video duration:', video.duration);
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        });
        
        video.addEventListener('loadeddata', function() {
            console.log('Video first frame loaded');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
            hideLoading();
            showPlayOverlay();
        });
        
        video.addEventListener('canplaythrough', function() {
            console.log('Video fully loaded and can play through');
            hideLoading();
            showPlayOverlay();
        });
        
        // Add a progress event listener
        video.addEventListener('progress', function() {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const duration = video.duration;
                if (duration > 0) {
                    const bufferPercent = (bufferedEnd / duration) * 100;
                    console.log('Video buffered:', bufferPercent.toFixed(1) + '%');
                }
            }
        });
        
        video.addEventListener('play', function() {
            hidePlayOverlay();
            showVideoControls();
            
            // Track video play
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_play', {
                    'video_title': 'DINOv3 Research Video',
                    'video_type': 'local_mp4'
                });
            }
        });
        
        video.addEventListener('pause', function() {
            // Track video pause
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_pause', {
                    'video_title': 'DINOv3 Research Video'
                });
            }
        });
        
        video.addEventListener('ended', function() {
            showPlayOverlay();
            
            // Track video completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_complete', {
                    'video_title': 'DINOv3 Research Video'
                });
            }
        });
        
        video.addEventListener('waiting', function() {
            console.log('Video buffering...');
        });
        
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            console.error('Video error details:', {
                error: e.target.error,
                networkState: video.networkState,
                readyState: video.readyState
            });
            
            hideLoading();
            hidePlayOverlay();
            
            // Show error message with retry option
            const container = video.parentElement;
            if (container && !container.querySelector('.video-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'video-error';
                errorDiv.innerHTML = `
                    <div style="text-align: center; color: white; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #ff6b35;"></i>
                        <h3>Video Temporarily Unavailable</h3>
                        <p>Video file may be processing, please try again later</p>
                        <button onclick="retryVideoLoad()" class="btn btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-redo"></i> Retry Loading
                        </button>
                    </div>
                `;
                container.appendChild(errorDiv);
            }
        });
        
        // Helper functions
        function showLoading() {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.classList.remove('hidden');
            }
        }
        
        function hideLoading() {
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }
        }
        
        function showPlayOverlay() {
            if (playOverlay) {
                playOverlay.style.display = 'flex';
                playOverlay.classList.remove('hidden');
            }
        }
        
        function hidePlayOverlay() {
            if (playOverlay) {
                playOverlay.classList.add('hidden');
                setTimeout(() => {
                    playOverlay.style.display = 'none';
                }, 300);
            }
        }
        
        function showVideoControls() {
            video.controls = true;
        }
    }
    
    // Global function for playing video with optimized loading
    window.playVideoNow = function() {
        const video = document.querySelector('#hero-video');
        const loadingOverlay = document.querySelector('#video-loading');
        
        if (video) {
            // Show loading indicator
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.classList.remove('hidden');
            }
            
            // Only load video when user actually wants to play it
            if (video.readyState === 0) {
                console.log('Loading video on demand...');
                video.load();
                
                // Wait for enough data to start playing
                video.addEventListener('canplay', function() {
                    console.log('Video ready to play');
                    if (loadingOverlay) {
                        loadingOverlay.classList.add('hidden');
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                        }, 300);
                    }
                    
                    video.muted = false; // Unmute when user clicks
                    video.play().catch(function(error) {
                        console.error('Play failed:', error);
                        video.controls = true;
                    });
                }, { once: true });
            } else {
                // Video already loaded
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                video.muted = false;
                video.play().catch(function(error) {
                    console.error('Play failed:', error);
                    video.controls = true;
                });
            }
        }
    };
    
    // Global function for retrying video load
    window.retryVideoLoad = function() {
        const video = document.querySelector('#hero-video');
        const loadingOverlay = document.querySelector('#video-loading');
        const errorDiv = document.querySelector('.video-error');
        
        if (errorDiv) {
            errorDiv.remove();
        }
        
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.classList.remove('hidden');
        }
        
        if (video) {
            console.log('Retrying video load...');
            video.load(); // Reload the video
        }
    };
    
    // Initialize local video when DOM is ready
    initializeLocalVideo();
    
    // Fallback: If nothing happens after 3 seconds, show play overlay
    setTimeout(() => {
        const loadingOverlay = document.querySelector('#video-loading');
        const playOverlay = document.querySelector('#video-play-overlay');
        
        if (loadingOverlay && loadingOverlay.style.display !== 'none') {
            console.log('Fallback: Showing play overlay after delay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }
            if (playOverlay) {
                playOverlay.style.display = 'flex';
                playOverlay.classList.remove('hidden');
            }
        }
    }, 3000); // 3 second fallback

    // Enhanced video visibility tracking
    function setupVideoIntersectionObserver() {
        const videoContainer = document.querySelector('.video-container');
        
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is in viewport
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'video_in_viewport', {
                            'video_title': 'DINOv3 Research Video'
                        });
                    }
                    
                    // Add subtle animation when video comes into view
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                }
            });
        }, { threshold: 0.5 });
        
        if (videoContainer) {
            videoObserver.observe(videoContainer);
        }
    }
    
    setupVideoIntersectionObserver();

    // Dark mode functionality removed to reduce bundle size

    // Form validation - Only initialize if forms exist
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#ff4444';
                    } else {
                        input.style.borderColor = '#ff6b35';
                    }
                });
                
                if (isValid) {
                    console.log('Form submitted successfully');
                }
            });
        });
    }

    // Performance monitoring
    function trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Page load time: ${pageLoadTime}ms`);
                    
                    // You can send this data to analytics
                }, 0);
            });
        }
    }
    
    trackPerformance();
});

// Utility functions
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Any scroll-dependent functions can be placed here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Handle external links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="http"]') || e.target.closest('a[href^="http"]')) {
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

// SEO and Analytics placeholder
function initializeAnalytics() {
    // Google Analytics or other analytics code would go here
    console.log('Analytics initialized');
}

// Call analytics initialization
initializeAnalytics();
