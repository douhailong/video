import SizeConstraint from '@/components/size-constraint';

type PageProps = {};

const Page = ({}: PageProps) => {
  return (
    <SizeConstraint size='xl' direction='left'>
      <SizeConstraint.Title size='md' title='频道字幕' />
      translations
    </SizeConstraint>
  );
};

export default Page;
