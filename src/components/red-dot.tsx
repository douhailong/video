import { cn } from '@/lib/utils';

type RedDotProps = {
  className?: string;
  children: React.ReactNode;
};

const RedDot = ({ className, children }: RedDotProps) => {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <span className='text-red-600'>*</span>
      {children}
    </div>
  );
};

export default RedDot;
