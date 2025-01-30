<script setup lang="ts">
const {loggedIn, user, clear, fetch: fetchSession} = useUserSession();

function logout() {
  clear();
  navigateTo("/login");
}
</script>

<template>
  <div class="flex flex-row min-h-screen justify-center items-center">
    <div class="relative h-[85vh] w-10/12 bg-gray-200 rounded-xl">
      <button @click="logout()" class="absolute left-3">Abmelden</button>
      <div class="absolute top-5 right-3 m-4 text-lg font-bold text-gray-700">
        Benutzername: {{ user?.username }} <br> Punkte: 42
      </div>
      <div class="flex justify-center items-center h-full">
        <button @click="navigateTo('/training')" class="bg-blue-500 text-red font-bold px-6 py-4 text-2xl rounded-lg shadow-md">
          Training
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
