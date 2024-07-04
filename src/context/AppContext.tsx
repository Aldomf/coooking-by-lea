"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  preparation: string;
  category: string;
  subcategory: string;
  createdAt: string;
}

interface AppContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedCategory: string | null;
  selectCategory: (category: string | null) => void;
  selectedSubcategory: string | null;
  selectSubcategory: (subcategory: string | null) => void;
  recipes: Recipe[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  recipesPerPage: number;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 32;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        } else {
          throw new Error("Failed to fetch recipes");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const selectSubcategory = (subcategory: string | null) => {
    setSelectedSubcategory(subcategory);
    setSelectedCategory(null);
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        selectedCategory,
        selectCategory,
        selectedSubcategory,
        selectSubcategory,
        recipes,
        currentPage,
        setCurrentPage,
        recipesPerPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
