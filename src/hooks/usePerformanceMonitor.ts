import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  navigationStart: number;
  loadComplete: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface ComponentMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
}

export interface PerformanceData {
  metrics: Partial<PerformanceMetrics>;
  components: ComponentMetrics[];
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceData>({
    metrics: {},
    components: []
  });

  // Track Web Vitals
  const trackWebVitals = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Track Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metricsRef.current.metrics.navigationStart = navigation.navigationStart;
      metricsRef.current.metrics.loadComplete = navigation.loadEventEnd;
    }

    // Track Paint Timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metricsRef.current.metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Track LCP using PerformanceObserver
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Track CLS
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metricsRef.current.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Track FID
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            metricsRef.current.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }, []);

  // Track component render times
  const trackComponentRender = useCallback((componentName: string, renderTime: number) => {
    metricsRef.current.components.push({
      componentName,
      renderTime,
      timestamp: Date.now()
    });

    // Keep only the last 100 component metrics to prevent memory leaks
    if (metricsRef.current.components.length > 100) {
      metricsRef.current.components = metricsRef.current.components.slice(-100);
    }
  }, []);

  // Track memory usage
  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metricsRef.current.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
  }, []);

  // Get performance report
  const getPerformanceReport = useCallback((): PerformanceData => {
    trackMemoryUsage();
    return { ...metricsRef.current };
  }, [trackMemoryUsage]);

  // Log performance metrics to console (development only)
  const logPerformanceMetrics = useCallback(() => {
    if (import.meta.env.DEV) {
      const report = getPerformanceReport();
      console.group('🚀 FNG App Performance Metrics');
      console.log('Web Vitals:', report.metrics);
      console.log('Component Renders (last 10):', report.components.slice(-10));
      console.log('Memory Usage:', report.memoryUsage);
      console.groupEnd();
    }
  }, [getPerformanceReport]);

  // Report slow components
  const getSlowComponents = useCallback((threshold = 16): ComponentMetrics[] => {
    return metricsRef.current.components.filter(component => component.renderTime > threshold);
  }, []);

  // Initialize performance tracking
  useEffect(() => {
    trackWebVitals();

    // Track initial memory usage
    trackMemoryUsage();

    // Log metrics every 30 seconds in development
    if (import.meta.env.DEV) {
      const interval = setInterval(logPerformanceMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [trackWebVitals, trackMemoryUsage, logPerformanceMetrics]);

  return {
    trackComponentRender,
    getPerformanceReport,
    logPerformanceMetrics,
    getSlowComponents,
    trackMemoryUsage
  };
}

// Higher-order component to track component render times
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: P) {
    const { trackComponentRender } = usePerformanceMonitor();
    const renderStart = useRef(0);

    useEffect(() => {
      renderStart.current = performance.now();
    });

    useEffect(() => {
      const renderTime = performance.now() - renderStart.current;
      trackComponentRender(componentName, renderTime);
    });

    return <WrappedComponent {...props} />;
  };
}