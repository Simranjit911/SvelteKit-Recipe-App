<script context="module">
  // This script block runs only once when the module is first loaded
  import "bootstrap/dist/css/bootstrap.min.css";
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import userStore from "../store";
  import { onAuthStateChanged } from "firebase/auth";

  let user = null;

  // onMount(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       userStore.set(user);
  //     } else {
  //       userStore.set(null);
  //     }
  //   });

  //   userStore.subscribe((u) => {
  //     user = u;
  //   });
  // });
</script>

<Navbar />
<div class="container w-full">
  <slot />
</div>
