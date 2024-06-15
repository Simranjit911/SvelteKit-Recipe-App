import { recipesRef } from "$lib/firebase"
import { getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"
import { get } from "svelte/store"
import userStore, { loadUserFromSessionStorage, recipesStore } from "../../../store"
import { json } from "@sveltejs/kit"

export async function GET() {
    try {
        let user = loadUserFromSessionStorage()
        user=JSON.parse(user)
     
        if (user == null) {
            throw new Error("User not authenticated");
        }

        console.log(user?.uid);

        let q = query(recipesRef, where("uid", "==", user?.uid));
        let querySnapshot = await getDocs(q);

        let recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      
        console.log(recipes)
        return json(recipes)
        
    } catch (error) {
        console.log(error)
        return json(error)
    }
}

