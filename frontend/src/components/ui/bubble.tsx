import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

function BubbleGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-group"
      className={cn('flex min-w-0 flex-col gap-2', className)}
      {...props}
    />
  );
}

const bubbleVariants = cva(
  'w-fit max-w-[85%] rounded-2xl px-3.5 py-2 text-xs break-words shadow-sm transition-all',
  {
    variants: {
      variant: {
        // Mensajes propios: Fondo naranja vivo con texto blanco puro
        primary: 'bg-orange-600 text-white font-medium shadow-orange-950/20',
        // Mensajes recibidos: Acero oscuro con texto blanco/marfil
        secondary: 'bg-zinc-800 border border-zinc-750 text-zinc-100',
        // Mensajes del sistema: Fondo zinc muy oscuro con borde sutil y texto ámbar
        system:
          'bg-zinc-950/70 border border-orange-500/20 text-orange-300 italic',
      },
      align: {
        start: 'self-start rounded-bl-sm',
        end: 'self-end rounded-br-sm',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      align: 'start',
    },
  }
);

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
      className={cn('leading-relaxed', className)}
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
