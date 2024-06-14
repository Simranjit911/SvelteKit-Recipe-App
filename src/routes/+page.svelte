<script>
  import AuthCheck from "../components/AuthCheck.svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import userStore from "../store";
  import { get } from "svelte/store";
  let user =get(userStore)
if(user){
  goto("/dashboard")
}

  let select = "login";
</script>

<AuthCheck>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center gap-4 justify-content-center">
              <button
                class:active={select === "login"}
                class="btn btn-primary"
                on:click={() => (select = "login")}
              >
                Login
              </button>
              <button
                class:active={select === "register"}
                class="btn btn-primary"
                on:click={() => (select = "register")}
              >
                Register
              </button>
            </div>
            {#if select === "login"}
              <Login />
            {/if}
            {#if select === "register"}
              <Register />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</AuthCheck>

<style>
  .selected {
    font-weight: bold;
  }
  button{
      outline: none;
    border: none;
    background-color: gray;
    color: white;
    border-radius: 5px;
    padding: 5px 8px;
  }
  .active {
    font-weight: bold;
    background-color: rgb(0 123 255);
  
  }
</style>
