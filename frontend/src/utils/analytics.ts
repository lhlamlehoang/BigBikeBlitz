// Analytics utility for tracking user interactions and performance

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  userAgent: string;
}

class Analytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private initialize(): void {
    if (this.isInitialized) return;
    
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.setupEventListeners();
    
    this.isInitialized = true;
    console.log('Analytics initialized');
  }

  private setupEventListeners(): void {
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-analytics]')) {
        const element = target.closest('[data-analytics]') as HTMLElement;
        const eventData = element.dataset.analytics;
        
        if (eventData) {
          try {
            const parsed = JSON.parse(eventData);
            this.trackEvent('click', parsed.category, parsed.action, parsed.label);
          } catch (error) {
            console.warn('Invalid analytics data:', eventData);
          }
        }
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form.dataset.analytics) {
        try {
          const parsed = JSON.parse(form.dataset.analytics);
          this.trackEvent('form_submit', parsed.category, parsed.action, parsed.label);
        } catch (error) {
          console.warn('Invalid form analytics data:', form.dataset.analytics);
        }
      }
    });
  }

  public trackPageView(page?: string): void {
    const pageUrl = page || window.location.pathname;
    const event: AnalyticsEvent = {
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: pageUrl,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    this.sendToServer(event);
  }

  public trackEvent(category: string, action: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      event: 'user_action',
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    this.sendToServer(event);
  }

  public trackProductView(productId: string, productName: string, price?: number): void {
    this.trackEvent('product', 'view', productName, price);
  }

  public trackAddToCart(productId: string, productName: string, price?: number, quantity: number = 1): void {
    this.trackEvent('cart', 'add', productName, price ? price * quantity : undefined);
  }

  public trackPurchase(orderId: string, total: number, items: any[]): void {
    this.trackEvent('purchase', 'complete', orderId, total);
  }

  public trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('search', 'query', query, resultsCount);
  }

  public trackError(error: string, context?: string): void {
    this.trackEvent('error', 'occurred', error);
  }

  public trackPerformance(metric: string, value: number): void {
    this.trackEvent('performance', metric, undefined, value);
  }

  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      // In production, send to your analytics endpoint
      // For now, we'll just log to console
      console.log('Analytics Event:', event);

      // Example: Send to your backend
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
const analytics = new Analytics();

// Performance monitoring
if (typeof window !== 'undefined') {
  // Track page load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      analytics.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
      analytics.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
    }
  });

  // Track Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      analytics.trackPerformance('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        analytics.trackPerformance('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      let cls = 0;
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      analytics.trackPerformance('cls', cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

export default analytics; 