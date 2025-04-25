<script lang="ts" setup>
const {user, clear, fetch: fetchSession} = useUserSession();
fetchSession();

function logout() {
  clear();
  navigateTo("/login");
}

var errorMessage = ref("");
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
          src="assets/images/Spacestation.jpg"
      />

      <!-- Main-Inhalte -->
      <div class="absolute top-0 left-0 w-full h-full">
        <!-- Abmelden-Button (responsive) -->
        <button
            class="absolute bottom-[1%] right-[1%] logoutFontSize px-[0.8em] py-[0.3em] bg-white/60 text-gray-900 rounded shadow-md hover:brightness-125 transition-all duration-200 ease-in-out"
            @click="logout()"
        >
          Abmelden
        </button>

        <!-- Benutzerinfo-Box -->
        <div
            class="absolute top-[4%] right-[2%] pt-[1.5%] px-[3%] pb-[1.5%] max-h-[40%] max-w-[30%] rounded-[4%] bg-black/50 backdrop-blur-sm text-white infoFontSize font-medium shadow-lg space-y-[3%]">
          <p><span class="font-semibold text-blue-300"> Benutzername: </span> {{ user?.username }} </p>
          <p><span class="font-semibold text-blue-300"> Rang: </span> {{ user?.rank }} </p>
          <p><span class="font-semibold text-blue-300"> Punkte: </span> {{ user?.points }} </p>
          <p><span class="font-semibold text-blue-300"> Kristalle:</span> {{ user?.crystals }} </p>
        </div>

        <!-- Trainings-Button -->
        <div class="flex justify-center items-center h-full">
          <button
              class="h-[8%] w-[12%] bg-blue-500 text-white font-bold trainingBtnFontSize px-[1.8%] py-[1%] pt-[0.7%] rounded shadow-md hover:brightness-110 transition"
              @click="navigateTo('/training')"
          >
            Training
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.infoFontSize{
    font-size: min(1.641479 * 1.5vh, 1.5vw);
}

.trainingBtnFontSize{
    font-size: min(1.641479 * 2vh, 2vw);
}

.logoutFontSize{
    font-size: min(1.641479 * 0.9vh, 0.9vw);
}

</style>

