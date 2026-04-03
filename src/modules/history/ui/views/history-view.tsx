import SizeConstraint from '@/components/size-constraint';
import Boundary from '@/components/boundary';

import { HistoryBody, Loading } from '../components/history-body';
import ActionBar from '../components/action-bar';

const HistoryView = () => {
  return (
    <SizeConstraint>
      <SizeConstraint.Title title='观看历史' />
      <div className='flex flex-col-reverse gap-4 lg:flex-row'>
        <Boundary fallback={<Loading />}>
          <HistoryBody />
        </Boundary>
        <ActionBar />
      </div>
    </SizeConstraint>
  );
};

export default HistoryView;
