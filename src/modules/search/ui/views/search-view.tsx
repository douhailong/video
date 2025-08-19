import CategoriesSection from '@/modules/categories/ui/components/categories-section';
import ResultsSection from '../components/results-section';

type SearchViewProps = { query: string; categoryId?: string };

const SearchView = ({ categoryId, query }: SearchViewProps) => {
  return (
    <div className='mx-auto mb-10 flex max-w-[1300px] flex-col gap-y-6 px-4 pt-2.5'>
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection categoryId={categoryId} query={query} />
    </div>
  );
};

export default SearchView;
