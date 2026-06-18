'use client';

// Tipado seguro para el dataLayer
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Evento base genérico para GA4
 */
export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Evento cuando un usuario cambia el color/arquetipo del sitio
 */
export const trackPersonaChange = (persona: string) => {
  trackEvent('change_persona', {
    persona_selected: persona
  });
};

/**
 * Evento cuando el usuario finaliza la simulación UCP
 */
export const trackUcpCheckout = (total: number, services: string[]) => {
  trackEvent('ucp_checkout_simulated', {
    value: total,
    currency: 'USD',
    services_list: services.join(', ')
  });
};

/**
 * Evento cuando un CTO descarga el documento técnico
 */
export const trackLeadMagnetDownload = (slug: string) => {
  trackEvent('lead_magnet_download', {
    document_slug: slug
  });
};

/**
 * Evento de lectura en profundidad de un post del blog
 */
export const trackArticleView = (slug: string, category: string) => {
  trackEvent('article_read', {
    article_slug: slug,
    article_category: category
  });
};
