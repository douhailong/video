import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('sm:p-6 p-0', {
  variants: {
    size: {
      md: 'max-w-screen-lg',
      sm: 'max-w-screen-md',
      lg: 'max-w-screen-xl'
    },
    direction: {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto'
    }
  },
  defaultVariants: {
    size: 'lg',
    direction: 'left'
  }
});

type ScreenContentProps = { className?: string; children: ReactNode } & VariantProps<
  typeof variants
>;

const ScreenContent = ({ size, direction, className, children }: ScreenContentProps) => {
  return <div className={cn(variants({ direction, size, className }))}>{children}</div>;
};

export default ScreenContent;
