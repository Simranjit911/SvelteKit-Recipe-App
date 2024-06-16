<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { auth, recipesRef } from "$lib/firebase";
  import { redirect } from "@sveltejs/kit";
  import userStore, { loadUserFromSessionStorage } from "../store";
  import { onAuthStateChanged, signOut } from "firebase/auth";
  import type { User } from "firebase/auth";
  import AddnewRecipe from "./AddnewRecipe.svelte";
  import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
  import { recipesStore } from "../store";
  let user: User | null;
  userStore.subscribe((v) => {
    user = v;
  });
  let showModal = false;
  function handleModalClose() {
    showModal = false;
  }
  let searchVal = "";
  async function handleSearch() {
    if (!user) {
      alert("You need to be logged in to search for recipes.");
      return;
    }

    // Firestore query
    const recipesCollection = collection(recipesRef, "recipes");
    const nameQuery = query(
      recipesCollection,
      where("uid", "==", user.uid),
      where("name", ">=", searchVal),
      where("name", "<=", searchVal + "\uf8ff")
    );
    const ingredientsQuery = query(
      // recipesCollection,
      where("uid", "==", user.uid),
      where("ingredients", "array-contains", searchVal)
    );

    try {
      // Execute the queries
      const nameSnapshot = await getDocs(nameQuery);
      const ingredientsSnapshot = await getDocs(ingredientsQuery);

      // Combine results
      let searchResults = [
        ...nameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...ingredientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ];

      // Remove duplicates
      searchResults = Array.from(new Set(searchResults.map(recipe => recipe.id)))
        .map(id => searchResults.find(recipe => recipe.id === id));

      // Update the store
      recipesStore.set(searchResults);
    } catch (error) {
      console.error("Error searching for recipes:", error);
    }
  }
  onSnapshot(
    recipesRef,
    (snapshot) => {
      const recipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      recipesStore.set(recipes);
      console.log(recipes);
    },
    (error) => {
      console.error("Error fetching recipes:", error);
    }
  );
  onAuthStateChanged(auth, (c) => {
    if (browser) {
      onAuthStateChanged(auth, (curUser) => {
        if (curUser) {
          userStore.set(curUser);
          goto("/dashboard", { replaceState: true });
        } else {
          userStore.set(null);
          if (window.location.pathname !== "/") {
            goto("/", { replaceState: true });
          }
        }
      });
    }
  });
  onMount(() => {
    if (browser) {
      onAuthStateChanged(auth, (curUser) => {
        if (curUser) {
          userStore.set(curUser);
          goto("/dashboard", { replaceState: true });
        } else {
          userStore.set(null);
          if (window.location.pathname !== "/") {
            goto("/", { replaceState: true });
          }
        }
      });
    }
  });

  async function handleLogout() {
    try {
      await signOut(auth);
      loadUserFromSessionStorage();
      // userStore.set(null)
      // goto('/', { replaceState: true }); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
</script>

<link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
/>

<nav class="navbar navbar-expand-lg px-4 py-3 text-light bg-dark navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Recipe App</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon text-dark"
        ><i class="bi bi-list"></i></span
      >
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto gap-3 align-items-center">
        {#if user}
          {#if showModal}
            <AddnewRecipe bind:showModal on:close={handleModalClose} />
          {/if}

          <li class="nav-item">
            <a class="nav-link" href="/dashboard">Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/dashboard/collection">Collection</a>
          </li>
          <li class="nav-item cursor-pointer">
            <span class="nav-link">{user.email}</span>
          </li>
          <li class="nav-item">
            <form class="d-flex" role="search">
              <input
                bind:value={searchVal}
                class="form-control me-2"
                type="search"
                placeholder="Search Recipes by Name,Ingredients"
                aria-label="Search"
              />
              <button class="btn btn-success" on:click={handleSearch}>Search</button>
            </form>
          </li>
          <!-- <li class="nav-item">
            <button
              on:click={() => (showModal = true)}
              on:close={() => (showModal = true)}
              class="btn btn-primary">Add New</button
            >
          </li> -->
          <li class="nav-item">
            <button on:click={handleLogout} class="btn btn-danger"
              >Logout</button
            >
          </li>
        {:else}
          <li class="nav-item">
            <a class="nav-link" href="/">Login Now !</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
