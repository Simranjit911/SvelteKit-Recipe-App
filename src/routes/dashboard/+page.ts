import { get } from "svelte/store";
import userStore, { loadUserFromSessionStorage, recipesStore } from "../../store";
import type { PageLoad } from "./$types";
import { getDocs, query, where } from "firebase/firestore";
import { recipesRef } from "$lib/firebase";

export const load: PageLoad = async () => {
    async function fetch() {
        try {
            // let res = await fetch("apis/recipes")
            // if (res.ok) {

            //     console.log(res.recipes)
            // }
            // let res2 = await res.json()
            // console.log(res2.recipes)

            let user = loadUserFromSessionStorage()
            user = JSON.parse(user)

            if (user == null) {
                throw new Error("User not authenticated");
            }

            console.log(user?.uid);

            let q = query(recipesRef, where("uid", "==", user?.uid));
            let querySnapshot = await getDocs(q);

            let recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            recipesStore.set(recipes)
            let recipe2 = get(recipesStore)
            console.log(recipes)

            return { recipes };
        } catch (error) {
            console.error("Error loading recipes:", error);
            return { error };
        }
    }
    return {
        data:fetch()
    }
};