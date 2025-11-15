/**
 * Browser Translation Utility
 * Handles browser-based translation for hybrid translation approach
 *
 * Features:
 * - Sets HTML lang attribute for browser auto-translation
 * - Detects browser translation capability
 * - Provides fallback to Google Translate
 */

export interface TranslationConfig {
  targetLanguage: string;
  sourceLanguage?: string;
}

/**
 * Set the HTML lang attribute to trigger browser translation
 */
export function setPageLanguage(languageCode: string): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = languageCode;

    // Also set dir attribute for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(languageCode)
      ? 'rtl'
      : 'ltr';

    // Store preference
    localStorage.setItem('preferredLanguage', languageCode);
  }
}

/**
 * Get stored language preference
 */
export function getPreferredLanguage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('preferredLanguage');
  }
  return null;
}

/**
 * Detect if browser supports auto-translation
 */
export function detectBrowserTranslationSupport(): {
  supported: boolean;
  browser: string;
} {
  if (typeof navigator === 'undefined') {
    return { supported: false, browser: 'unknown' };
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Chrome and Edge have built-in Google Translate
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return { supported: true, browser: 'chrome' };
  }

  if (userAgent.includes('edg')) {
    return { supported: true, browser: 'edge' };
  }

  // Safari has limited translation support
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return { supported: false, browser: 'safari' };
  }

  // Firefox doesn't have built-in translation
  if (userAgent.includes('firefox')) {
    return { supported: false, browser: 'firefox' };
  }

  return { supported: false, browser: 'other' };
}

/**
 * Check if Google Translate is available
 */
export function isGoogleTranslateAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    typeof (window as any).google !== 'undefined' &&
    typeof (window as any).google.translate !== 'undefined'
  );
}

/**
 * Initialize Google Translate Widget
 * Fallback for browsers without built-in translation
 */
export function initGoogleTranslateWidget(
  targetLanguage: string,
  containerId = 'google_translate_element'
): void {
  if (typeof window === 'undefined') return;

  // Check if already initialized
  if (isGoogleTranslateAvailable()) {
    // Change language if already initialized
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = targetLanguage;
      select.dispatchEvent(new Event('change'));
    }
    return;
  }

  // Load Google Translate script
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  // Initialize callback
  (window as any).googleTranslateElementInit = function () {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en', // Source language
        includedLanguages: 'en,id,zh-CN,es,fr,de,ja,ko,pt,ru,ar', // Supported languages
        layout: (window as any).google.translate.TranslateElement.InlineLayout
          .SIMPLE,
        autoDisplay: false,
      },
      containerId
    );

    // Auto-select target language after initialization
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select && targetLanguage !== 'en') {
        select.value = targetLanguage;
        select.dispatchEvent(new Event('change'));
      }
    }, 1000);
  };
}

/**
 * Trigger translation for a specific language
 * Works with both browser translation and Google Translate
 */
export function translatePage(config: TranslationConfig): void {
  const { targetLanguage, sourceLanguage = 'en' } = config;

  // Set HTML lang attribute (works for all browsers)
  setPageLanguage(targetLanguage);

  // If target is same as source, no translation needed
  if (targetLanguage === sourceLanguage) {
    // Reset translation if any
    if (isGoogleTranslateAvailable()) {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change'));
      }
    }
    return;
  }

  // Detect browser capability
  const { supported, browser } = detectBrowserTranslationSupport();

  if (supported) {
    // Browser has built-in translation, just set lang attribute
    // Chrome/Edge will offer to translate automatically
    console.log(
      `[Translation] ${browser} detected - setting lang="${targetLanguage}"`
    );
  } else {
    // Use Google Translate widget as fallback
    console.log(
      `[Translation] Using Google Translate widget for ${targetLanguage}`
    );
    initGoogleTranslateWidget(targetLanguage);
  }
}

/**
 * Get current page language
 */
export function getCurrentPageLanguage(): string {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Clear translation and reset to original language
 */
export function clearTranslation(): void {
  setPageLanguage('en');

  if (isGoogleTranslateAvailable()) {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }
  }
}

/**
 * Language mapping for Google Translate codes
 */
export const LANGUAGE_CODES: Record<string, string> = {
  en: 'en', // English
  id: 'id', // Indonesian
  zh: 'zh-CN', // Chinese (Simplified)
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  es: 'es', // Spanish
  fr: 'fr', // French
  de: 'de', // German
  ja: 'ja', // Japanese
  ko: 'ko', // Korean
  pt: 'pt', // Portuguese
  ru: 'ru', // Russian
  ar: 'ar', // Arabic
  hi: 'hi', // Hindi
  th: 'th', // Thai
  vi: 'vi', // Vietnamese
};

/**
 * Convert internal language code to Google Translate code
 */
export function toGoogleTranslateCode(languageCode: string): string {
  return LANGUAGE_CODES[languageCode] || languageCode;
}
