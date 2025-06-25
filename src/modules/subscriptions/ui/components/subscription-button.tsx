import { cn } from '@/lib/utils';
import { type ButtonProps, Button } from '@/components/ui/button';

type SubscriptionButtonProps = {
  isSubscribed: boolean;
} & ButtonProps;

const SubscriptionButton = ({
  isSubscribed,
  onClick,
  disabled,
  className,
  size
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? 'secondary' : 'default'}
      className={cn('rounded-full', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? 'Unsubscribed' : 'Subscribed'}
    </Button>
  );
};

export default SubscriptionButton;
