import { get } from "svelte/store";
import userStore, { loadUserFromSessionStorage, recipesStore } from "../../store";
import type { PageLoad } from "./$types";
import { getDocs, query, where } from "firebase/firestore";
import { recipesRef } from "$lib/firebase";

// export const load: PageLoad = async () => {
//     async function fetch() {
//         try {
          

//             let user = loadUserFromSessionStorage()
//             user = JSON.parse(user)

//             if (user == null) {
//                 throw new Error("User not authenticated");
//             }

//             console.log(user?.uid);

//             let q = query(recipesRef, where("uid", "==", user?.uid));
//             let querySnapshot = await getDocs(q);

//             let recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             recipesStore.set(recipes)
//             let recipe2 = get(recipesStore)
//             console.log(recipes)

//             return { recipes };
//         } catch (error) {
//             console.error("Error loading recipes:", error);
//             return { error };
//         }
//     }
//     return {
//         data:fetch()
//     }
// };
export const load: PageLoad = async () => {
    try {
        let user = loadUserFromSessionStorage();
        user = user ? JSON.parse(user) : null;

        if (!user) {
            throw new Error("User not authenticated");
        }

   

        let q = query(recipesRef, where("uid", "==", user?.uid));
        let querySnapshot = await getDocs(q);

        let recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        recipesStore.set(recipes);

        return { recipes };
    } catch (error) {
        console.error("Error loading recipes:", error);
        return { error: error.message };
    }
};