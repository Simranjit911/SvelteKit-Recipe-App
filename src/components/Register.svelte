<script lang="ts">
  import { goto } from "$app/navigation";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import userStore from "../store";
  import { auth } from "$lib/firebase";
  import { toast } from "@jill64/svelte-toast";

  let userData = {
    email: "",
    password: "",
  };
 
  async function handleRegister() {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      if (res.user) {
        $toast.success("User Registered Successfuly");
        userStore.set(res.user);
        goto("/dashboard");
      } else {
        $toast.error("User not found:", userData.email);
      }
    } catch (error) {
      $toast.error(error.message);
    }
  }
</script>

<link
  rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
/>

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow-lg">
        <div class="card-header bg-primary text-white">
          <h3 class="text-center mb-0">Register Now!</h3>
        </div>
        <div class="card-body p-4">
          <form on:submit|preventDefault={handleRegister} action="">
            <div class="form-group mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter Email"
                bind:value={userData.email}
                required
              />
            </div>
            <div class="form-group mb-4">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Enter Password"
                bind:value={userData.password}
                required
                minlength="6"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    border-radius: 0.5rem;
  }
  .card-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    padding: 1rem 1.25rem;
  }
  .form-label {
    margin-bottom: 0.5rem;
  }
  .form-control {
    border-radius: 0.25rem;
  }
  .btn {
    padding: 0.75rem;
    font-size: 1rem;
  }
</style>