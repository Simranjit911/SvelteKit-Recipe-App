<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import userStore from '../../store';
    import { get } from 'svelte/store';
  let user =get(userStore)
  console.log(user)

  </script>
  
  <h1>Dashboard</h1>
  <p>This page is only accessible when you are logged in.</p>
  