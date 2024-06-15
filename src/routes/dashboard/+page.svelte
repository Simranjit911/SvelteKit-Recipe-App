<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import userStore, { recipesStore } from "../../store";
  import { get } from "svelte/store";
  import AddnewRecipe from "../../components/AddnewRecipe.svelte";
  let user = get(userStore);

  // export let data;
  let showModal = false;

  function handleModalClose() {
    showModal = false;
  }
  let recipes = [];
  recipesStore.subscribe((currRecipe) => {
    recipes = currRecipe;
  });
  async function fetchRecipe() {}
  console.log(recipes);
</script>

{#if !user}
  <h1>Dashboard</h1>
  <p>This page is only accessible when you are logged in.</p>
{/if}
<div>
  <button on:click={() => (showModal = true)}>Add new</button>
</div>
{#if showModal}
  <AddnewRecipe bind:showModal on:close={handleModalClose} />
{/if}
<div class="row">
  {#each recipes as recipe (recipe.id)}
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100">
        <img src={recipe.imageUrl} class="card-img-top" alt={recipe.name} />
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">{recipe.name}</h5>
            <a href="dashboard/{recipe.id}">See more</a>
          </div>
          <p class="card-text">{recipe.description}</p>
          <p class="card-text">
            <strong>Ingredients:</strong>
            {recipe.incredients}
          </p>
        </div>
      </div>
    </div>
  {/each}
</div>
