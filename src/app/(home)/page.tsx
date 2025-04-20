import { trpc } from '@/trpc/server';

type PageProps = {};

const Page: React.FC<PageProps> = async ({}) => {
  const data = await trpc.hello({ text: 'jjjjj' });

  return <div>111Page111{data?.greeting}</div>;
};

export default Page;
