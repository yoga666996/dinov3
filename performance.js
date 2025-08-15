// Performance Monitoring for NanoBanana AI
class NanoBananaPerformance {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePageLoad();
        });

        // Monitor Core Web Vitals
        this.measureCoreWebVitals();
        
        // Monitor user interactions
        this.trackUserInteractions();
        
        // Monitor banana image processing simulations
        this.trackBananaImageProcessing();
    }

    measurePageLoad() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: this.getFirstPaint(),
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
            };
            
            console.log('NanoBanana Page Load Metrics:', this.metrics.pageLoad);
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            console.log('LCP (Largest Contentful Paint):', this.metrics.lcp);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-input') {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('FID (First Input Delay):', this.metrics.fid);
                }
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
            console.log('CLS (Cumulative Layout Shift):', this.metrics.cls);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn')) {
                const buttonText = e.target.textContent.trim();
                this.logEvent('button_click', {
                    button_text: buttonText,
                    timestamp: Date.now(),
                    page_section: this.getCurrentSection(e.target)
                });
            }
        });

        // Track navigation link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                this.logEvent('navigation_click', {
                    link_text: e.target.textContent.trim(),
                    href: e.target.getAttribute('href'),
                    timestamp: Date.now()
                });
            }
        });

        // Track FAQ interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                const questionText = e.target.closest('.faq-question').querySelector('h3').textContent;
                this.logEvent('faq_interaction', {
                    question: questionText,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackBananaImageProcessing() {
        // Simulate banana image upload tracking
        const uploadZone = document.querySelector('.upload-zone');
        if (uploadZone) {
            uploadZone.addEventListener('click', () => {
                this.logEvent('banana_image_upload_attempt', {
                    timestamp: Date.now(),
                    user_agent: navigator.userAgent
                });
                
                // Simulate processing time measurement
                this.simulateBananaProcessing();
            });
        }
    }

    simulateBananaProcessing() {
        const startTime = performance.now();
        
        // Simulate NanoBanana processing delay
        setTimeout(() => {
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            this.logEvent('banana_image_processed', {
                processing_time_ms: processingTime,
                simulated: true,
                timestamp: Date.now()
            });
            
            console.log(`NanoBanana simulated processing time: ${processingTime.toFixed(2)}ms`);
        }, Math.random() * 1000 + 500); // 500-1500ms random delay
    }

    getCurrentSection(element) {
        const section = element.closest('section');
        return section ? section.id || section.className : 'unknown';
    }

    logEvent(eventName, data) {
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter_1: data.button_text || data.link_text || data.question || 'unknown',
                custom_parameter_2: data.page_section || 'unknown',
                event_category: 'NanoBanana_Interaction',
                event_label: eventName,
                value: data.processing_time_ms || 1
            });
        }
        
        // Console log for debugging
        console.log(`NanoBanana Event: ${eventName}`, data);
        
        // Store in sessionStorage for demo purposes
        const events = JSON.parse(sessionStorage.getItem('nanobanana_events') || '[]');
        events.push({
            event: eventName,
            data: data,
            url: window.location.href,
            timestamp: Date.now()
        });
        sessionStorage.setItem('nanobanana_events', JSON.stringify(events));
    }

    // Method to get performance report
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            events: JSON.parse(sessionStorage.getItem('nanobanana_events') || '[]'),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    // Method to export performance data
    exportPerformanceData() {
        const report = this.getPerformanceReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nanobanana-performance-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize performance monitoring when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.nanoBananaPerf = new NanoBananaPerformance();
    
    // Add export button to footer (for demo/debugging)
    if (process.env.NODE_ENV === 'development') {
        const footer = document.querySelector('.footer-bottom');
        if (footer) {
            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Export Performance Data';
            exportBtn.style.cssText = 'margin-left: 10px; padding: 5px 10px; background: #f59e0b; color: #000; border: none; border-radius: 4px; cursor: pointer;';
            exportBtn.addEventListener('click', () => {
                window.nanoBananaPerf.exportPerformanceData();
            });
            footer.appendChild(exportBtn);
        }
    }
});

// Error tracking
window.addEventListener('error', (e) => {
    if (window.nanoBananaPerf) {
        window.nanoBananaPerf.logEvent('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            timestamp: Date.now()
        });
    }
});

// Resource loading errors
window.addEventListener('error', (e) => {
    if (e.target !== window) {
        if (window.nanoBananaPerf) {
            window.nanoBananaPerf.logEvent('resource_error', {
                element: e.target.tagName,
                source: e.target.src || e.target.href,
                timestamp: Date.now()
            });
        }
    }
}, true);