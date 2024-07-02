"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateRecipeForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [preparation, setPreparation] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isHealthy, setIsHealthy] = useState(false); // Add state for isHealthy
  const [errorMessage, setErrorMessage] = useState("");

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (image) formData.append("image", image);
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient);
      });
      formData.append("preparation", preparation);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("isHealthy", isHealthy.toString()); // Include isHealthy

      // Log the formData entries to see what is being appended
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create recipe");
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on error
        return;
      }

      router.push("/");
      router.refresh();

      console.log("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      setErrorMessage("An unexpected error occurred");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg mb-10">
      <h2 className="text-2xl font-bold mb-4">Create Recipe</h2>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title:
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Image:
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ingredients"
          >
            Ingredients:
          </label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg w-full mr-2"
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Ingredient
          </button>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="preparation"
          >
            Preparation:
          </label>
          <textarea
            id="preparation"
            name="preparation"
            value={preparation}
            onChange={(e) => setPreparation(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            rows={15}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category:
          </label>
          <input
            id="category"
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subcategory"
          >
            Subcategory:
          </label>
          <input
            id="subcategory"
            type="text"
            name="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Is Healthy:
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isHealthy"
              checked={isHealthy}
              onChange={(e) => setIsHealthy(e.target.checked)}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Check if the recipe is healthy</span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateRecipeForm;
