<script setup lang="ts">
const isRegistering = ref(true)
const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  grade: null,
})
const loginForm = reactive({
  username: "",
  password: "",
})

function toggleForm() {
  isRegistering.value = !isRegistering.value;
}

async function register() {
  //TODO: if username exits already: give visual feedback
  console.log("Registering", registerForm);
  const response = await $fetch('/api/login', {
    method: 'POST',
    body: {
      action: 'registerUser',
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      grade: registerForm.grade,
    }
  });
  console.log(response);
}

async function login() {
  //TODO: check if username exists and matches with password
  //TODO: redirect user to main page or return "username or password wrong"-message
  console.log("Logging in", loginForm);
  const response = await $fetch('/api/login', {
    method: 'POST',
    body: {
      action: 'loginUser',
      username: loginForm.username,
      password: loginForm.password,
    }
  });
}
</script>

<template>
  <div class="auth-container">
    <div class="form-wrapper">
      <!-- Registration Form -->
      <div v-if="isRegistering">
        <h2>Registrierung</h2>
        <form @submit.prevent="register">
          <label for="username">Benutzername</label>
          <input type="text" id="username" v-model="registerForm.username" required/>

          <label for="email">Email</label>
          <input type="email" id="email" v-model="registerForm.email" required/>

          <label for="password">Passwort</label>
          <input type="password" id="password" v-model="registerForm.password" required/>

          <label for="grade">Klassenstufe</label>
          <input type="number" id="grade" v-model="registerForm.grade" min="1" max="13" required/>

          <button type="submit">Registrieren</button>
        </form>
        <p @click="toggleForm()">Bereits registriert? Hier einloggen</p>
      </div>

      <!-- Login Form -->
      <div v-else>
        <h2>Login</h2>
        <form @submit.prevent="login">
          <label for="login-username">Benutzername</label>
          <input type="text" id="login-username" v-model="loginForm.username" required/>

          <label for="login-password">Passwort</label>
          <input type="password" id="login-password" v-model="loginForm.password" required/>

          <button type="submit">Einloggen</button>
        </form>
        <p @click="toggleForm">Noch keinen Account? Hier registrieren</p>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/login.css"></style>
