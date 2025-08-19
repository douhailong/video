import Link from 'next/link';
import { Upload } from 'lucide-react';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

const PublishButton = async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <Button variant='secondary' asChild>
      <Link href='/studio'>
        <Upload />
        创作中心
      </Link>
    </Button>
  );
};

export default PublishButton;
