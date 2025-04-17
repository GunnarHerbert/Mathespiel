<script lang="ts" setup>
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
const errorMessage = ref("");

// Auto-Dismiss nach 5 Sekunden
watch(errorMessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      errorMessage.value = "";
    }, 4000);
  }
})

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
    errorMessage.value = registerResponse.message;
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
    errorMessage.value = loginResponse.message;
  }
}

function toggleForm() {
  errorMessage.value = "";
  isRegistering.value = !isRegistering.value;
}

import '~/assets/css/login.css'
</script>

<template>
  <!--  <DevOnly>-->
  <!--    <p v-if="loggedIn">{{ user?.username }}</p>-->
  <!--    <p v-else>Du bist nicht eingeloggt.</p>-->
  <!--    <button @click="clear()">Abmelden</button>-->
  <!--  </DevOnly>-->
  <div class="wrapper">
    <!-- Fehlernachricht -->
    <transition name="slide-down">
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>
    </transition>
    <!-- Hintergrundbild -->
    <div class="content-container">
      <div class="auth-container flex flex-col">
        <!--TODO: restrictions for username, ...-->
        <div class="form-wrapper">
          <!-- Registration Form -->
          <div v-if="isRegistering">
            <h2>Registrierung</h2>
            <form @submit.prevent="register">
              <label for="username">Benutzername</label>
              <input id="username" v-model="registerForm.username" required type="text"/>

              <label for="email">Email</label>
              <input id="email" v-model="registerForm.email" required type="email"/>

              <label for="password">Passwort</label>
              <input id="password" v-model="registerForm.password" required type="password"/>

              <label for="grade">Klassenstufe</label>
              <input id="grade" v-model="registerForm.grade" max="13" min="1" required type="number"/>

              <button type="submit">Registrieren</button>
            </form>
            <p @click="toggleForm()">Bereits registriert? Hier einloggen</p>
          </div>

          <!-- Login Form -->
          <div v-else>
            <h2>Login</h2>
            <form @submit.prevent="login">
              <label for="login-username">Benutzername</label>
              <input id="login-username" v-model="loginForm.username" required type="text"/>

              <label for="login-password">Passwort</label>
              <input id="login-password" v-model="loginForm.password" required type="password"/>

              <button type="submit">Einloggen</button>
            </form>
            <p @click="toggleForm">Noch keinen Account? Hier registrieren</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>