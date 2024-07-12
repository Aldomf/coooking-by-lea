"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { BsPencilSquare } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { useAppContext } from "@/context/AppContext";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  preparation: string;
  ingredients: string[];
  createdAt: string;
}

const OneRecipe: React.FC = () => {
  const params = useParams<{ id: string }>();
  const recipeId = params.id;

  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setSearchQuery } = useAppContext();

  useEffect(() => {
    setSearchQuery("");
  }, []);

  const deleteRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Recipe deleted successfully");
        // Optionally refresh the recipes list or navigate away
        router.push("/");
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete recipe:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch the recipe");
        }
        const data = await res.json();
        setRecipe(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading)
    return <p className="text-gray-800 dark:text-gray-100">Loading...</p>;
  if (error)
    return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;

  // Split preparation steps by the numbering pattern and handle potential inconsistencies
  const preparationSteps = recipe?.preparation
    .split(/\d+\./) // Split by any digits followed by a period
    .filter((step) => step.trim() !== "") // Remove empty steps
    .map((step) => step.trim()); // Trim each step

  return (
    <div className="dark:bg-gray-600 py-10">
      <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        {recipe ? (
          <>
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={5000}
              height={5000}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <h2 className="text-4xl font-bold mb-2 dark:text-gray-200">
              {recipe.title}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {recipe.category}
            </p>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2 dark:text-gray-200">
                Ingredients
              </h3>
              <ul className="list-disc list-inside pl-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2 dark:text-gray-200">
                Preparation
              </h3>
              <ol className="list-decimal list-inside pl-4">
                {preparationSteps?.map((step, index) => (
                  <li
                    key={index}
                    className="text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400">
                Created at: {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between w-28">
                <Link
                  href={`/admin/update/${recipeId}`}
                  className="text-3xl text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                >
                  <BsPencilSquare />
                </Link>
                <button onClick={() => deleteRecipe(recipeId)}>
                  <BsTrash3 className="text-3xl text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="dark:text-gray-200">No recipe found</p>
        )}
      </div>
    </div>
  );
};

export default OneRecipe;
