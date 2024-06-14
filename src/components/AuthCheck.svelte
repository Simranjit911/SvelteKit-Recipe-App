
<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { onAuthStateChanged } from "firebase/auth";
    import { goto } from "$app/navigation"; // Import the goto function from SvelteKit
    import userStore from "../store";
    import type { User } from "firebase/auth";
    import { auth } from "$lib/firebase";
  
    let user: User | null = null;
  
    // Subscribe to the user store
    userStore.subscribe((u) => {
      user = u;
    });
  
    onMount(() => {
    if (browser) {
      const unsubscribe = onAuthStateChanged(auth, (curUser) => {
        if (curUser) {
          userStore.set(curUser);
          goto('/dashboard', { replaceState: true });
        } else {
          userStore.set(null);
          if (window.location.pathname !== '/') {
            goto('/', { replaceState: true });
          }
        }
      });

      // Clean up the subscription when the component unmounts
      return unsubscribe;
    }
  });
  </script>
  
  <slot />
  