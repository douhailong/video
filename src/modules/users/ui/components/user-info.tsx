import { type VariantProps, cva } from 'class-variance-authority';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const infoVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      default: '[&_p]:text-sm [&_svg]:size-4',
      lg: '[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black',
      sm: '[&_p]:text-xs [&_svg]:size-3.5'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

type UserInfoProps = { name: string; className?: string } & VariantProps<
  typeof infoVariants
>;

const UserInfo = ({ size, name, className }: UserInfoProps) => {
  return (
    <div className={cn(infoVariants({ size, className }))}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className='text-gray-500 hover:text-gray-800 line-clamp-1'>
            {name}
          </p>
        </TooltipTrigger>
        <TooltipContent align='center' className='bg-black/70'>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default UserInfo;
