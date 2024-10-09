"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useAppContext } from "@/context/AppContext";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  preparation: string;
  category: string;
  subcategory: string;
  isHealthy: false;
  createdAt: string;
}

const Recipe: React.FC = () => {
  const {
    selectedCategory,
    selectedSubcategory,
    recipes,
    currentPage,
    setCurrentPage,
    recipesPerPage,
    filterRecipes,
    searchQuery,
    setSelectedCategoryMarked,
    setSelectedSubcategoryMarked,
    selectCategory,
    selectSubcategory,
    setRecipes,
    selectedHealthy,
    selectHealthy,
  } = useAppContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recipes here if needed when context changes
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true); // Start loading
        const res = await fetch("/api/recipes");
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        } else {
          throw new Error("Failed to fetch recipes");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchRecipes();
  }, []);

  // Reset current page to 1 when category or subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedHealthy]);

  //!!
  useEffect(() => {
    const currentPageParam = new URLSearchParams(window.location.search).get("page");
    setCurrentPage(currentPageParam ? parseInt(currentPageParam) : 1);
  }, []);
  

  const filteredRecipes = filterRecipes(searchQuery).filter((recipe) => {
    if (selectedCategory) {
      return recipe.category === selectedCategory;
    } else if (selectedSubcategory) {
      return recipe.subcategory === selectedSubcategory;
    } else if (selectedHealthy === true) {
      return recipe.isHealthy === true;
    }
    return true; // Show all recipes if no category or subcategory selected
  });

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const resetFilters = () => {
    setSelectedCategoryMarked(null);
    setSelectedSubcategoryMarked(null);
    selectCategory(null);
    selectSubcategory(null);
    selectHealthy(null);
  };

  return (
    <div className="flex flex-col items-center dark:bg-gray-700 py-10">
      {selectedCategory || selectedSubcategory ? (
        <h2 className="text-3xl text-center lg:text-5xl mb-4 dark:text-white">
          {selectedCategory || selectedSubcategory}
        </h2>
      ) : selectedHealthy === true ? (
        <h2 className="text-3xl text-center lg:text-5xl mb-4 dark:text-white">Recettes saines</h2>
      ) : (
        <h2 className="text-3xl text-center lg:text-5xl mb-4 dark:text-white">Toutes les Recettes</h2>
      )}
      {(selectedCategory ||
        selectedSubcategory ||
        selectedHealthy === true) && (
        <div className="flex flex-col items-center mt-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md mb-4"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="text-2xl dark:text-white">Loading...</div>
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {currentRecipes.map((recipe) => (
            <Link
              key={recipe._id}
              href={`/recipes/${recipe._id}?page=${currentPage}`}
              className="m-4 w-72"
            >
              <div className="max-w-sm rounded-3xl overflow-hidden shadow-lg dark:shadow-gray-700">
                <div className="relative">
                  <Image
                    className="w-full h-96"
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    width={5000}
                    height={5000}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300" />
                </div>
                <div className="bg-white dark:bg-gray-800">
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl text-gray-900 dark:text-gray-200">
                      {recipe.title}
                    </div>
                  </div>
                  <div>
                    <span className="flex justify-end rounded-full px-3 py-1 text-sm font-semibold text-gray-400 dark:text-gray-500">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        indexOfFirstRecipe={indexOfFirstRecipe}
        indexOfLastRecipe={indexOfLastRecipe}
        totalRecipes={filteredRecipes.length}
      />
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  indexOfFirstRecipe,
  indexOfLastRecipe,
  totalRecipes,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  indexOfFirstRecipe: number;
  indexOfLastRecipe: number;
  totalRecipes: number;
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mr-2">
            Showing{" "}
            <span className="font-medium">{indexOfFirstRecipe + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastRecipe, totalRecipes)}
            </span>{" "}
            of <span className="font-medium">{totalRecipes}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === number
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                } focus:z-20 focus:outline-offset-0`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
