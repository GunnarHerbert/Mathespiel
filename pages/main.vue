<script lang="ts" setup>
const {user, clear, fetch: fetchSession} = useUserSession();
fetchSession();

function logout() {
  clear();
  navigateTo("/login");
}

var errorMessage = ref("");
import '~/assets/css/login.css'
</script>

<template>
  <!--   Fehlernachricht-->
  <transition name="slide-down">
    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>
  </transition>
  <div class="wrapper flex justify-center items-center h-screen">
    <div class="relative">
      <!-- Hintergrundbild -->
      <img
          alt="Spacestation"
          class="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-xl shadow-lg"
          src="@/assets/images/Spacestation.jpg"
      />

      <!-- Main-Inhalte -->
      <div class="absolute top-0 left-0 w-full h-full">
        <!-- Abmelden-Button (responsive) -->
        <button
            class="absolute bottom-3 right-3 text-[clamp(0.6rem,1vw,0.85rem)] px-[0.8em] py-[0.3em] bg-white/60 text-gray-900 rounded shadow-md hover:brightness-125 transition-all duration-200 ease-in-out"
            @click="logout()"
        >
          Abmelden
        </button>

        <!-- Benutzerinfo-Box -->
        <div
            class="absolute top-10 right-3 pt-8 px-10 pb-8 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xl font-medium shadow-lg space-y-3">
          <p><span class="font-semibold text-blue-300"> Benutzername: </span> {{ user?.username }} </p>
          <p><span class="font-semibold text-blue-300"> Rang: </span> {{ user?.rank }} </p>
          <p><span class="font-semibold text-blue-300"> Punkte: </span> {{ user?.points }} </p>
          <p><span class="font-semibold text-blue-300"> Kristalle:</span> {{ user?.crystals }} </p>
        </div>

        <!-- Trainings-Button -->
        <div class="flex justify-center items-center h-full">
          <button
              class="bg-blue-500 text-white font-bold px-6 py-4 text-2xl rounded-lg shadow-md hover:brightness-110 transition"
              @click="navigateTo('/training')"
          >
            Training
          </button>
        </div>
      </div>
    </div>
  </div>
</template>