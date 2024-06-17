import { json } from '@sveltejs/kit';
import { recipesRef, storage } from '$lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { FirebaseError } from 'firebase/app';

export async function GET(requestEvent) {
    let { params, locals, request } = requestEvent
    const { singleRecipe: recipeId } = params;
    let userId = request.headers.get('userid')
    console.log(userId)
    try {

        const recipeDocRef = doc(recipesRef, recipeId);
        const recipeDocSnapshot = await getDoc(recipeDocRef);

        if (!recipeDocSnapshot.exists()) {
            return json('Recipe not found', { status: 404 });
        }

        const recipeData = recipeDocSnapshot.data();


        if (recipeData.uid !== userId) {
            return json({ 'msg': 'Unauthorized request' }, { status: 403 });
        }

        return json({ recipe: recipeData });
    } catch (err) {
        const e = err as FirebaseError;
        console.error('Error fetching recipe:', e);
        return json('Internal Server Error');
    }
}

export async function DELETE(requestEvent) {
    let { request, params } = requestEvent
    const { singleRecipe } = params;
    let userId = request.headers.get('userid')

    try {
        const recipeDocRef = doc(recipesRef, singleRecipe);
        const recipeDocSnapshot = await getDoc(recipeDocRef);

        if (!recipeDocSnapshot.exists()) {
            return json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Get the data of the recipe document
        const recipeData = recipeDocSnapshot.data();
        const imageUrl = recipeData.imageUrl;


        if (recipeData.uid !== userId) {
            return json({ 'msg': 'Unauthorized request' }, { status: 403 });
        }
        // Delete the recipe document 
        await deleteDoc(recipeDocRef);

        // Delete the image from  Storage
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        }

        return json({ msg: 'Recipe  deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return json({ error: 'Error deleting recipe' }, { status: 500 });
    }
}

export async function PATCH(requestEvent) {
    let { request, params } = requestEvent
    let { recipeData } = await request.json()
    const { singleRecipe } = params;
    console.log(recipeData)

    let userId = request.headers.get('userid')

    try {
        //     // Get the existing recipe document from Firestore
        const recipeDocRef = doc(recipesRef, singleRecipe);
        const recipeDocSnapshot = await getDoc(recipeDocRef);

        if (!recipeDocSnapshot.exists()) {
            return json({ error: 'Recipe not found' }, { status: 404 });
        }

        let recipeDataDoc = recipeDocSnapshot.data()
        if (recipeDataDoc.uid !== userId) {
            return json({ error: 'Unauthorized request' }, { status: 403 });
        }



        await updateDoc(recipeDocRef, recipeData);



        return json({ msg: 'Recipe updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating recipe:', error);
        return json({ error: 'Error updating recipe' }, { status: 500 });
    }
}

