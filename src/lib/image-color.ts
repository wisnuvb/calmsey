/**
 * Convert hex color to a light harmonious tint for background
 * Uses 95% lightness to create soft, complementary bg from dominant color
 */
export function hexToLightTint(hex: string, lightness = 95): string {
  if (!hex || !hex.startsWith("#")) return "#e5e7eb";

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "#e5e7eb";

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }

  h *= 360;
  s = Math.min(s * 100 * 0.5, 30);
  const newL = lightness / 100;

  const c = (1 - Math.abs(2 * newL - 1)) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = newL - c / 2;

  let nr = 0;
  let ng = 0;
  let nb = 0;

  if (h >= 0 && h < 60) {
    nr = c; ng = x; nb = 0;
  } else if (h >= 60 && h < 120) {
    nr = x; ng = c; nb = 0;
  } else if (h >= 120 && h < 180) {
    nr = 0; ng = c; nb = x;
  } else if (h >= 180 && h < 240) {
    nr = 0; ng = x; nb = c;
  } else if (h >= 240 && h < 300) {
    nr = x; ng = 0; nb = c;
  } else {
    nr = c; ng = 0; nb = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}
