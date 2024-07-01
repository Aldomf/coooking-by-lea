"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  preparation: string;
  category: string;
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
        <div key={recipe._id} className="m-4 w-72">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="">
              <Image
                className="w-full h-96"
                src={recipe.imageUrl}
                alt={recipe.title}
                width={5000}
                height={5000}
              />
            </div>
            <div className="">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{recipe.title}</div>
                <p className="text-gray-700 text-base">
                  {recipe.preparation
                    ? recipe.preparation.slice(0, 25)
                    : "No description"}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {recipe.category}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recipe;
