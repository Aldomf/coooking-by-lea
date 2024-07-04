"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Sidebar from "./SideBar";
import { useAppContext } from "@/context/AppContext";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  preparation: string;
  category: string;
  subcategory: string;
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
  } = useAppContext();

  useEffect(() => {
    // Fetch recipes here if needed when context changes
  }, [selectedCategory, selectedSubcategory]);

  const filteredRecipes = recipes.filter((recipe) => {
    if (selectedCategory) {
      return recipe.category === selectedCategory;
    } else if (selectedSubcategory) {
      return recipe.subcategory === selectedSubcategory;
    }
    return true; // Show all recipes if no category or subcategory selected
  });

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center">
        {currentRecipes.map((recipe) => (
          <Link
            key={recipe._id}
            href={`/recipes/${recipe._id}`}
            className="m-4 w-72"
          >
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
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
              <div className="">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl">{recipe.title}</div>
                </div>
                <div className="px-6 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {recipe.category}
                  </span>
                  {recipe.subcategory && (
                    <span className="inline-block bg-gray-200 rounded-full mt-2 px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                      {recipe.subcategory}
                    </span>
                  )}
                </div>
                <div>
                  <span className="flex justify-end rounded-full px-3 py-1 text-sm font-semibold text-gray-400">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 mr-2">
            Showing <span className="font-medium">{indexOfFirstRecipe + 1}</span>{" "}
            to <span className="font-medium">{Math.min(indexOfLastRecipe, totalRecipes)}</span>{" "}
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
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                } focus:z-20 focus:outline-offset-0`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
