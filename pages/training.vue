<script setup>
const answerOptions = ['A', 'B', 'C', 'D', 'E'];

const sendAnswer = (answer) => {
  console.log('Ausgewählte Antwort:', answer);
  //TODO
};
</script>

<template>
  <button @click="navigateTo('/main')" class="absolute top-5 right-3 text-lg text-gray-700">Hauptmenü</button>
  <div class="flex flex-col justify-center items-center h-screen p-4 bg-gray-100">
    <!-- Container für die Rechenaufgabe -->
    <div class="flex justify-center items-center mb-8">
      <img src="assets/tasks/56/a56l0504.gif" alt="Rechenaufgabe" class="max-w-full h-auto"/>
    </div>
    <br>
    <!-- Buttons A bis E in einer Reihe -->
    <div class="flex gap-x-4">
      <button v-for="(option, index) in answerOptions" :key="index" @click="sendAnswer(option)"
              class="bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-200">
        {{ option }}
      </button>
    </div>
  </div>
</template>


<style scoped>
/* Optional: Stil für den Container und Buttons */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

button {
  font-size: 1.25rem;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
}

button:hover {
  background-color: #c53030;
}
</style>
