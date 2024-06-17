<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import userStore, { recipesStore, resetBtnClick } from "../../store";
  import { get } from "svelte/store";
  import AddnewRecipe from "../../components/AddnewRecipe.svelte";
  import SingleRecipe from "../../components/SingleRecipe.svelte";

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

  if (browser) {
    if (user == null) {
      goto("/", { replaceState: true });
    }
  }
</script>

{#if !user}
  <div class="container my-5">
    <h1 class="text-center">Dashboard</h1>
    <p class="text-center">
      This page is only accessible when you are logged in.
    </p>
  </div>
{:else}
  {#if showModal}
    <AddnewRecipe bind:showModal on:close={handleModalClose} />
  {/if}
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Your Recipes</h1>
      <div>
        <button class="btn btn-danger" on:click={()=>resetBtnClick.set(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bootstrap-reboot" viewBox="0 0 16 16">
          <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z"/>
          <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z"/>
        </svg></button>
        <button class="btn btn-primary" on:click={() => (showModal = true)}>
          Add New Recipe
        </button>
      </div>
    </div>
    <div class="row">
      {#if recipes.length >= 1}
        {#each recipes as recipe (recipe.id)}
          <!-- <div class="col-md-6 col-lg-4 mb-4">
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
                    {truncateText(capitalizeText(recipe.name),15)}
                  </h5>
                  <a href="dashboard/{recipe.id}" class="btn btn-link p-0"
                    >See more</a
                  >
                </div>
                <p class="card-text">
                  <strong>Ingredients:</strong>
                  {truncateText(recipe.ingredients, 15)}
                </p>
                <p class="card-text flex-grow-1 text-capitalize">
                  {truncateText(recipe.description, 25)}
                </p>
              </div>
            </div>
          </div> -->

          <SingleRecipe {recipe} />
        {/each}
      {:else}
        <div class="col-12">
          <h1 class="text-center my-4">
            No recipes found. Create a new Recipe!
          </h1>
          <div class="text-center">
            <button class="btn btn-primary" on:click={() => (showModal = true)}>
              Add New Recipe
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
