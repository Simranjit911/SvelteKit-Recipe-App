<script lang="ts">
  import { recipesRef, storage } from "$lib/firebase";
  import { addDoc, serverTimestamp } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { createEventDispatcher } from "svelte";
  import userStore from "../store";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { toast } from "@jill64/svelte-toast";

  let user = get(userStore);

  export let showModal: boolean;
  const dispatch = createEventDispatcher();

  function closeModal() {
    showModal = false;
    dispatch("close");
  }

  async function handleForm(event: Event) {

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const imageFile = formData.get("image") as File;

    if (
      imageFile &&
      !["image/jpeg", "image/png", "image/gif"].includes(imageFile.type)
    ) {
      alert("Please upload a valid image file (JPEG, PNG, or GIF).");
      return;
    }
    const data = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      ingredients: formData.get("ingredients") as string,
      description: formData.get("description") as string,
    };

    $toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          let storageref = ref(storage, `images/${data.image.name}`);
          let snapShot = await uploadBytes(storageref, data.image);
          let imageUrl = await getDownloadURL(snapShot.ref);

          let newRecipe = {
            name: data.name,
            uid: user?.uid,
            imageUrl,
            ingredients: data.ingredients,
            description: data.description,
            collection: false,
            createdAt: serverTimestamp(),
          };

          let res = await addDoc(recipesRef, newRecipe);

          if (res.id) {
            resolve("Recipe Added!");
            closeModal();
          } else {
            reject(new Error("Failed to add recipe"));
          }
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: 'Adding Recipe...',
        success: 'Recipe Added!',
        error: (err) => `Failed to add recipe: ${err.message}`
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
        <h5 class="modal-title">Add New Recipe</h5>
        <button type="button" class="close text-white" on:click={closeModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form on:submit|preventDefault={handleForm}>
          <div class="form-group">
            <label for="name" class="form-label">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-control"
              placeholder="Enter recipe name"
              required
            />
          </div>
          <div class="form-group">
            <label for="image" class="form-label">Recipe Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg, image/png, image/gif"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="ingredients" class="form-label">Ingredients</label>
            <textarea
              id="ingredients"
              name="ingredients"
              class="form-control"
              rows="3"
              placeholder="Enter ingredients, separated by commas"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              class="form-control"
              rows="5"
              placeholder="Enter description"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100">Add Recipe</button
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
