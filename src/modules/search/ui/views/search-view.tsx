import CategoriesSection from '@/modules/home/ui/components/categories-section';
import ResultsSection from '../components/results-section';

type SearchViewProps = { query: string; categoryId?: string };

const SearchView = ({ categoryId, query }: SearchViewProps) => {
  return (
    <div className='max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5'>
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection categoryId={categoryId} query={query} />
    </div>
  );
};

export default SearchView;
