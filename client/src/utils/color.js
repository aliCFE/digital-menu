export function darken(hex, percent) {
  if (!hex) return hex;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const amount = Math.round(2.55 * percent);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function themeToCssVars(theme) {
  if (!theme) return {};
  const text = theme.text;
  const vars = {
    '--color-primary': theme.primary,
    '--color-primary-shadow': theme.primary ? darken(theme.primary, 22) : undefined,
    '--color-price': theme.secondary || theme.primary,
    '--color-bg': theme.background,
    '--color-surface': theme.surface,
    // Solid panels (bottom sheets, cart drawer) use the same surface color —
    // without this they'd stay on the dark-theme default and clash.
    '--color-surface-solid': theme.surface,
    '--color-text': text,
    '--color-text-muted': text ? `color-mix(in srgb, ${text} 64%, transparent)` : undefined,
    '--color-text-faint': text ? `color-mix(in srgb, ${text} 42%, transparent)` : undefined,
    '--color-border': text ? `color-mix(in srgb, ${text} 12%, transparent)` : undefined,
    '--color-button-text': theme.buttonText,
    '--radius-card': theme.radius !== undefined ? `${theme.radius}px` : undefined,
  };
  if (theme.font) {
    vars['--font-main'] = `'${theme.font}', 'Cairo', 'Inter', system-ui, sans-serif`;
  }
  Object.keys(vars).forEach((key) => vars[key] === undefined && delete vars[key]);
  return vars;
}
