<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  import { get } from "svelte/store";
  import userStore, { recipesStore } from "../../../store.js";

  let user = get(userStore);
  export let data;
  let showModal = false;

  function handleModalClose() {
    showModal = false;
  }

  let recipes = [];
  recipesStore.subscribe((currRecipe) => {
    recipes = currRecipe;
  });
  recipes = recipes.filter((r) => r.collection == true);

  if (browser) {
    if (user == null) {
      goto("/", { replaceState: true });
    }
  }

  function truncateText(text, wordLimit) {
    const words = text.split("");

    if (words.length > wordLimit) {
      let res = words.slice(0, wordLimit).join("") + "...";

      return res;
    }
    return text;
  }

  function capitalizeText(text) {
    return text.toUpperCase();
  }

 
</script>

{#if !user}
  <div class="container my-5">
    <h1 class="text-center">Collection</h1>
    <p class="text-center">
      This page is only accessible when you are logged in.
    </p>
  </div>
{:else}
  <div class="container my-5">
    <div class="row">
      {#if recipes.length >= 1}
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3">Your Recipes Collection</h1>
        </div>
        {#each recipes as recipe (recipe.id)}
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img
                src={recipe.imageUrl}
                class="card-img-top"
                alt={recipe.name}
              />
              <div class="card-body d-flex flex-column">
                <div
                  class="d-flex justify-content-between align-items-start mb-2"
                >
                  <h5 class="card-title text-uppercase">
                    {capitalizeText(recipe.name)}
                  </h5>
                  <a href="/dashboard/{recipe.id}" class="btn btn-link p-0"
                    >See more</a
                  >
                </div>
                <p class="card-text flex-grow-1">
                  {truncateText(recipe.description, 25)}
                </p>
                <p class="card-text">
                  <strong>Ingredients:</strong>
                  {truncateText(recipe.ingredients, 15)}
                </p>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="col-12">
          <h1 class="text-center my-4">You Have No Recipes in Collection</h1>
          <div class="text-center">
            <button class="btn btn-primary" on:click={() => goto("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    margin: auto;
  }
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #343a40;
  }
  .card-img-top {
    height: 200px;
    object-fit: cover;
  }
  .btn-link {
    text-decoration: none;
    color: #007bff;
  }
  .btn-link:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  .btn-primary,
  .btn-primary:hover,
  .btn-primary:focus,
  .btn-primary:active {
    background-color: #007bff;
    border-color: #007bff;
  }
  .card {
    border: none;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s;
  }
  .card:hover {
    transform: scale(1.02);
  }
  .card-body {
    background-color: #f8f9fa;
  }
  .card-text {
    color: #495057;
  }
  .shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
</style>
