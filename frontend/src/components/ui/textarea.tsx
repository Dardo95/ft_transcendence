import * as React from 'react';
import { cn } from 'cn';
import { UI } from '@/components/layout/layoutStyles';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(UI.ui.textarea, className)}
      {...props}
    />
  );
}

export { Textarea };
