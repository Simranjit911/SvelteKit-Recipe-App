<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { json } from "@sveltejs/kit";
  import UpdateRecipe from "../../../components/UpdateRecipe.svelte";
  import userStore from "../../../store";
  import { collection } from "firebase/firestore";
  import { toast } from "@jill64/svelte-toast";
  let showUpdateModal = false;
  function handleModalClose() {
    showUpdateModal = false;
  }
  let user = get(userStore);
  let userId = user?.uid;
  export let data: { recipe: any };

  let incred = data?.recipe?.ingredients?.split(",") || [];
  let recipeId = $page.params.recipeId;

  async function handleDelete() {
    $toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
          `https://recipe-app-iota-cyan.vercel.app/apis/recipes/${recipeId}`,
            {
              method: "DELETE",
              headers: {
                userId,
              },
            }
          );

          if (res.ok) {
            const result = await res.json();
            resolve(result.msg);
            goto("/dashboard");
          } else {
            const error = await res.json();
            alert(error.error);
          }
        } catch (error) {
          console.error("Error deleting recipe:", error);
          reject("Failed to Delete Recipe");
        }
      }),
      {
        loading: "Deleting Recipe",
        success: "Recipe Deleted Successfully",
        error: (e) => e,
      }
    );
  }
  async function addToCollection() {
    let bodyData = {
      recipeData: { ...data.recipe, collection: !data.recipe.collection },
    };

    try {
      let res = await fetch(`/apis/recipes/${recipeId}`, {
        method: "PATCH",
        headers: {
          userid: userId,
        },
        body: JSON.stringify(bodyData),
      });
      if (res.ok) {
        $toast.success("Collection Updated Successfully")
        goto("/dashboard/collection");
      }
    } catch (error) {
   
      $toast.error("Fail to Update Collection")
    }
  }
</script>

{#if showUpdateModal}
  <UpdateRecipe
    bind:showUpdateModal
    {recipeId}
    on:closeUpdateModal={handleModalClose}
  />
{/if}

{#if data.recipe}
  <div class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button
        class="btn btn-outline-secondary"
        on:click={() => goto("/dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>Back
      </button>
      <div class="d-flex gap-2">
        <button
          class="btn {data.recipe.collection
            ? 'btn-outline-danger'
            : 'btn-outline-secondary'} "
          on:click={addToCollection}
          title="{data.recipe.collection ? 'Remove from Collection' : 'Add to Collection'}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-bookmark-heart"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"
            />
            <path
              d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"
            />
          </svg>
        </button>
        <button class="btn btn-danger" title="Delete Recipe" on:click={handleDelete}>
          <i class="bi bi-trash"></i> Delete
        </button>
        <button
          class="btn btn-success" title="Update Recipe"
          on:click={() => (showUpdateModal = true)}
        >
          <i class="bi bi-pencil"></i> Update
        </button>
      </div>
    </div>
    <div class="card shadow-lg">
      <img
        src={data.recipe.imageUrl}
        alt={data.recipe.name}
        class="card-img-top img-fluid"
      />

      <div class="card-body">
        <h3 class="my-2">Name:</h3>

        <h3 class="mx-2 card-title text-capitalize">{data.recipe.name}</h3>
     
        <h5>Ingredients:</h5>
        {#each incred as i}
        <span class="mx-2 text-white bg-danger rounded text-capitalize px-1"
        >{i}</span
        >
        {/each}
        <h5 class="my-2">Description:</h5>
           <p class="card-text text-capitalize">{data.recipe.description}</p>
      </div>
    </div>
  </div>
{:else}
  <div class="container my-5 text-center">
    <h1>Recipe not found</h1>
    <p>The recipe you are looking for does not exist.</p>
    <button
      class="btn btn-outline-secondary"
      on:click={() => goto("/dashboard")}
    >
      <i class="bi bi-arrow-left"></i> Back to Dashboard
    </button>
  </div>
{/if}

<style>
  .btn-outline-secondary {
    display: flex;
    align-items: center;
  }
  .btn-outline-secondary i {
    margin-right: 8px;
  }
  .card {
    border: none;
    border-radius: 8px;
    overflow: hidden;
  }
  .card-img-top {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .list-group-item {
    border: none;
    padding: 10px 15px;
  }
</style>
