<script setup>
const answerOptions = ['A', 'B', 'C', 'D', 'E'];
const showSolution = ref(false);
const taskImagePath = computed(() => `/api/training?action=loadImage&sol=${showSolution.value}&t=${Date.now()}`);
const isAnswerSent = ref(false);
const correctAnswerLetter = ref("");
const userAnswerLetter = ref("");

//TODO: check if task is already solved by user. If yes, show solution and disable buttons

const toggleSolutionTask = () => {
  showSolution.value = !showSolution.value;
  if (showSolution.value) {
    console.log('Lösung anzeigen');
  } else {
    console.log('Aufgabe anzeigen');
  }
};

const sendAnswer = async (answer) => {
  console.log('Ausgewählte Antwort:', answer);
  isAnswerSent.value = true;
  userAnswerLetter.value = answer;
  showSolution.value = true;
  const validateAnswerQuery = await $fetch('/api/training', {
    method: 'POST',
    body: {
      action: 'validateUserAnswer',
      userAnswer: userAnswerLetter.value,
    }
  });
  correctAnswerLetter.value = validateAnswerQuery.correctAnswer;
};

const nextTask = async () => {
  userAnswerLetter.value = '';
  correctAnswerLetter.value = '';
  await $fetch('/api/training?action=nextTask', {
    method: 'GET',
  });
  //trigger computed value taskImagePath to load new image
  showSolution.value = !showSolution.value;
  if (showSolution.value) {
    showSolution.value = false;
  }
  isAnswerSent.value = false;
};
</script>

<template>
  <button @click="navigateTo('/main')"
          class="absolute top-5 right-3 text-lg text-gray-700 buttonDefault">Hauptmenü
  </button>
  <div class="flex flex-col justify-center items-center h-screen p-4 bg-gray-100">
    <!-- Container für die Rechenaufgabe -->
    <div class="flex justify-center items-center mb-8">
      <img :src="taskImagePath" alt="Rechenaufgabe" class="max-w-full h-auto"/>
    </div>
    <br>
    <!-- Buttons A bis E in einer Reihe -->
    <div class="flex gap-x-4">
      <button v-for="(option, index) in answerOptions" :key="index" @click="sendAnswer(option)" :disabled="isAnswerSent"
              class="text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"
              :class="!isAnswerSent ? 'buttonDefault' :
                      option === correctAnswerLetter ? 'buttonDisabledCorrect' :
                      option === userAnswerLetter ? 'buttonDisabledFalse' :
                      'buttonDisabledDefault'">
        {{ option }}
      </button>
    </div>
    <button @click="toggleSolutionTask"
            class="mt-2 buttonDefault text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200">
      {{ showSolution ? 'Aufgabe' : 'Lösung' }} anzeigen
    </button>
    <button @click="nextTask"
            class="mt-2 buttonDefault text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200">
      Nächste Aufgabe
    </button>
  </div>
</template>


<style scoped>
/* Optional: Stil für die Buttons */
button {
  font-size: 1.25rem;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
}

.buttonDefault {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
}

.buttonDefault:hover {
  --tw-bg-opacity: 1 !important;
  background-color: rgb(245 158 11 / var(--tw-bg-opacity, 1)) !important;
}

.buttonDisabledDefault {
  background-color: rgb(155, 50, 4);
}

.buttonDisabledCorrect {
  background-color: rgb(1, 68, 1) !important;
}

.buttonDisabledFalse {
  background-color: rgb(86, 2, 2);
}
</style>
