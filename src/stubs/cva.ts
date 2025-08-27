// Temporary stub for 'class-variance-authority'
// Provides minimal cva to combine base + variant classes.
export type CvaConfig = { variants?: Record<string, Record<string, string>>; defaultVariants?: Record<string, string> };

export function cva(base: string = '', config: CvaConfig = {}) {
  return function(options: Record<string, string | undefined> = {}) {
    const classes = [base];
    const { variants = {}, defaultVariants = {} } = config;
    for (const variantKey of Object.keys(variants)) {
      const value = options[variantKey] || defaultVariants[variantKey];
      if (value && variants[variantKey][value]) classes.push(variants[variantKey][value]);
    }
    if (options.className) classes.push(String(options.className));
    return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }
}

export type VariantProps = Record<string, unknown>;
