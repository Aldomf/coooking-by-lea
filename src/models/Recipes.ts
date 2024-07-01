import { Schema, model, models, Document } from "mongoose";

// Define a TypeScript interface for the Recipe document
interface IRecipe extends Document {
  title: string;
  imageUrl: string;
  ingredients: string[];
  preparation: string;
  category: string;
  subcategory?: string;
  isHealthy: boolean;
}

// Define the schema
const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, "The title is required"],
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "The image is required"],
    },
    ingredients: {
      type: [String],
      required: [true, "The ingredients is required"],
      trim: true,
    },
    preparation: {
      type: String,
      required: [true, "The preparation is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "The category is required"],
    },
    subcategory: {
      type: String,
      required: false,
    },
    isHealthy: {
      type: Boolean,
      required: true,
      default: false,  // Set a default value for the field
    },

  },
  { timestamps: true }
);

// Create and export the model
const Recipe = models.Recipe || model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
