import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  preparation: string;
  category: string;
  subcategory: string;
  isHealthy: boolean;
  createdAt: string;
}

const Sidebar = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    selectCategory,
    selectSubcategory,
    setSelectedCategoryMarked,
    setSelectedSubcategoryMarked,
    selectedCategoryMarked,
    selectedSubcategoryMarked,
    selectedCategory,
    selectedSubcategory,
    setIsHealthy,
    isHealthy,
    selectHealthy,
    selectedHealthy,
  } = useAppContext();
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        if (res.ok) {
          const data: Recipe[] = await res.json();

          // Filter out null or undefined categories and subcategories
          const uniqueCategories = Array.from(
            new Set(
              data
                .map((recipe) => recipe.category)
                .filter((category) => category && category.trim().length > 0)
            )
          );
          const uniqueSubcategories = Array.from(
            new Set(
              data
                .map((recipe) => recipe.subcategory)
                .filter(
                  (subcategory) => subcategory && subcategory.trim().length > 0
                )
            )
          );

          setCategories(uniqueCategories);
          setSubcategories(uniqueSubcategories);
        } else {
          throw new Error("Failed to fetch recipes");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        toggleSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen, toggleSidebar]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategoryMarked(category);
    setSelectedSubcategoryMarked(null); // Reset subcategory when a new category is selected
    selectCategory(category);
    toggleSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/");
    router.refresh();
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedCategoryMarked(null);
    setSelectedSubcategoryMarked(subcategory);
    selectSubcategory(subcategory);
    toggleSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/");
    router.refresh();
  };

  const handleHealthyClick = () => {
    setSelectedCategoryMarked(null);
    setSelectedSubcategoryMarked(null);
    selectHealthy(true);
    toggleSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/");
    router.refresh();
  };

  const resetFilters = () => {
    setSelectedCategoryMarked(null);
    setSelectedSubcategoryMarked(null);
    selectCategory(null);
    selectSubcategory(null);
    selectHealthy(null);
    toggleSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="bg-gray-100">
      <div
        className={`fixed z-10 top-0 left-0 h-screen bg-white dark:bg-gray-800 w-full lg:w-1/3 overflow-y-auto transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ease-in-out duration-300`}
        id="sidebar"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b-2 p-4 dark:border-gray-700">
              <h2 className="text-2xl dark:text-gray-200">Filtrer par</h2>
              <button className="" onClick={toggleSidebar}>
                <svg
                  className="w-6 h-6 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center mt-6">
              <Link
                href="/admin/create"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md mb-2"
                onClick={() => toggleSidebar()}
              >
                Créer recette
              </Link>
              <h2 className="text-2xl underline dark:text-gray-200">
                Catégories
              </h2>
              <div className="mt-4">
                <ul className="dark:text-gray-200">
                  {categories.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`cursor-pointer hover:underline ${
                        selectedCategoryMarked === category
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      {category}
                    </li>
                  ))}
                  <li
                    onClick={() => handleHealthyClick()}
                    className={`cursor-pointer hover:underline ${
                      selectedHealthy === true ? "text-blue-500" : ""
                    }`}
                  >
                    Recettes saines
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center mt-6 mb-4">
              <h2 className="text-2xl underline dark:text-gray-200">
                Sous-catégories
              </h2>
              <div className="mt-4 text-gray-600 dark:text-gray-400">
                <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  {subcategories
                    .sort((a, b) => a.localeCompare(b)) // Sort subcategories alphabetically
                    .map((subcategory) => (
                      <li
                        key={subcategory}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className={`cursor-pointer hover:underline text-center ${
                          selectedSubcategoryMarked === subcategory
                            ? "text-blue-500"
                            : ""
                        }`}
                      >
                        {subcategory}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {(selectedCategory ||
              selectedSubcategory ||
              selectedHealthy === true) && (
              <div className="flex flex-col items-center mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md mb-4"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow dark:bg-gray-900">
          <div className="container">
            <div className="flex justify-between items-center py-4">
              <IoMenu
                size={30}
                className="cursor-pointer dark:text-white"
                id="open-sidebar"
                onClick={toggleSidebar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
