import Boundary from '@/components/boundary';
import SizeConstraint from '@/components/size-constraint';
// import CategoriesSection from '@/modules/categories/ui/components/categories';

import { ResultsBody, Loading } from '../components/results-body';

type SearchViewProps = { query: string; categoryId?: string };

const SearchView = ({ categoryId, query }: SearchViewProps) => {
  return (
    <SizeConstraint direction='center'>
      {/* <CategoriesSection categoryId={categoryId} /> */}
      <Boundary fallback={<Loading />}>
        <ResultsBody query={query} categoryId={categoryId} />
      </Boundary>
    </SizeConstraint>
  );
};

export default SearchView;
