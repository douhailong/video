import WorksTable from '../components/works-view/works-table';

const WorksView = () => {
  return (
    <div className='flex flex-col gap-y-4 pt-2.5'>
      <h1 className='px-4 text-xl font-bold'>作品管理</h1>
      <WorksTable />
    </div>
  );
};

export default WorksView;
