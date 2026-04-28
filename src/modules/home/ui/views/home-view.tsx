import Boundary from '@/components/boundary';
import SizeConstraint from '@/components/size-constraint';
import ToTop from '@/components/to-top';

import { HomeBody, Loading } from '../components/home-body';

export default function HomeView() {
  return (
    <SizeConstraint direction='center'>
      <Boundary fallback={<Loading />}>
        <HomeBody />
      </Boundary>
      <ToTop />
    </SizeConstraint>
  );
}
