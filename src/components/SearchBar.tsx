import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import classNames from 'classnames';

function SearchBar() {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        className={classNames(
          "absolute right-full ml-2 p-2 border rounded transition-all duration-300 ease-in-out",
          { "opacity-0 w-0": !isInputVisible },
          { "opacity-100 w-48": isInputVisible }
        )}
        placeholder="Search..."
      />
      <IoSearch className="text-4xl cursor-pointer" onClick={toggleInputVisibility} />
    </div>
  );
}

export default SearchBar;
