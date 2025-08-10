/* eslint-disable @typescript-eslint/no-explicit-any */
import { Template, PageSection } from "@/types/page-builder";
import { TemplateManifest } from "@/types/template-system";
import DOMPurify from "dompurify";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  securityIssues: SecurityIssue[];
}

export interface SecurityIssue {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type:
    | "XSS"
    | "INJECTION"
    | "MALICIOUS_CODE"
    | "SUSPICIOUS_CONTENT"
    | "PRIVACY_LEAK";
  description: string;
  location: string;
  suggestion?: string;
}

export interface ValidationConfig {
  strictMode: boolean;
  allowCustomJS: boolean;
  allowExternalResources: boolean;
  maxSectionDepth: number;
  maxSectionsPerPage: number;
  requiredFields: string[];
  allowedDomains: string[];
}

export class TemplateValidator {
  private static readonly DEFAULT_CONFIG: ValidationConfig = {
    strictMode: true,
    allowCustomJS: false,
    allowExternalResources: false,
    maxSectionDepth: 10,
    maxSectionsPerPage: 100,
    requiredFields: ["name", "description", "category"],
    allowedDomains: [],
  };

  private static readonly DANGEROUS_PATTERNS = [
    // Script injection patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,

    // SQL injection patterns
    /union\s+select/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,

    // Command injection
    /\$\(.*\)/g,
    /`.*`/g,
    /eval\s*\(/gi,
    /function\s*\(/gi,

    // Suspicious URLs
    /https?:\/\/[^\s"'>]*\.(exe|bat|cmd|scr|msi)/gi,
  ];

  private static readonly SUSPICIOUS_KEYWORDS = [
    "eval",
    "document.write",
    "innerHTML",
    "outerHTML",
    "document.cookie",
    "localStorage",
    "sessionStorage",
    "XMLHttpRequest",
    "fetch",
    "import",
    "require",
  ];

  /**
   * Validate complete template package
   */
  static async validateTemplate(
    template: Template,
    manifest?: TemplateManifest,
    config: Partial<ValidationConfig> = {}
  ): Promise<ValidationResult> {
    const validationConfig = { ...this.DEFAULT_CONFIG, ...config };
    const errors: string[] = [];
    const warnings: string[] = [];
    const securityIssues: SecurityIssue[] = [];

    try {
      // Basic structure validation
      this.validateBasicStructure(template, errors, warnings);

      // Manifest validation
      if (manifest) {
        this.validateManifest(manifest, template, errors, warnings);
      }

      // Section validation
      this.validateSections(
        template.sections,
        validationConfig,
        errors,
        warnings,
        securityIssues
      );

      // Security validation
      await this.performSecurityValidation(
        template,
        validationConfig,
        securityIssues
      );

      // Asset validation
      this.validateAssets(template.assets, validationConfig, errors, warnings);

      // Global styles validation
      if (template.globalStyles) {
        this.validateGlobalStyles(
          template.globalStyles,
          validationConfig,
          securityIssues
        );
      }

      return {
        isValid:
          errors.length === 0 &&
          !securityIssues.some((issue) => issue.severity === "CRITICAL"),
        errors,
        warnings,
        securityIssues,
      };
    } catch (error) {
      errors.push(
        `Validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      return {
        isValid: false,
        errors,
        warnings,
        securityIssues,
      };
    }
  }

  /**
   * Validate basic template structure
   */
  private static validateBasicStructure(
    template: Template,
    errors: string[],
    warnings: string[]
  ): void {
    // Required fields
    if (!template.name || template.name.trim().length === 0) {
      errors.push("Template name is required");
    }

    if (!template.category) {
      errors.push("Template category is required");
    }

    if (!template.sections || !Array.isArray(template.sections)) {
      errors.push("Template must have sections array");
      return;
    }

    if (template.sections.length === 0) {
      warnings.push("Template has no sections");
    }

    // Version validation
    if (!template.version || !/^\d+\.\d+\.\d+$/.test(template.version)) {
      warnings.push("Invalid or missing version format (expected: x.y.z)");
    }

    // Tags validation
    if (template.tags && template.tags.length > 20) {
      warnings.push("Too many tags (maximum 20 recommended)");
    }

    // Difficulty validation
    const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (!validDifficulties.includes(template.difficulty)) {
      errors.push(`Invalid difficulty level: ${template.difficulty}`);
    }
  }

  /**
   * Validate manifest against template
   */
  private static validateManifest(
    manifest: TemplateManifest,
    template: Template,
    errors: string[],
    warnings: string[]
  ): void {
    // Check consistency
    if (manifest.name !== template.name) {
      warnings.push("Manifest name differs from template name");
    }

    if (manifest.category !== template.category) {
      errors.push("Manifest category must match template category");
    }

    if (manifest.assets.length !== template.assets.length) {
      warnings.push("Asset count mismatch between manifest and template");
    }

    // Validate manifest structure
    if (!manifest.author || !manifest.author.name) {
      errors.push("Manifest must include author information");
    }

    if (!manifest.compatibility || !manifest.compatibility.minVersion) {
      warnings.push("Manifest should specify compatibility requirements");
    }
  }

  /**
   * Validate sections
   */
  private static validateSections(
    sections: PageSection[],
    config: ValidationConfig,
    errors: string[],
    warnings: string[],
    securityIssues: SecurityIssue[]
  ): void {
    if (sections.length > config.maxSectionsPerPage) {
      warnings.push(
        `Too many sections (${sections.length}). Maximum recommended: ${config.maxSectionsPerPage}`
      );
    }

    const sectionIds = new Set<string>();
    const orderNumbers = new Set<number>();

    sections.forEach((section, index) => {
      // ID uniqueness
      if (sectionIds.has(section.id)) {
        errors.push(`Duplicate section ID: ${section.id}`);
      }
      sectionIds.add(section.id);

      // Order validation
      if (orderNumbers.has(section.order)) {
        warnings.push(`Duplicate order number: ${section.order}`);
      }
      orderNumbers.add(section.order);

      // Section-specific validation
      this.validateSection(
        section,
        config,
        errors,
        warnings,
        securityIssues,
        index
      );
    });
  }

  /**
   * Validate individual section
   */
  private static validateSection(
    section: PageSection,
    config: ValidationConfig,
    errors: string[],
    warnings: string[],
    securityIssues: SecurityIssue[],
    index: number
  ): void {
    const sectionContext = `Section ${index + 1} (${section.type})`;

    // Basic validation
    if (!section.id || section.id.length === 0) {
      errors.push(`${sectionContext}: Missing section ID`);
    }

    if (!section.type) {
      errors.push(`${sectionContext}: Missing section type`);
    }

    if (typeof section.order !== "number") {
      errors.push(`${sectionContext}: Invalid order value`);
    }

    // Translations validation
    if (!section.translations || section.translations.length === 0) {
      warnings.push(`${sectionContext}: No translations provided`);
    } else {
      section.translations.forEach((translation, tIndex) => {
        this.validateTranslation(
          translation,
          config,
          securityIssues,
          `${sectionContext} Translation ${tIndex + 1}`
        );
      });
    }

    // Settings validation
    this.validateSectionSettings(
      section,
      config,
      warnings,
      securityIssues,
      sectionContext
    );
  }

  /**
   * Validate section translation
   */
  private static validateTranslation(
    translation: any,
    config: ValidationConfig,
    securityIssues: SecurityIssue[],
    context: string
  ): void {
    if (!translation.languageId) {
      securityIssues.push({
        severity: "MEDIUM",
        type: "SUSPICIOUS_CONTENT",
        description: "Translation missing language ID",
        location: context,
      });
    }

    // Content security validation
    [translation.title, translation.subtitle, translation.content].forEach(
      (content, i) => {
        if (content) {
          const fieldNames = ["title", "subtitle", "content"];
          this.validateTextContent(
            content,
            config,
            securityIssues,
            `${context} ${fieldNames[i]}`
          );
        }
      }
    );

    // Metadata validation
    if (translation.metadata) {
      this.validateMetadata(
        translation.metadata,
        config,
        securityIssues,
        context
      );
    }
  }

  /**
   * Validate text content for security issues
   */
  private static validateTextContent(
    content: string,
    config: ValidationConfig,
    securityIssues: SecurityIssue[],
    location: string
  ): void {
    // Check for dangerous patterns
    this.DANGEROUS_PATTERNS.forEach((pattern) => {
      if (pattern.test(content)) {
        securityIssues.push({
          severity: "HIGH",
          type: "XSS",
          description: `Potentially dangerous pattern detected: ${pattern.source}`,
          location,
          suggestion: "Remove or sanitize the suspicious content",
        });
      }
    });

    // Check for suspicious keywords
    this.SUSPICIOUS_KEYWORDS.forEach((keyword) => {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        securityIssues.push({
          severity: "MEDIUM",
          type: "SUSPICIOUS_CONTENT",
          description: `Suspicious keyword detected: ${keyword}`,
          location,
          suggestion: "Review the content for potential security risks",
        });
      }
    });

    // URL validation
    const urls = this.extractUrls(content);
    urls.forEach((url) => {
      this.validateUrl(url, config, securityIssues, location);
    });
  }

  /**
   * Validate section settings
   */
  private static validateSectionSettings(
    section: PageSection,
    config: ValidationConfig,
    warnings: string[],
    securityIssues: SecurityIssue[],
    context: string
  ): void {
    // Custom settings validation
    if (section.customSettings) {
      if (section.customSettings.customJS && !config.allowCustomJS) {
        securityIssues.push({
          severity: "HIGH",
          type: "MALICIOUS_CODE",
          description: "Custom JavaScript not allowed in current configuration",
          location: `${context} customSettings`,
          suggestion:
            "Remove custom JavaScript or enable allowCustomJS in configuration",
        });
      }

      if (section.customSettings.customCSS) {
        this.validateCustomCSS(
          section.customSettings.customCSS,
          config,
          securityIssues,
          `${context} customCSS`
        );
      }

      if (section.customSettings.attributes) {
        this.validateCustomAttributes(
          section.customSettings.attributes,
          securityIssues,
          `${context} attributes`
        );
      }
    }

    // Animation settings validation
    if (section.animationSettings?.customCode) {
      securityIssues.push({
        severity: "MEDIUM",
        type: "SUSPICIOUS_CONTENT",
        description: "Custom animation code detected",
        location: `${context} animationSettings`,
        suggestion: "Review custom animation code for security risks",
      });
    }
  }

  /**
   * Validate custom CSS
   */
  private static validateCustomCSS(
    css: string,
    config: ValidationConfig,
    securityIssues: SecurityIssue[],
    location: string
  ): void {
    // Check for CSS injection patterns
    const dangerousCSS = [
      /expression\s*\(/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:.*base64/gi,
      /@import/gi,
      /behavior:/gi,
    ];

    dangerousCSS.forEach((pattern) => {
      if (pattern.test(css)) {
        securityIssues.push({
          severity: "HIGH",
          type: "INJECTION",
          description: `Dangerous CSS pattern detected: ${pattern.source}`,
          location,
          suggestion: "Remove or replace the dangerous CSS pattern",
        });
      }
    });
  }

  /**
   * Validate custom attributes
   */
  private static validateCustomAttributes(
    attributes: Record<string, string>,
    securityIssues: SecurityIssue[],
    location: string
  ): void {
    Object.entries(attributes).forEach(([key, value]) => {
      // Check for event handlers
      if (key.toLowerCase().startsWith("on")) {
        securityIssues.push({
          severity: "HIGH",
          type: "XSS",
          description: `Event handler attribute detected: ${key}`,
          location,
          suggestion: "Remove event handler attributes",
        });
      }

      // Check for dangerous attribute values
      if (value && /javascript:|data:|vbscript:/.test(value)) {
        securityIssues.push({
          severity: "HIGH",
          type: "XSS",
          description: `Dangerous attribute value: ${key}="${value}"`,
          location,
          suggestion: "Use safe attribute values",
        });
      }
    });
  }

  /**
   * Validate metadata object
   */
  private static validateMetadata(
    metadata: Record<string, any>,
    config: ValidationConfig,
    securityIssues: SecurityIssue[],
    location: string
  ): void {
    // Check for nested objects that might contain malicious content
    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === "string") {
        this.validateTextContent(
          value,
          config,
          securityIssues,
          `${location} metadata.${key}`
        );
      } else if (typeof value === "object" && value !== null) {
        // Recursive validation for nested objects
        this.validateMetadata(
          value,
          config,
          securityIssues,
          `${location} metadata.${key}`
        );
      }
    });
  }

  /**
   * Validate URLs
   */
  private static validateUrl(
    url: string,
    config: ValidationConfig,
    securityIssues: SecurityIssue[],
    location: string
  ): void {
    try {
      const urlObj = new URL(url);

      // Check protocol
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        securityIssues.push({
          severity: "HIGH",
          type: "SUSPICIOUS_CONTENT",
          description: `Suspicious URL protocol: ${urlObj.protocol}`,
          location,
          suggestion: "Use only HTTP/HTTPS URLs",
        });
      }

      // Check against allowed domains
      if (
        config.allowedDomains.length > 0 &&
        !config.allowedDomains.includes(urlObj.hostname)
      ) {
        securityIssues.push({
          severity: "MEDIUM",
          type: "PRIVACY_LEAK",
          description: `External domain not in allowlist: ${urlObj.hostname}`,
          location,
          suggestion: "Use only approved external domains",
        });
      }

      // Check for suspicious file extensions
      if (/\.(exe|bat|cmd|scr|msi|dll)$/i.test(urlObj.pathname)) {
        securityIssues.push({
          severity: "CRITICAL",
          type: "MALICIOUS_CODE",
          description: `Potentially malicious file extension in URL: ${url}`,
          location,
          suggestion: "Remove URLs pointing to executable files",
        });
      }
    } catch {
      securityIssues.push({
        severity: "LOW",
        type: "SUSPICIOUS_CONTENT",
        description: `Invalid URL format: ${url}`,
        location,
      });
    }
  }

  /**
   * Validate assets
   */
  private static validateAssets(
    assets: any[],
    config: ValidationConfig,
    errors: string[],
    warnings: string[]
  ): void {
    if (!Array.isArray(assets)) {
      errors.push("Assets must be an array");
      return;
    }

    assets.forEach((asset, index) => {
      if (!asset.id) {
        errors.push(`Asset ${index + 1}: Missing ID`);
      }

      if (!asset.type) {
        errors.push(`Asset ${index + 1}: Missing type`);
      }

      if (!asset.name) {
        errors.push(`Asset ${index + 1}: Missing name`);
      }

      if (asset.size && asset.size > 10 * 1024 * 1024) {
        // 10MB
        warnings.push(
          `Asset ${index + 1}: Large file size (${Math.round(
            asset.size / 1024 / 1024
          )}MB)`
        );
      }
    });
  }

  /**
   * Validate global styles
   */
  private static validateGlobalStyles(
    globalStyles: any,
    config: ValidationConfig,
    securityIssues: SecurityIssue[]
  ): void {
    if (globalStyles.customCSS) {
      this.validateCustomCSS(
        globalStyles.customCSS,
        config,
        securityIssues,
        "Global CSS"
      );
    }

    if (globalStyles.externalStylesheets) {
      globalStyles.externalStylesheets.forEach((url: string, index: number) => {
        this.validateUrl(
          url,
          config,
          securityIssues,
          `External stylesheet ${index + 1}`
        );
      });
    }
  }

  /**
   * Perform comprehensive security validation
   */
  private static async performSecurityValidation(
    template: Template,
    config: ValidationConfig,
    securityIssues: SecurityIssue[]
  ): Promise<void> {
    // Convert template to JSON string for pattern matching
    const templateString = JSON.stringify(template);

    // Look for base64 encoded content that might hide malicious code
    const base64Matches = templateString.match(/[A-Za-z0-9+/]{20,}={0,2}/g);
    if (base64Matches && base64Matches.length > 0) {
      securityIssues.push({
        severity: "MEDIUM",
        type: "SUSPICIOUS_CONTENT",
        description: `Found ${base64Matches.length} base64-like strings`,
        location: "Template content",
        suggestion: "Review base64 content for potential security risks",
      });
    }

    // Check for unusual patterns that might indicate obfuscation
    const suspiciousPatterns = [
      /\\u[0-9a-f]{4}/gi, // Unicode escape sequences
      /\\x[0-9a-f]{2}/gi, // Hex escape sequences
      /eval|Function/gi, // Dynamic code execution
      /document\[/gi, // Property access obfuscation
    ];

    suspiciousPatterns.forEach((pattern) => {
      const matches = templateString.match(pattern);
      if (matches && matches.length > 5) {
        // Allow some legitimate usage
        securityIssues.push({
          severity: "MEDIUM",
          type: "SUSPICIOUS_CONTENT",
          description: `Multiple instances of suspicious pattern: ${pattern.source}`,
          location: "Template content",
          suggestion: "Review for potential code obfuscation",
        });
      }
    });
  }

  /**
   * Extract URLs from text content
   */
  private static extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
    return text.match(urlRegex) || [];
  }
}

// ===== SANITIZATION FUNCTIONS =====

export async function sanitizeTemplateData(
  template: Template,
  securityLevel: "STRICT" | "MODERATE" | "PERMISSIVE" = "STRICT"
): Promise<Template> {
  const sanitized = JSON.parse(JSON.stringify(template)); // Deep clone

  // Sanitize sections
  sanitized.sections = await Promise.all(
    template.sections.map((section) => sanitizeSection(section, securityLevel))
  );

  // Sanitize global styles
  if (sanitized.globalStyles?.customCSS) {
    sanitized.globalStyles.customCSS = sanitizeCSS(
      sanitized.globalStyles.customCSS,
      securityLevel
    );
  }

  return sanitized;
}

async function sanitizeSection(
  section: PageSection,
  securityLevel: string
): Promise<PageSection> {
  const sanitized = { ...section };

  // Sanitize translations
  sanitized.translations = section.translations.map((translation) => ({
    ...translation,
    title: translation.title
      ? DOMPurify.sanitize(translation.title)
      : translation.title,
    subtitle: translation.subtitle
      ? DOMPurify.sanitize(translation.subtitle)
      : translation.subtitle,
    content: translation.content
      ? DOMPurify.sanitize(translation.content)
      : translation.content,
  }));

  // Remove dangerous custom settings in strict mode
  if (securityLevel === "STRICT") {
    if (sanitized.customSettings) {
      if ("customJS" in sanitized.customSettings) {
        delete (sanitized.customSettings as any).customJS;
      }
      if (sanitized.customSettings.customCSS) {
        sanitized.customSettings.customCSS = sanitizeCSS(
          sanitized.customSettings.customCSS,
          securityLevel
        );
      }
    }
  }

  return sanitized;
}

function sanitizeCSS(css: string, securityLevel: string): string {
  // Remove dangerous CSS patterns
  let sanitized = css
    .replace(/expression\s*\([^)]*\)/gi, "")
    .replace(/javascript:[^;]*/gi, "")
    .replace(/vbscript:[^;]*/gi, "")
    .replace(/@import[^;]*/gi, "");

  if (securityLevel === "STRICT") {
    sanitized = sanitized.replace(/url\([^)]*\)/gi, "");
  }

  if (securityLevel === "MODERATE") {
    sanitized = sanitized.replace(/url\([^)]*\)/gi, "");
  }

  if (securityLevel === "PERMISSIVE") {
    sanitized = sanitized.replace(/url\([^)]*\)/gi, "");
  }

  return sanitized;
}
