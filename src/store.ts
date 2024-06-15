// src/stores/userStore.ts
import { get, writable } from 'svelte/store';
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from '$lib/firebase';

const userStore = writable<User | null>(null);
export const recipesStore = writable([])


export function loadUserFromSessionStorage() {
  console.log("call")
  if (typeof window !== "undefined") {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      userStore.set(JSON.parse(storedUser));
      console.log(storedUser)
      return storedUser
    }
    return null
  }
}

loadUserFromSessionStorage();

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
    userStore.set(user);
  } else {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
    }
    userStore.set(null);
  }
});
// onAuthStateChanged(auth, (user) => {
//     console.log("auth call")
//     if (user) {
//       userStore.set(user);
//     } else {
//       userStore.set(null);
//     }
//   });
let user = get(userStore)
console.log(user)
export default userStore;
