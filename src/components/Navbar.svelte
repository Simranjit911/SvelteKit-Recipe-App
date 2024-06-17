<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { auth, recipesRef } from "$lib/firebase";
  import { redirect } from "@sveltejs/kit";
  import userStore, {
    loadUserFromSessionStorage,
    resetBtnClick,
  } from "../store";
  import { onAuthStateChanged, signOut } from "firebase/auth";
  import type { User } from "firebase/auth";
  import AddnewRecipe from "./AddnewRecipe.svelte";
  import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
  } from "firebase/firestore";
  import { recipesStore } from "../store";
  import { toast } from "@jill64/svelte-toast";
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

    const searchTerm = searchVal.toLowerCase();

    const nameQuery = query(
      recipesRef,
      where("uid", "==", user.uid),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    );

    const ingredientsQuery = query(
      recipesRef,
      where("uid", "==", user.uid),
      where("ingredients", ">=", searchTerm),
      where("ingredients", "<=", searchTerm + "\uF8ff")
    );

    try {
      const nameSnapshot = await getDocs(nameQuery);
      const ingredientsSnapshot = await getDocs(ingredientsQuery);

      let searchResults = [
        ...nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...ingredientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];

      searchResults = Array.from(
        new Set(searchResults.map((recipe) => recipe.id))
      ).map((id) => searchResults.find((recipe) => recipe.id === id));

      recipesStore.set(searchResults);
    } catch (error) {
      console.error("Error searching for recipes:", error);
    }
  }
  let resetBtn = false;
  resetBtnClick.subscribe((val) => {
    resetBtn = val;
    if (val) {
      searchVal = "";
      handleSearch();
      resetBtnClick.set(false);
    }
  });

  onSnapshot(
    recipesRef,
    (snapshot) => {
      let recipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      recipes = recipes?.filter((r) => r?.uid == user?.uid);
      recipesStore.set(recipes);
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
      recipesStore.set([]);
      $toast.success("Logout Successfully");
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
              <button class="btn btn-success" on:click={handleSearch}
                >Search</button
              >
            </form>
          </li>

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
