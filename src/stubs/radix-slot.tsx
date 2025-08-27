// Temporary stub for @radix-ui/react-slot
// Provides a simple pass-through component behaving like React.Fragment
// Replace with real package once dependencies install correctly.
import * as React from 'react';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...rest },
  ref
) {
  // Render a span by default to allow DOM attributes; if child is a single element, clone it.
  if (React.isValidElement(children)) {
    return React.cloneElement(children as any, { ref, ...rest });
  }
  return (
    <span ref={ref as any} {...rest}>
      {children}
    </span>
  );
});

export default Slot;
