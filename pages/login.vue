<template>
  <div class="auth-container">
    <div class="form-wrapper">
      <!-- Registration Form -->
      <div v-if="isRegistering">
        <h2>Registrierung</h2>
        <form @submit.prevent="register">
          <label for="username">Benutzername</label>
          <input type="text" id="username" v-model="registerForm.username" required />

          <label for="email">Email</label>
          <input type="email" id="email" v-model="registerForm.email" required />

          <label for="password">Passwort</label>
          <input type="password" id="password" v-model="registerForm.password" required />

          <label for="grade">Klassenstufe</label>
          <input type="number" id="grade" v-model="registerForm.grade" min="1" max="13" required />

          <button type="submit">Registrieren</button>
        </form>
        <p @click="toggleForm">Bereits registriert? Hier einloggen</p>
      </div>

      <!-- Login Form -->
      <div v-else>
        <h2>Login</h2>
        <form @submit.prevent="login">
          <label for="login-username">Benutzername</label>
          <input type="text" id="login-username" v-model="loginForm.username" required />

          <label for="login-password">Passwort</label>
          <input type="password" id="login-password" v-model="loginForm.password" required />

          <button type="submit">Einloggen</button>
        </form>
        <p @click="toggleForm">Noch keinen Account? Hier registrieren</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRegistering: true,
      registerForm: {
        username: "",
        email: "",
        password: "",
        grade: null,
      },
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    toggleForm() {
      this.isRegistering = !this.isRegistering;
    },
    async register() {
      // Simulate API call
      console.log("Registering", this.registerForm);
      // Hier könnte ein API-Aufruf stehen, z.B.: await this.$axios.post('/api/register', this.registerForm);
    },
    async login() {
      // Simulate API call
      console.log("Logging in", this.loginForm);
      // Hier könnte ein API-Aufruf stehen, z.B.: await this.$axios.post('/api/login', this.loginForm);
    },
  },
};
</script>

<style src="@/assets/css/login.css"></style>
