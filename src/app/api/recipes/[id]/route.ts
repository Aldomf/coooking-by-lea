import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Recipe from "@/models/Recipes";

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