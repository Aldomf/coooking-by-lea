import React, { useEffect, useRef, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import classNames from 'classnames';
import { useAppContext } from '@/context/AppContext';

const SearchBar = ({ onSearchChange }: { onSearchChange: (query: string) => void }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const { searchQuery, setSearchQuery, selectedCategory, selectedSubcategory } = useAppContext();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  useEffect(() => {
    // Reset search input when category or subcategory changes
    setSearchQuery('');
  }, [selectedCategory, selectedSubcategory]);

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type="text"
        className={classNames(
          "absolute right-full ml-2 p-2 border rounded transition-all duration-300 ease-in-out",
          { "opacity-0 w-0": !isInputVisible },
          { "opacity-100 w-48": isInputVisible }
        )}
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Chercher..."
      />
      <button
        className="p-2 text-gray-600"
        onClick={toggleInputVisibility}
      >
        <IoSearch size={24} className='dark:text-white'/>
      </button>
    </div>
  );
};

export default SearchBar;
