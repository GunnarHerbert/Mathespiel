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
</script>

<template>
    <!--   Fehlernachricht-->
    <transition name="slide-down">
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>
    </transition>
    <div class="flex justify-center items-center h-screen">
      <div class="relative">
        <!-- Hintergrundbild -->
        <img
            alt="Spacestation"
            class="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-xl shadow-lg"
            src="@/assets/images/Spacestation.jpg"
        />

        <!-- Main-Inhalte -->
        <div class="absolute top-0 left-0 w-full h-full">
          <div class="auth-container flex flex-col">
            <!--TODO: restrictions for username, ...-->
            <div class="form-wrapper">
              <!-- Registration Form -->
              <div v-if="isRegistering">
                <h2 style="font-size: large; font-weight: 600">Registrierung</h2>
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
                <p class="mt-1" @click="toggleForm()">Bereits registriert? Hier einloggen</p>
              </div>

              <!-- Login Form -->
              <div v-else>
                <h2 style="font-size: large; font-weight: 600">Login</h2>
                <form @submit.prevent="login">
                  <label for="login-username">Benutzername</label>
                  <input id="login-username" v-model="loginForm.username" required type="text"/>

                  <label for="login-password">Passwort</label>
                  <input id="login-password" v-model="loginForm.password" required type="password"/>

                  <button type="submit">Einloggen</button>
                </form>
                <p class="mt-1" @click="toggleForm">Noch keinen Account? Hier registrieren</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.auth-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 45%;
}

.form-wrapper {
  background: rgba(255, 255, 255, 0.92);
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: clamp(240px, 28vw, 400px);
  max-height: 80%;
  overflow-y: auto;
  backdrop-filter: blur(6px);
}

/* --- Fehlerbanner (oben, animiert, unabhängig vom Layout) --- */
.error-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #dc2626;
  color: white;
  text-align: center;
  font-weight: 500;
  padding: 0.75rem 1rem;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Slide-down Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Optional: lokale Fehlermeldung innerhalb der Box */
.local-error {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 1.5rem;
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


button:hover {
  background-color: #0056b3;
}

p {
  text-align: center;
  color: #007bff;
  cursor: pointer;
}
</style>