import type { PageLoad } from "./$types";
import { doc, getDoc } from "firebase/firestore";
import { recipesRef } from "$lib/firebase";

export const load: PageLoad = async ({ params }) => {
  const { recipeId } = params;
  try {
    const recipeDoc = await getDoc(doc(recipesRef, recipeId));
    if (recipeDoc.exists()) {
      return { recipe: recipeDoc.data() };
    } else {
      return { recipe: null };
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return { recipe: null };
  }
};
