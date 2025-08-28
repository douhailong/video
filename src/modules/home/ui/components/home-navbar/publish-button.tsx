import Link from 'next/link';
import { Upload } from 'lucide-react';

import { auth } from '@/auth';
import { buttonVariants } from '@/components/ui/button';

const PublishButton = async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <Link href='/studio' className={buttonVariants({ variant: 'secondary' })}>
      <Upload />
      创作中心
    </Link>
  );
};

export default PublishButton;
