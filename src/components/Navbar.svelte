<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/firebase';
  import { redirect } from '@sveltejs/kit';
  import userStore from '../store';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import type { User } from "firebase/auth";

  let user: User | null = null;

  userStore.subscribe((u) => {
    user = u;
  });
onAuthStateChanged(auth,(c)=>{
  console.log(c)
})
  onMount(() => {
    if (browser) {
      onAuthStateChanged(auth, (curUser) => {
        if (curUser) {
          userStore.set(curUser);
          goto('/dashboard', { replaceState: true });
        } else {
          userStore.set(null);
          if (window.location.pathname !== '/') {
            goto('/', { replaceState: true });
          }
        }
      });
    }
  });

  async function handleLogout() {
    try {
      await signOut(auth);
      // userStore.set(null); // Clear user store on logout
      // goto('/', { replaceState: true }); // Redirect to home page after logout
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  }
</script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<nav class="navbar navbar-expand-lg px-4 navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Recipe App</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        {#if user}
          <li class="nav-item">
            <a class="nav-link" href="/dashboard">Dashboard</a>
          </li>
          <li class="nav-item">
            <button on:click={handleLogout} class="btn btn-primary">Logout</button>
          </li>
        {:else}
          <li class="nav-item">
            <a class="nav-link" href="/">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/">Home</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
