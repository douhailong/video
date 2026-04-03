import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('sm:p-6 p-0', {
  variants: {
    size: {
      md: 'max-w-screen-lg',
      sm: 'max-w-screen-md',
      lg: 'max-w-screen-xl',
      xl: 'max-w-screen-2xl'
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

type SizeConstraintProps = { className?: string; children: ReactNode } & VariantProps<
  typeof variants
>;

const SizeConstraint = ({
  size,
  direction,
  className,
  children
}: SizeConstraintProps) => {
  return <div className={cn(variants({ direction, size, className }))}>{children}</div>;
};

type TitleProps = {
  size?: keyof typeof titleSize;
  title: ReactNode;
};

const titleSize = { lg: 'text-3xl', md: 'text-2xl' };

SizeConstraint.Title = ({ title, size = 'lg' }: TitleProps) => (
  <h1 className={cn('px-4 pb-3 font-bold sm:px-0', titleSize[size])}>{title}</h1>
);

export default SizeConstraint;
