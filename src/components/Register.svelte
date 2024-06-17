<script lang="ts">
  import { goto } from "$app/navigation";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import userStore from "../store";
  import { auth } from "$lib/firebase";
  import { toast } from "@jill64/svelte-toast";

  let userData = {
    email: "u@g.com",
    password: "123456",
  };
  // async function handleRegister() {
  //   try {
  //     const res = await fetch("apis/auth", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userData }),
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       console.log("User created successfully:", data);
  //       userStore.set(data.user);
  //       goto("/dashboard"); // Redirect to the dashboard
  //     } else {
  //       let errorData = await res.json();
  //       alert(errorData);
  //       console.log("Error in response:", errorData);
  //     }
  //   } catch (e) {
  //     console.error("An error occurred:", e);
  //   }
  // }
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
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-center">Register Now!</h3>
        </div>
        <div class="card-body">
          <form on:submit|preventDefault={handleRegister} action="">
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Enter Email"
                bind:value={userData.email}
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Enter Password"
                bind:value={userData.password}
                required
                minlength="6"
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
