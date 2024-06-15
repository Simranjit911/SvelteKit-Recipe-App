<script lang="ts">
  import { recipesRef, storage } from "$lib/firebase";
  import { addDoc, serverTimestamp } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { createEventDispatcher } from "svelte";
  import userStore from "../store";
  import { get } from "svelte/store";

  let user = get(userStore);
  console.log(user?.uid, user);

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

    const data = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      ingredients: formData.get("ingredients") as string,
      description: formData.get("description") as string,
    };

    console.log(data.image.name, data.image);
    try {
        let storageref = ref(storage, `images/${data.image.name}`);
        let snapShot = await uploadBytes(storageref, data.image);
        let imageUrl = await getDownloadURL(snapShot.ref);
        console.log(imageUrl, snapShot);
      let newRecipe = {
        name: data.name,
        uid: user?.uid,
        imageUrl,
        incredients: data.ingredients,
        description: data.description,
        createdAt: serverTimestamp(),
      };
      console.log(newRecipe);
      let res = await addDoc(recipesRef, newRecipe);
      console.log(res);
      if (res.id) {
        alert("Data added");
        closeModal()
      }
    } catch (e) {
      console.log(e);
    }
  }
</script>

<div class="container mt-5">
  <div class="card shadow">
    <div
      class="card-header bg-primary text-white d-flex justify-content-between"
    >
      <h4 class="mb-0">Add New Recipe</h4>
      <button class="btn btn-danger py-1" on:click={closeModal}>x</button>
    </div>
    <div class="card-body">
      <form on:submit|preventDefault={handleForm}>
        <div class="mb-3">
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
        <div class="mb-3">
          <label for="image" class="form-label">Recipe Image</label>
          <input
            type="file"
            id="image"
            name="image"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
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
        <div class="mb-3">
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
        <button type="submit" class="btn btn-primary w-100">Add Recipe</button>
      </form>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
  }
  .card {
    margin-top: 20px;
  }
</style>
