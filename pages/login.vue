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
const {loggedIn, user, clear, fetch: fetchSession} = useUserSession();

async function register() {
  const registerResponse = await $fetch('/api/login', {
    method: 'POST',
    body: {
      action: 'registerUser',
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      grade: registerForm.grade,
    }
  });
  if (registerResponse.success) {
    await fetchSession();
    navigateTo("/main");
  } else {
    //TODO: if username exits already: give visual feedback
    console.log(registerResponse.message);
  }
}

async function login() {
  const loginResponse = await $fetch('/api/login', {
    method: 'POST',
    body: {
      action: 'loginUser',
      username: loginForm.username,
      password: loginForm.password,
    }
  });
  if (loginResponse.success) {
    await fetchSession();
    navigateTo("/main");
  } else {
    //TODO: if username or password is wrong: give visual feedback
    console.log(loginResponse.message);
  }
}

function toggleForm() {
  isRegistering.value = !isRegistering.value;
}

import '~/assets/css/login.css'
</script>

<template>
  <p v-if="loggedIn">{{ user?.username }}</p>
  <p v-else>Du bist nicht eingeloggt.</p>
  <button @click="clear()">Abmelden</button>
  <div class="auth-container">
    <!--TODO: restrictions for username, ...-->
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