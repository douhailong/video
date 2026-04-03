import Boundary from '@/components/boundary';
import SizeConstraint from '@/components/size-constraint';

import { YouHead } from '../components/you-view/you-head';
import { YouBody } from '../components/you-view/you-body';

type YouViewProps = {};

const YouView = ({}: YouViewProps) => {
  return (
    <SizeConstraint>
      <Boundary fallback={<YouHead.Loading />}>
        <YouHead />
      </Boundary>
      <Boundary fallback={<YouBody.Loading />}>
        <YouBody />
      </Boundary>
    </SizeConstraint>
  );
};

export default YouView;
