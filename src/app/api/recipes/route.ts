import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Recipe from "@/models/Recipes";
import cloudinary from "@/utils/cloudinary";

interface CloudinaryUploadResponse {
  secure_url: string;
}

export async function POST(req: any) {
  await connectDB();

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as any;
    const ingredients: string[] = [];
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (typeof value === "string" && key.startsWith("ingredients[")) {
        ingredients.push(value);
      }
    });

    const preparation = formData.get("preparation") as string;
    const category = formData.get("category") as string;
    const subcategory = formData.get("subcategory") as string;
    const isHealthy = formData.get("isHealthy") === "true";

    console.log("Ingredients:", ingredients);
    console.log("isHealthy:", isHealthy);

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload image to Cloudinary
    const response: CloudinaryUploadResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "recipes" }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result as CloudinaryUploadResponse);
            }
          })
          .end(buffer);
      }
    );

    const newRecipe = new Recipe({
      title,
      imageUrl: response.secure_url,
      ingredients,
      preparation,
      category,
      subcategory,
      isHealthy,
    });

    const savedRecipe = await newRecipe.save();
    return NextResponse.json(savedRecipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const recipes = await Recipe.find({});
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
