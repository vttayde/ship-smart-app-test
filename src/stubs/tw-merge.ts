// Minimal runtime stub for 'tailwind-merge'
export function twMerge(...classes: string[]): string {
  // naive last-wins merge; real lib handles conflicting utilities
  return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
export default twMerge;
