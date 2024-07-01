"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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
        // Handle error state or show a message to the user
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {recipes.map((recipe) => (
        <Link
          key={recipe._id}
          href={`/recipes/${recipe._id}`}
          className="m-4 w-72 "
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
  );
};

export default Recipe;
