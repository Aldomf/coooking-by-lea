"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const UpdateRecipeForm = () => {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [preparation, setPreparation] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isHealthy, setIsHealthy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data);
          setTitle(data.title);
          setIngredients(data.ingredients);
          setPreparation(data.preparation);
          setCategory(data.category);
          setSubcategory(data.subcategory);
          setIsHealthy(data.isHealthy);
        } else {
          throw new Error("Failed to fetch recipe");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

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
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id", recipeId);
      if (title) formData.append("title", title);
      if (image) formData.append("image", image);
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient);
      });
      if (preparation) formData.append("preparation", preparation);
      if (category) formData.append("category", category);
      if (subcategory) formData.append("subcategory", subcategory);
      formData.append("isHealthy", isHealthy.toString());

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Failed to create recipe");
        } else {
          setErrorMessage("An unexpected error occurred");
        }
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on error
        setIsSubmitting(false);
        return;
      }

      router.push("/");
      router.refresh();

      console.log("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
      setErrorMessage("An unexpected error occurred");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg mb-10">
      <h2 className="text-2xl font-bold mb-4">Update Recipe</h2>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipeForm;
