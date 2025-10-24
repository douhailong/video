import WorkForm from '../components/work-view/work-form';

type WorkViewProps = { workId: string };

const WorkView = ({ workId }: WorkViewProps) => {
  return (
    <div className='max-w-screen-lg px-4 pb-8 pt-2.5'>
      <WorkForm workId={workId} />
    </div>
  );
};

export default WorkView;
