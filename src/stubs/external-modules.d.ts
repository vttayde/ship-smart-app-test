// Temporary ambient module stubs to silence TypeScript "Cannot find module" errors.
// Replace by installing real packages or removing when environment fixed.
declare module 'bcryptjs' {
  export function hash(data: string, salt: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  const _default: { hash: typeof hash; compare: typeof compare };
  export default _default;
}

declare module 'clsx' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ClassValue = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function clsx(...inputs: any[]): string;
  export default clsx;
}

declare module 'tailwind-merge' {
  export function twMerge(...classes: string[]): string;
}

declare module 'class-variance-authority' {
  export type VariantProps = unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function cva(base?: string, config?: any): (...args: any[]) => string;
}

declare module 'razorpay' {
  interface RazorpayOrder {
    id: string; amount: number; currency: string; status: string;
  }
  export default class Razorpay {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(opts: any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orders: { create(opts: any): Promise<RazorpayOrder> };
  }
}

declare module '@googlemaps/google-maps-services-js' {
  export class Client { geocode(_args: unknown): Promise<unknown>; };
}

declare module '@auth/prisma-adapter' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function PrismaAdapter(client: any): any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'next-auth/providers/google' { const GoogleProvider: any; export default GoogleProvider; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'next-auth/providers/credentials' { const CredentialsProvider: any; export default CredentialsProvider; }