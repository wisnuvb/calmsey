// src/lib/translation-utils.ts
interface Translation {
  languageId: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export class TranslationManager {
  /**
   * Validate if translation is complete
   */
  static isTranslationComplete(translation: Translation): boolean {
    return !!(translation.title?.trim() && translation.content?.trim());
  }

  /**
   * Get translation completion percentage
   */
  static getCompletionPercentage(
    translations: Translation[],
    availableLanguages: number
  ): number {
    if (availableLanguages === 0) return 0;
    const completeTranslations = translations.filter((t) =>
      this.isTranslationComplete(t)
    );
    return Math.round((completeTranslations.length / availableLanguages) * 100);
  }

  /**
   * Get missing languages for content
   */
  static getMissingLanguages(
    translations: Translation[],
    allLanguages: string[]
  ): string[] {
    const existingLanguages = translations.map((t) => t.languageId);
    return allLanguages.filter((lang) => !existingLanguages.includes(lang));
  }

  /**
   * Get translation status summary
   */
  static getTranslationStatus(
    translations: Translation[],
    availableLanguages: number
  ) {
    const complete = translations.filter((t) =>
      this.isTranslationComplete(t)
    ).length;
    const total = translations.length;
    const percentage = this.getCompletionPercentage(
      translations,
      availableLanguages
    );

    return {
      total,
      complete,
      incomplete: total - complete,
      missing: availableLanguages - total,
      percentage,
      status:
        percentage === 100
          ? "complete"
          : percentage >= 50
          ? "partial"
          : "incomplete",
    };
  }

  /**
   * Sort translations by language priority (default first, then alphabetical)
   */
  static sortTranslations(
    translations: Translation[],
    defaultLanguage = "en"
  ): Translation[] {
    return [...translations].sort((a, b) => {
      if (a.languageId === defaultLanguage) return -1;
      if (b.languageId === defaultLanguage) return 1;
      return a.languageId.localeCompare(b.languageId);
    });
  }

  /**
   * Generate SEO title from regular title if empty
   */
  static generateSeoTitle(translation: Translation): string {
    return translation.seoTitle || translation.title;
  }

  /**
   * Generate excerpt from content if empty
   */
  static generateExcerpt(translation: Translation, maxLength = 160): string {
    if (translation.excerpt) return translation.excerpt;

    // Strip HTML tags and get first paragraph
    const plainText = translation.content.replace(/<[^>]*>/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength).trim() + "..."
      : plainText;
  }

  /**
   * Validate all translations for required fields
   */
  static validateTranslations(translations: Translation[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if at least one translation exists
    if (translations.length === 0) {
      errors.push("At least one translation is required");
    }

    // Check if default language exists
    const hasDefaultLanguage = translations.some((t) => t.languageId === "en");
    if (!hasDefaultLanguage) {
      errors.push("English translation is required");
    }

    // Check each translation
    translations.forEach((translation, index) => {
      if (!translation.title?.trim()) {
        errors.push(
          `Translation ${index + 1} (${
            translation.languageId
          }): Title is required`
        );
      }
      if (!translation.content?.trim()) {
        errors.push(
          `Translation ${index + 1} (${
            translation.languageId
          }): Content is required`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Prepare translations for API submission
   */
  static prepareForSubmission(translations: Translation[]): Translation[] {
    return translations
      .filter((t) => t.title?.trim()) // Only include translations with titles
      .map((t) => ({
        ...t,
        title: t.title.trim(),
        content: t.content?.trim() || "",
        excerpt: t.excerpt?.trim() || undefined,
        seoTitle: t.seoTitle?.trim() || undefined,
        seoDescription: t.seoDescription?.trim() || undefined,
      }));
  }
}
