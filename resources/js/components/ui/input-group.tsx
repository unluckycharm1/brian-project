import * as React from 'react';
import { cn } from '@/lib/utils';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-group"
            className={cn(
                'flex h-9 w-full items-center overflow-hidden rounded-lg border border-input bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                className,
            )}
            {...props}
        />
    );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            data-slot="input-group-input"
            className={cn(
                'min-w-0 flex-1 bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

function InputGroupAddon({
    className,
    align = 'inline-start',
    ...props
}: React.ComponentProps<'div'> & {
    align?: 'inline-start' | 'inline-end';
}) {
    return (
        <div
            data-slot="input-group-addon"
            data-align={align}
            className={cn(
                'flex items-center px-3 text-sm text-muted-foreground',
                align === 'inline-end' && 'border-l border-input',
                className,
            )}
            {...props}
        />
    );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
