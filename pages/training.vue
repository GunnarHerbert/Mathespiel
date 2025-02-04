<script setup>
const answerOptions = ['A', 'B', 'C', 'D', 'E'];
const showSolution = ref(false);

const toggleSolutionTask = () => {
  showSolution.value = !showSolution.value;
  if (showSolution.value) {
    console.log('Lösung anzeigen');
  } else {
    console.log('Aufgabe anzeigen');
  }
  //TODO
};

const sendAnswer = (answer) => {
  console.log('Ausgewählte Antwort:', answer);
  //TODO
};

const nextTask = () => {
  console.log('Nächste Aufgabe');
  //TODO
};
</script>

<template>
  <button @click="navigateTo('/main')"
          class="absolute top-5 right-3 bg-amber-600 text-lg text-gray-700 hover:!bg-amber-500">Hauptmenü
  </button>
  <div class="flex flex-col justify-center items-center h-screen p-4 bg-gray-100">
    <!-- Container für die Rechenaufgabe -->
    <div class="flex justify-center items-center mb-8">
      <img src="assets/tasks/56/560000.gif" alt="Rechenaufgabe" class="max-w-full h-auto"/>
    </div>
    <br>
    <!-- Buttons A bis E in einer Reihe -->
    <div class="flex gap-x-4">
      <button v-for="(option, index) in answerOptions" :key="index" @click="sendAnswer(option)"
              class="bg-orange-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:!bg-orange-600 transition duration-200">
        {{ option }}
      </button>
    </div>
    <button @click="toggleSolutionTask" class="mt-2 bg-orange-500 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200">
      {{ showSolution ? 'Aufgabe' : 'Lösung' }} anzeigen
    </button>
    <button @click="nextTask" class="mt-2 bg-orange-500 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200">
      Nächste Aufgabe
    </button>
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
  background-color: rgb(234, 88, 12);
}
</style>
