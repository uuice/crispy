/** Default OKLCH hue — Crispy warm orange (~41°). */
export const DEFAULT_ADMIN_THEME_HUE = 41.116

export function normalizeAdminThemeHue(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) {
    return DEFAULT_ADMIN_THEME_HUE
  }

  return Math.min(360, Math.max(0, Math.round(value * 1000) / 1000))
}

export function adminThemeHueCss(hue: number): string {
  return `:root, html { --crispy-hue: ${normalizeAdminThemeHue(hue)}deg; }`
}
