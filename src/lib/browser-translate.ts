/* eslint-disable @typescript-eslint/no-explicit-any */
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
 * Set Google Translate cookie to persist translation preference
 * This helps ensure translation persists across page loads
 */
function setGoogleTranslateCookie(languageCode: string): void {
  if (typeof document === "undefined") return;

  // Google Translate uses this cookie format
  const cookieName = "googtrans";
  const cookieValue = `/en/${languageCode}`;

  // Set cookie with long expiration (1 year)
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

  // Also set the domain cookie if we're not on localhost
  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost")
  ) {
    const domain = window.location.hostname.split(".").slice(-2).join(".");
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; domain=.${domain}; SameSite=Lax`;
  }
}

/**
 * Set the HTML lang attribute to trigger browser translation
 * Also updates meta tags for SEO
 */
export function setPageLanguage(languageCode: string): void {
  if (typeof document !== "undefined") {
    // Set HTML lang attribute
    document.documentElement.lang = languageCode;

    // Also set dir attribute for RTL languages
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    document.documentElement.dir = rtlLanguages.includes(languageCode)
      ? "rtl"
      : "ltr";

    // Update or create content-language meta tag
    let contentLangMeta = document.querySelector(
      'meta[http-equiv="content-language"]'
    );
    if (!contentLangMeta) {
      contentLangMeta = document.createElement("meta");
      contentLangMeta.setAttribute("http-equiv", "content-language");
      document.head.appendChild(contentLangMeta);
    }
    contentLangMeta.setAttribute("content", languageCode);

    // Update og:locale meta tag for social sharing
    let ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
    if (!ogLocaleMeta) {
      ogLocaleMeta = document.createElement("meta");
      ogLocaleMeta.setAttribute("property", "og:locale");
      document.head.appendChild(ogLocaleMeta);
    }
    // Convert language code to locale format (e.g., 'id' -> 'id_ID', 'en' -> 'en_US')
    // Default locale mapping - uses country code based on primary usage
    const localeMap: Record<string, string> = {
      en: "en_US",
      id: "id_ID",
      zh: "zh_CN",
      "zh-CN": "zh_CN",
      "zh-TW": "zh_TW",
      es: "es_ES",
      fr: "fr_FR",
      de: "de_DE",
      ja: "ja_JP",
      ko: "ko_KR",
      pt: "pt_BR",
      ru: "ru_RU",
      ar: "ar_SA",
      hi: "hi_IN",
      th: "th_TH",
      vi: "vi_VN",
      tr: "tr_TR",
      it: "it_IT",
      pl: "pl_PL",
      nl: "nl_NL",
      uk: "uk_UA",
      fa: "fa_IR",
      sv: "sv_SE",
      no: "no_NO",
      da: "da_DK",
      fi: "fi_FI",
      cs: "cs_CZ",
      sk: "sk_SK",
      hu: "hu_HU",
      ro: "ro_RO",
      bg: "bg_BG",
      hr: "hr_HR",
      sr: "sr_RS",
      bs: "bs_BA",
      sl: "sl_SI",
      mk: "mk_MK",
      sq: "sq_AL",
      el: "el_GR",
      mt: "mt_MT",
      is: "is_IS",
      ga: "ga_IE",
      cy: "cy_GB",
      et: "et_EE",
      lv: "lv_LV",
      lt: "lt_LT",
      be: "be_BY",
      bn: "bn_BD",
      ur: "ur_PK",
      ta: "ta_IN",
      ms: "ms_MY",
      he: "he_IL",
      // For languages without specific locale, use language code as fallback
    };
    ogLocaleMeta.setAttribute(
      "content",
      localeMap[languageCode] || languageCode
    );

    // Store preference in localStorage
    localStorage.setItem("preferredLanguage", languageCode);

    // Set Google Translate cookie for persistence
    if (languageCode !== "en") {
      setGoogleTranslateCookie(languageCode);
    }
  }
}

/**
 * Get stored language preference
 */
export function getPreferredLanguage(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("preferredLanguage");
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
  if (typeof navigator === "undefined") {
    return { supported: false, browser: "unknown" };
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Chrome and Edge have built-in Google Translate
  if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
    return { supported: true, browser: "chrome" };
  }

  if (userAgent.includes("edg")) {
    return { supported: true, browser: "edge" };
  }

  // Safari has limited translation support
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return { supported: false, browser: "safari" };
  }

  // Firefox doesn't have built-in translation
  if (userAgent.includes("firefox")) {
    return { supported: false, browser: "firefox" };
  }

  return { supported: false, browser: "other" };
}

/**
 * Check if Google Translate is available
 */
export function isGoogleTranslateAvailable(): boolean {
  if (typeof window === "undefined") return false;

  return (
    typeof (window as any).google !== "undefined" &&
    typeof (window as any).google.translate !== "undefined"
  );
}

/**
 * Wait for Google Translate select element to be available
 * Uses polling to check for element availability
 */
function waitForTranslateSelect(
  callback: (select: HTMLSelectElement) => void,
  maxAttempts = 20,
  interval = 200
): void {
  let attempts = 0;

  const checkSelect = () => {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (select) {
      callback(select);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkSelect, interval);
    } else {
      console.warn(
        "[Translation] Google Translate select element not found after max attempts"
      );
    }
  };

  checkSelect();
}

/**
 * Initialize Google Translate Widget
 * Fallback for browsers without built-in translation
 */
export function initGoogleTranslateWidget(
  targetLanguage: string,
  containerId = "google_translate_element"
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    // Check if already initialized
    if (isGoogleTranslateAvailable()) {
      // Change language if already initialized
      waitForTranslateSelect((select) => {
        if (select.value !== targetLanguage) {
          select.value = targetLanguage;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        resolve();
      });
      return;
    }

    // Store target language for callback
    (window as any).__targetTranslateLanguage = targetLanguage;
    (window as any).__translateResolve = resolve;

    // Load Google Translate script
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("[Translation] Failed to load Google Translate script");
        resolve();
      };
      document.head.appendChild(script);
    } else {
      // Script already loading, wait for it
      waitForTranslateSelect((select) => {
        if (select.value !== targetLanguage) {
          select.value = targetLanguage;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        resolve();
      });
      return;
    }

    // Initialize callback
    (window as any).googleTranslateElementInit = function () {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en", // Source language
            // Include all supported languages from LANGUAGE_CODES
            includedLanguages:
              "en,id,zh-CN,zh-TW,hi,es,ar,pt,ru,ja,fr,de,ko,tr,it,th,vi,pl,nl,uk,fa,af,am,sw,ha,yo,ig,zu,xh,so,rw,mg,sv,no,da,fi,cs,sk,hu,ro,bg,hr,sr,bs,sl,mk,sq,el,mt,is,ga,cy,et,lv,lt,be,md,bn,ur,ta,si,my,km,lo,mn,ne,dz,ka,hy,az,kk,ky,tg,tk,uz,ps,he,ms,tl,haw,fj,sm,to,tvl,pau,mh,na,qu,gn,ay,ht,ku,sn,ny,ts,ve,ss,st,tn,nd,ti,om,bi,ho,tpi,lb,rm,se,fo,kl,ug,bo,ii",
            layout: (window as any).google.translate.TranslateElement
              .InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          containerId
        );

        // Wait for select element and auto-translate
        waitForTranslateSelect((select) => {
          const targetLang =
            (window as any).__targetTranslateLanguage || targetLanguage;

          if (targetLang !== "en") {
            // Try multiple times to ensure translation happens
            const tryTranslate = (attempt = 0) => {
              if (select.value !== targetLang) {
                select.value = targetLang;
                // Use multiple event types to ensure it triggers
                select.dispatchEvent(new Event("change", { bubbles: true }));
                select.dispatchEvent(new Event("input", { bubbles: true }));

                // Also try click to ensure it's triggered
                if (select.parentElement) {
                  const clickEvent = new MouseEvent("click", { bubbles: true });
                  select.parentElement.dispatchEvent(clickEvent);
                }
              }

              // Retry if translation didn't happen
              if (attempt < 3) {
                setTimeout(() => tryTranslate(attempt + 1), 500);
              }
            };

            tryTranslate();
          }

          if ((window as any).__translateResolve) {
            (window as any).__translateResolve();
            delete (window as any).__translateResolve;
          }
        });
      } catch (error) {
        console.error(
          "[Translation] Error initializing Google Translate:",
          error
        );
        if ((window as any).__translateResolve) {
          (window as any).__translateResolve();
          delete (window as any).__translateResolve;
        }
      }
    };
  });
}

/**
 * Force Google Translate to translate the page immediately
 * Uses multiple methods to ensure translation happens
 */
async function forceGoogleTranslate(targetLanguage: string): Promise<void> {
  if (typeof window === "undefined") return;

  return new Promise((resolve) => {
    let translated = false;

    // Wait for select element and force translation
    waitForTranslateSelect(
      (select) => {
        if (translated) return;

        const attemptTranslate = () => {
          if (select.value !== targetLanguage) {
            select.value = targetLanguage;

            // Create and dispatch change event with all necessary properties
            const changeEvent = new Event("change", {
              bubbles: true,
              cancelable: true,
            });
            select.dispatchEvent(changeEvent);

            // Also dispatch input event
            const inputEvent = new Event("input", {
              bubbles: true,
              cancelable: true,
            });
            select.dispatchEvent(inputEvent);

            // Try to trigger via native setter (bypasses some restrictions)
            try {
              Object.getOwnPropertyDescriptor(
                HTMLSelectElement.prototype,
                "value"
              )?.set?.call(select, targetLanguage);
              select.dispatchEvent(changeEvent);
            } catch {
              // Ignore errors
            }

            // Use MutationObserver to detect when translation actually happens
            const observer = new MutationObserver(() => {
              // Check if page has been translated (Google Translate adds classes to body)
              const body = document.body;
              if (
                body.classList.contains("translated-ltr") ||
                body.classList.contains("translated-rtl") ||
                body.getAttribute("dir") !== null
              ) {
                translated = true;
                observer.disconnect();
                resolve();
              }
            });

            observer.observe(document.body, {
              attributes: true,
              attributeFilter: ["class", "dir"],
              childList: false,
              subtree: false,
            });

            // Timeout after 5 seconds
            setTimeout(() => {
              observer.disconnect();
              if (!translated) {
                console.log(
                  "[Translation] Translation may not have completed, but continuing..."
                );
                resolve();
              }
            }, 5000);
          } else {
            // Already translated
            translated = true;
            resolve();
          }
        };

        // Try immediately
        attemptTranslate();

        // Also try after a short delay (sometimes needed for widget to be fully ready)
        setTimeout(() => {
          if (!translated) {
            attemptTranslate();
          }
        }, 500);

        // Final retry after longer delay
        setTimeout(() => {
          if (!translated) {
            attemptTranslate();
            resolve(); // Resolve anyway after 3 seconds
          }
        }, 3000);
      },
      30,
      300
    ); // Wait up to 9 seconds (30 attempts * 300ms)
  });
}

/**
 * Trigger translation for a specific language
 * Works with both browser translation and Google Translate
 * Now forces immediate translation for all browsers
 */
export async function translatePage(config: TranslationConfig): Promise<void> {
  const { targetLanguage, sourceLanguage = "en" } = config;

  // Set HTML lang attribute (works for all browsers)
  setPageLanguage(targetLanguage);

  // If target is same as source, no translation needed
  if (targetLanguage === sourceLanguage) {
    // Reset translation if any
    if (isGoogleTranslateAvailable()) {
      waitForTranslateSelect((select) => {
        select.value = "";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
    return;
  }

  // Always use Google Translate widget for consistent auto-translation
  // This ensures immediate translation across all browsers
  console.log(
    `[Translation] Initializing Google Translate for ${targetLanguage}`
  );

  try {
    // Initialize widget and wait for it to be ready
    await initGoogleTranslateWidget(targetLanguage);

    // Force translation after widget is initialized
    await forceGoogleTranslate(targetLanguage);

    // Additional retry mechanism - check if translation happened
    setTimeout(() => {
      const select = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement;

      if (select && select.value !== targetLanguage) {
        console.log(`[Translation] Retrying translation to ${targetLanguage}`);
        select.value = targetLanguage;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 2000);
  } catch (error) {
    console.error("[Translation] Error during translation:", error);
  }
}

/**
 * Get current page language
 */
export function getCurrentPageLanguage(): string {
  if (typeof document !== "undefined") {
    return document.documentElement.lang || "en";
  }
  return "en";
}

/**
 * Clear translation and reset to original language
 */
export function clearTranslation(): void {
  setPageLanguage("en");

  if (isGoogleTranslateAvailable()) {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (select) {
      select.value = "";
      select.dispatchEvent(new Event("change"));
    }
  }
}

/**
 * Language mapping for Google Translate codes
 * Maps internal language codes to Google Translate language codes
 * Includes all languages from seed.ts
 */
export const LANGUAGE_CODES: Record<string, string> = {
  // Major World Languages
  en: "en", // English
  id: "id", // Indonesian
  zh: "zh-CN", // Chinese (Simplified)
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  hi: "hi", // Hindi
  es: "es", // Spanish
  ar: "ar", // Arabic
  pt: "pt", // Portuguese
  ru: "ru", // Russian
  ja: "ja", // Japanese
  fr: "fr", // French
  de: "de", // German
  ko: "ko", // Korean
  tr: "tr", // Turkish
  it: "it", // Italian
  th: "th", // Thai
  vi: "vi", // Vietnamese
  pl: "pl", // Polish
  nl: "nl", // Dutch
  uk: "uk", // Ukrainian
  fa: "fa", // Persian

  // Africa
  af: "af", // Afrikaans
  am: "am", // Amharic
  sw: "sw", // Swahili
  ha: "ha", // Hausa
  yo: "yo", // Yoruba
  ig: "ig", // Igbo
  zu: "zu", // Zulu
  xh: "xh", // Xhosa
  so: "so", // Somali
  rw: "rw", // Kinyarwanda
  mg: "mg", // Malagasy

  // Europe
  sv: "sv", // Swedish
  no: "no", // Norwegian
  da: "da", // Danish
  fi: "fi", // Finnish
  cs: "cs", // Czech
  sk: "sk", // Slovak
  hu: "hu", // Hungarian
  ro: "ro", // Romanian
  bg: "bg", // Bulgarian
  hr: "hr", // Croatian
  sr: "sr", // Serbian
  bs: "bs", // Bosnian
  sl: "sl", // Slovenian
  mk: "mk", // Macedonian
  sq: "sq", // Albanian
  el: "el", // Greek
  mt: "mt", // Maltese
  is: "is", // Icelandic
  ga: "ga", // Irish
  cy: "cy", // Welsh
  et: "et", // Estonian
  lv: "lv", // Latvian
  lt: "lt", // Lithuanian
  be: "be", // Belarusian
  md: "md", // Moldovan

  // Asia
  bn: "bn", // Bengali
  ur: "ur", // Urdu
  ta: "ta", // Tamil
  si: "si", // Sinhala
  my: "my", // Burmese
  km: "km", // Khmer
  lo: "lo", // Lao
  mn: "mn", // Mongolian
  ne: "ne", // Nepali
  dz: "dz", // Dzongkha
  ka: "ka", // Georgian
  hy: "hy", // Armenian
  az: "az", // Azerbaijani
  kk: "kk", // Kazakh
  ky: "ky", // Kyrgyz
  tg: "tg", // Tajik
  tk: "tk", // Turkmen
  uz: "uz", // Uzbek
  ps: "ps", // Pashto
  he: "he", // Hebrew

  // Southeast Asia & Pacific
  ms: "ms", // Malay
  tl: "tl", // Filipino/Tagalog
  haw: "haw", // Hawaiian
  fj: "fj", // Fijian
  sm: "sm", // Samoan
  to: "to", // Tongan
  tvl: "tvl", // Tuvaluan
  pau: "pau", // Palauan
  mh: "mh", // Marshallese
  na: "na", // Nauruan

  // Americas
  qu: "qu", // Quechua
  gn: "gn", // Guarani
  ay: "ay", // Aymara
  ht: "ht", // Haitian Creole

  // Middle East
  ku: "ku", // Kurdish

  // Additional African Languages
  sn: "sn", // Shona
  ny: "ny", // Chichewa
  ts: "ts", // Tsonga
  ve: "ve", // Venda
  ss: "ss", // Swati
  st: "st", // Sotho
  tn: "tn", // Tswana
  nd: "nd", // Northern Ndebele
  ti: "ti", // Tigrinya
  om: "om", // Oromo

  // Additional Pacific Languages
  bi: "bi", // Bislama
  ho: "ho", // Hiri Motu
  tpi: "tpi", // Tok Pisin

  // Additional European Languages
  lb: "lb", // Luxembourgish
  rm: "rm", // Romansh
  se: "se", // Northern Sami
  fo: "fo", // Faroese
  kl: "kl", // Greenlandic

  // Additional Asian Languages
  ug: "ug", // Uyghur
  bo: "bo", // Tibetan
  ii: "ii", // Sichuan Yi
};

/**
 * Convert internal language code to Google Translate code
 */
export function toGoogleTranslateCode(languageCode: string): string {
  return LANGUAGE_CODES[languageCode] || languageCode;
}
