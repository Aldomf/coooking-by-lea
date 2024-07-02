import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Recipe from "@/models/Recipes";
import cloudinary from "@/utils/cloudinary";

interface CloudinaryUploadResponse {
  secure_url: string;
}

export async function GET(req: any, { params }: any) {
  await connectDB();

  try {
    const { id } = params;
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: any, { params }: any) {
  await connectDB();

  try {
    const id = params.id;
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const imageFile = formData.get("image") as any | null;
    const ingredients: string[] = [];
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (typeof value === "string" && key.startsWith("ingredients[")) {
        ingredients.push(value);
      }
    });

    const preparation = formData.get("preparation") as string | null;
    const category = formData.get("category") as string | null;
    const subcategory = formData.get("subcategory") as string | null;
    const isHealthy = formData.get("isHealthy") === "true";

    let updatedFields: any = {};

    if (title) updatedFields.title = title;
    if (ingredients.length > 0) updatedFields.ingredients = ingredients;
    if (preparation) updatedFields.preparation = preparation;
    if (category) updatedFields.category = category;
    if (subcategory) updatedFields.subcategory = subcategory;
    if (formData.has("isHealthy")) updatedFields.isHealthy = isHealthy;

    if (imageFile) {
      // Retrieve the current recipe to get the current image URL
      const currentRecipe = await Recipe.findById(id);
      if (!currentRecipe) {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }

      // Extract the public ID from the current image URL
      const currentImageUrl = currentRecipe.imageUrl;
      const publicIdMatch = currentImageUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = publicIdMatch ? publicIdMatch[1] : null;

      console.log(publicId)

      if (publicId) {
        // Delete the current image from Cloudinary
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload new image to Cloudinary
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

      updatedFields.imageUrl = response.secure_url;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedRecipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error("Error updating recipe:", error);
    if (error instanceof Error && "code" in error && error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { message: "A recipe with this title already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}