import * as React from 'react';
import { cn } from 'cn';
import { UI } from '@/components/layout/layoutStyles';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(UI.ui.input, className)}
      {...props}
    />
  );
}

export { Input };
