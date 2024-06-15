import { json } from '@sveltejs/kit';
import { recipesRef, storage } from '$lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';


export async function DELETE({ params }) {
    const { singleRecipe } = params;

    try {
        const recipeDocRef = doc(recipesRef, singleRecipe);
        const recipeDocSnapshot = await getDoc(recipeDocRef);

        if (!recipeDocSnapshot.exists()) {
            return json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Get the data of the recipe document
        const recipeData = recipeDocSnapshot.data();
        const imageUrl = recipeData.imageUrl;

        // Delete the recipe document 
        await deleteDoc(recipeDocRef);

        // Delete the image from  Storage
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        }

        return json({ msg: 'Recipe and image deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return json({ error: 'Error deleting recipe' }, { status: 500 });
    }
}

export async function PATCH(req) {
    console.log(req,req.params)
    // const { singleRecipe } = params;
    // console.log(body,singleRecipe)
    // const { recipeData, newImageFile } = body;

    try {
        // Get the existing recipe document from Firestore
        // const recipeDocRef = doc(recipesRef, singleRecipe);
        // const recipeDocSnapshot = await getDoc(recipeDocRef);

        if (!recipeDocSnapshot.exists()) {
            return json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Get the data of the existing recipe
        const existingRecipeData = recipeDocSnapshot.data();

        // Update the recipe data in Firestore
        // await updateDoc(recipeDocRef, recipeData);

        // Check if a new image file is provided for update
        //   if (newImageFile) {
        //     // Delete the existing image from Firebase Storage
        //     const existingImageUrl = existingRecipeData.imageUrl;
        //     if (existingImageUrl) {
        //       const existingImageRef = ref(storage, existingImageUrl);
        //       await deleteObject(existingImageRef);
        //     }

        //     // Upload the new image file to Firebase Storage

        //     const imageName = `${Date.now()}_${newImageFile.name}`;
        //     const newImageRef = ref(storage, `images/${imageName}`);
        //     await uploadBytes(newImageRef, newImageFile);

        //     // Get the download URL of the newly uploaded image

        //     const newImageUrl = await newImageRef.getDownloadURL();

        //     // Update the imageUrl field in the recipe document

        //     await updateDoc(recipeDocRef, { imageUrl: newImageUrl });
        //   }

        return json({ msg: 'Recipe updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating recipe:', error);
        return json({ error: 'Error updating recipe' }, { status: 500 });
    }
}