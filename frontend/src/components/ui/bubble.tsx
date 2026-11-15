import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { UI } from '@/components/layout/layoutStyles';

function BubbleGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-group"
      className={cn(UI.ui.bubbleGroup, className)}
      {...props}
    />
  );
}

const bubbleVariants = cva(UI.ui.bubble, {
  variants: {
    variant: {
      // Own messages: solid primary surface
      primary: 'bg-primary font-medium text-primary-foreground',
      // Received messages: secondary steel surface
      secondary: 'border border-border bg-secondary text-secondary-foreground',
      // System messages: recessed surface with primary accent
      system: 'border border-primary/20 bg-background/70 text-primary italic',
    },
    align: {
      start: 'self-start rounded-bl-sm',
      end: 'self-end rounded-br-sm',
      center: 'self-center rounded-b-sm',
    },
  },
  defaultVariants: {
    variant: 'secondary',
    align: 'start',
  },
});

export interface BubbleProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

function Bubble({ className, variant, align, ...props }: BubbleProps) {
  return (
    <div
      data-slot="bubble"
      className={cn(bubbleVariants({ variant, align, className }))}
      {...props}
    />
  );
}

function BubbleContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-content"
      className={cn(UI.ui.bubbleContent, className)}
      {...props}
    />
  );
}

const bubbleReactionsVariants = cva(
  'absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0',
  {
    variants: {
      side: {
        top: 'top-0 -translate-y-3/4',
        bottom: 'bottom-0 translate-y-3/4',
      },
      align: {
        start: 'left-3',
        end: 'right-3',
      },
    },
    defaultVariants: {
      side: 'bottom',
      align: 'end',
    },
  }
);

function BubbleReactions({
  side = 'bottom',
  align = 'end',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  align?: 'start' | 'end';
  side?: 'top' | 'bottom';
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  );
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions };
