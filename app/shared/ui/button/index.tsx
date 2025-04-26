import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

const buttonVariants = cva('rounded-md py-1 px-2 cursor-pointer text-center font-medium', {
  variants: {
    intent: {
      default: 'bg-white text-black',
      cancel: 'bg-gray-1 text-gray-7 ',
      primary: 'bg-main text-white',
      ghost: 'bg-gray-2 text-white',
      income: 'bg-income text-white',
      expense: 'bg-expense text-white',
    },
    size: {
      sm: 'text-[10px]',
      default: 'text-base py-[11px]',
      lg: 'text-base py-4',
    },
    disabled: {
      false: '',
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    intent: 'default',
    size: 'default',
    disabled: false,
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, disabled, isLoading, loadingText, children, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size, disabled: isDisabled }), className)}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>{loadingText}</p>
          </div>
        )}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
