<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { json } from '@sveltejs/kit';
  
    export let data: { recipe: any };
    let incred = data.recipe.incredients.split(',');
    let recipeId=$page.params.recipeId
    console.log(recipeId)
    async function handleDelete() {
      try {
        const res = await fetch(`http://localhost:5173/apis/recipes/${recipeId}`, {
          method: 'DELETE'
        });
  
        if (res.ok) {
          const result = await res.json();
          alert(result.msg); 
          goto('/dashboard'); 
        } else {
          const error = await res.json();
          alert(error.error); 
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe.');
      }
    }
  </script>
  
  {#if data.recipe}
    <div class="container my-5">
      <img src={data.recipe.imageUrl} alt={data.recipe.name} class="img-fluid mb-4" />
      <button class="btn btn-danger" on:click={handleDelete}>Delete</button>
      <h1>{data.recipe.name}</h1>
      <p>{data.recipe.description}</p>
      <h5>Ingredients:</h5>
      {#each incred as i}
        <span class="bg-gray p-1">{i}</span>
      {/each}
    </div>
  {:else}
    <div class="container my-5">
      <h1>Recipe not found</h1>
      <p>The recipe you are looking for does not exist.</p>
    </div>
  {/if}
  