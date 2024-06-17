<script lang="ts">
  import { recipesRef, storage } from "$lib/firebase";
  import { addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
  import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
  } from "firebase/storage";
  import { createEventDispatcher, onMount } from "svelte";
  import userStore from "../store";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { toast } from "@jill64/svelte-toast";

  let user = get(userStore);

  export let showUpdateModal: boolean;
  export let recipeId: string;
  let userId = user?.uid;

  const dispatch = createEventDispatcher();

  function closeModal() {
    showUpdateModal = false;
    dispatch("closeUpdateModal");
  }
  let formData = {};
  async function getData() {
    try {
      let res = await fetch(`/apis/recipes/${recipeId}`, {
        headers: {
          userid: userId,
        },
      });

      if (res.ok) {
        let data = await res.json();

        formData = { ...data.recipe };
      } else {
        let errorData = await res.json();
        console.error("Error fetching data:", errorData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  onMount(() => {
    getData();
  });

  async function handleForm(event: Event) {
    if(formData.name==""||formData.description==""||formData.ingredients==""){
            return $toast.error("All text feild are required,Image is optional")
    }
    let newImageUrl;
    const form = event.target as HTMLFormElement;
    const formDataImg = new FormData(form);

    let newImageFile = formDataImg.get("image") as File;
 
    if (newImageFile.name!="") {
      if (
        newImageFile &&
        !["image/jpeg", "image/png", "image/gif"].includes(newImageFile.type)
      ) {
        return $toast.error("Please upload a valid image file (JPEG, PNG, or GIF).", {
          duration: 900,
        });

      }
    }
    $toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          let newImageUrl;
          if (newImageFile.name!="") {
            // Delete the existing image from Firebase Storage
            const existingImageUrl = formData.imageUrl;
            const imageName = `${Date.now()}_${newImageFile.name}`;
            const newImageRef = ref(storage, `images/${imageName}`);
            let snapShotRef = await uploadBytes(newImageRef, newImageFile);
            newImageUrl = await getDownloadURL(snapShotRef.ref);

            if (existingImageUrl) {
              const existingImageRef = ref(storage, existingImageUrl);
              await deleteObject(existingImageRef);
            }
          }

          const bodyData = {
            recipeData: {
              name: formData.name,
              description: formData.description,
              ingredients: formData.ingredients,
              imageUrl: newImageUrl  || formData.imageUrl,
            },
            newImageFile: newImageFile || null,
          };
   

          let res = await fetch(`/apis/recipes/${recipeId}`, {
            method: "PATCH",
            headers: {
              userid: userId,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });

          if (res.ok) {
            let data = await res.json();
            closeModal();
            goto("/dashboard");
            resolve("Recipe Updated!");
          } else {
            let errorData = await res.json();
            reject(new Error("Error updating recipe: " + errorData.error));
          }
        } catch (error) {
          reject(new Error("Error updating recipe: " + error.error));
        }
      }),
      {
        loading: "Updating Recipe...",
        success: "Recipe Updated!",
        error: (err) => `Failed to update recipe: ${err.error}`,
      }
    );
  }
</script>

<div
  class="modal fade show"
  style="display: block;"
  tabindex="-1"
  role="dialog"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">Update Recipe</h5>
        <button type="button" class="close text-white" on:click={closeModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form on:submit|preventDefault={handleForm}>
          <div class="form-group">
            <label for="name" class="form-label">Update Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-control"
              placeholder="Enter recipe name"
              required
              bind:value={formData.name}
            />
          </div>
          <div class="form-group">
            <label for="image" class="form-label">Update Recipe Image</label>
            <input
              type="file"
              id="image"
              name="image"
              class="form-control"
              accept="image/jpeg, image/png, image/gif"
            />
          </div>
          <div class="form-group">
            <label for="ingredients" class="form-label">Update Ingredients</label>
            <textarea
              bind:value={formData.ingredients}
              id="ingredients"
              name="ingredients"
              class="form-control"
              rows="3"
              placeholder="Enter ingredients, separated by commas"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="description" class="form-label">Update Description</label>
            <textarea
              id="description"
              name="description"
              class="form-control"
              rows="5"
              bind:value={formData.description}
              placeholder="Enter description"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100"
            >Update Recipe</button
          >
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-dialog {
    max-width: 600px;
  }
  .modal-content {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  .modal-header {
    border-bottom: none;
  }
  .modal-header .close {
    outline: none;
  }
  .form-label {
    font-weight: bold;
  }
  .form-control {
    margin-bottom: 1rem;
  }
</style>
