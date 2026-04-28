import Boundary from '@/components/boundary';
import SizeConstraint from '@/components/size-constraint';

import { ResultsBody, Loading } from '../components/results-body';

type SearchViewProps = { query: string; categoryId?: string };

export default function SearchView({ categoryId, query }: SearchViewProps) {
  return (
    <SizeConstraint direction='center'>
      <Boundary fallback={<Loading />}>
        <ResultsBody query={query} categoryId={categoryId} />
      </Boundary>
    </SizeConstraint>
  );
}
