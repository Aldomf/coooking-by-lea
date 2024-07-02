"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { BsPencilSquare } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";

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

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Split preparation steps by the numbering pattern and handle potential inconsistencies
  const preparationSteps = recipe?.preparation
    .split(/\d+\./) // Split by any digits followed by a period
    .filter((step) => step.trim() !== "") // Remove empty steps
    .map((step) => step.trim()); // Trim each step

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg mt-6 mb-10">
        {recipe ? (
          <>
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={5000}
              height={5000}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <h2 className="text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              {recipe.category}
            </p>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside pl-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2">Preparation</h3>
              <ol className="list-decimal list-inside pl-4">
                {preparationSteps?.map((step, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500">
                Created at: {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between w-28">
                <Link href={`/admin/update/${recipeId}`} className="text-3xl text-blue-600 hover:text-blue-800">
                  <BsPencilSquare />
                </Link>
                <Link href="">
                  <BsTrash3 className="text-3xl text-red-600 hover:text-red-800"/>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <p>No recipe found</p>
        )}
      </div>
    </div>
  );
};

export default OneRecipe;
