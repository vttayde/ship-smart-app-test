// Minimal runtime stub for 'clsx'
export type ClassValue = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export function clsx(...inputs: any[]): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  return inputs
    .flat()
    .filter(Boolean)
    .map(v => {
      if (typeof v === 'string') return v;
      if (typeof v === 'object') {
        return Object.entries(v)
          .filter(([, val]) => !!val)
            .map(([key]) => key)
            .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ') 
    .trim();
}
export default clsx;
