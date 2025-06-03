import { SearchIcon } from 'lucide-react';

const SearchInput = () => {
  return (
    <form className='w-full flex'>
      <div className='relative w-full'>
        <input
          type='text'
          placeholder='Search'
          className='w-full rounded-l-full border pl-4 py-2 pr-12 focus:border-blue-500 focus:outline-none'
        />
      </div>
      <button
        type='submit'
        className='px-5 border border-l-0 rounded-r-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700'
      >
        <SearchIcon className='size-5' />
      </button>
    </form>
  );
};

export default SearchInput;
