"use client";
import Link from "next/link";
import React from "react";
import Sidebar from "./SideBar";
import SearchBar from "./SearchBar";
import { useAppContext } from "@/context/AppContext";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  const { setSearchQuery } = useAppContext();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 py-1 shadow-md">
  <nav className="border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-2.5">
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
      <div className="flex items-center">
        <Sidebar />
      </div>
      <div className="flex items-center lg:order-2">
        <SearchBar onSearchChange={handleSearchChange} />
        <ThemeToggle />
      </div>
      <div
        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
        id="mobile-menu-2"
      >
        <Link
          href="/"
          className="text-[46px] border-[#482519] dark:border-gray-200 text-[#482519] dark:text-gray-200 border-t-2 pt-2"
        >
          Cooking by Lea
        </Link>
      </div>
    </div>
  </nav>
</header>

  );
};

export default Header;
