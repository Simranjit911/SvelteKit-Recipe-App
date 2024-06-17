<script>
  import AuthCheck from "../components/AuthCheck.svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import userStore from "../store";
  import { get } from "svelte/store";
  import { browser } from "$app/environment";
  let user = get(userStore);
  if (browser) {
    if (user) {
      goto("/dashboard", { replaceState: true });
    }
  }

  let select = "login";
</script>

<AuthCheck>
  {#if user==null}
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header text-center">
            <div class="btn-group" role="group" aria-label="Auth buttons">
              <button
                class="btn btn-outline-primary {select === 'login' ? 'active' : ''}"
                on:click={() => (select = 'login')}
              >
                Login
              </button>
              <button
                class="btn btn-outline-primary {select === 'register' ? 'active' : ''}"
                on:click={() => (select = 'register')}
              >
                Register
              </button>
            </div>
          </div>
          <div class="card-body">
            {#if select === 'login'}
              <Login />
            {/if}
            {#if select === 'register'}
              <Register />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="alert alert-danger text-center" role="alert">
          Unauthorized Access
        </div>
      </div>
    </div>
  </div>
  {/if}
</AuthCheck>

<style>
  .btn-group .btn.active {
    font-weight: bold;
    background-color: #007bff;
    color: white;
  }
  .btn-group .btn {
    transition: background-color 0.3s ease;
  }
  .btn-group .btn:hover {
    background-color: #0056b3;
    color: white;
  }
</style>