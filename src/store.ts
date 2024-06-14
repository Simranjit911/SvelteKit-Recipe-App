// src/stores/userStore.ts
import { writable } from 'svelte/store';
import type { User } from "firebase/auth";

const userStore = writable<User | null>(null);

export default userStore;
