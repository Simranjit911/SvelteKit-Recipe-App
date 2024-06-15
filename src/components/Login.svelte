<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import userStore from "../store";

  let userData = {
    email: "u@g.com",
    password: "123456",
  };

  // async function handleLogin() {
  //   try {
  //     const res = await fetch("apis/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userData }),
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       console.log("User Login successfully:", data);
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
  async function handleLogin() {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      console.log(res.user);
      if (res.user) {
        console.log("User logged in successfully:", res.user);
        if (typeof window !== "undefined") {
        
          sessionStorage.setItem("user", JSON.stringify(res.user));
        }
        userStore.set(res.user);
        goto("/dashboard");
      } else {
        console.log("User not found:", userData.email);
        // Handle case where user is not found
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
</script>

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-center">Login Now!</h3>
        </div>
        <div class="card-body">
          <form on:submit|preventDefault={handleLogin} action="">
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
                required
                min="6"
                type="password"
                class="form-control"
                placeholder="Enter Password"
                bind:value={userData.password}
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
