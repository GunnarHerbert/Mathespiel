<script setup>
const answerOptions = ['A', 'B', 'C', 'D', 'E'];
const {user} = useUserSession();
const taskImagePath = ref("");
const isAnswerSent = ref(false);
const showSolution = ref(false);
const userAnswerLetter = ref("");
const correctAnswerLetter = ref("");
const pointsDelta = ref(null);
const showPointsDelta = ref(false);
const points = ref(0);

onload();

function onload() {
  if (user.value.isCurrentTaskSolved === 1) {
    showSolution.value = true;
    isAnswerSent.value = true;
  }
  points.value = user.value.points;
  taskImagePath.value = `/api/training?action=loadImage&sol=${showSolution.value}`;
}

const toggleSolutionTask = () => {
  showSolution.value = !showSolution.value;
  taskImagePath.value = `/api/training?action=loadImage&sol=${showSolution.value}&t=${Date.now()}`;
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
  taskImagePath.value = `/api/training?action=loadImage&sol=${showSolution.value}&t=${Date.now()}`;
  correctAnswerLetter.value = validateAnswerQuery.correctAnswer;
  pointsDelta.value = validateAnswerQuery.pointsDelta;
  showPointsDelta.value = true;
  points.value = validateAnswerQuery.newPoints;
  //TODO: use new rank and points from response to display them (reachable in user.value)
};

const nextTask = async () => {
  userAnswerLetter.value = '';
  correctAnswerLetter.value = '';
  showPointsDelta.value = false;
  await $fetch('/api/training?action=nextTask', {
    method: 'GET',
  });
  showSolution.value = false;
  taskImagePath.value = `/api/training?action=loadImage&sol=${showSolution.value}&t=${Date.now()}`;
  isAnswerSent.value = false;
};
</script>

<template>
  <button @click="navigateTo('/main')"
          class="absolute top-5 right-3 text-lg text-gray-700 buttonDefault">Hauptmenü
  </button>
  <div class="flex flex-col justify-center items-center h-screen p-4 bg-gray-100">
    <div
        class="text-blue-700 text-xl font-bold mt-2"
        :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }">
      + 10 Kristalle!
    </div>
    <!-- Container für die Rechenaufgabe -->
    <div class="flex justify-center items-center mb-8 w-full" style="height: 250px;">
      <img :src="taskImagePath" alt="Rechenaufgabe" class="max-w-full h-4/5 object-contain"/>
    </div>
    <div>
      <!-- Points-Text mit reserviertem Platz -->
      <div class="points-text-container">
        <div :class="{
             'text-green-600': pointsDelta > 0,
             'text-red-600': pointsDelta < 0
           }"
             class="text-xl font-bold points-text"
             :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }">
          {{ pointsDelta > 0 ? '+' : '' }}{{ pointsDelta }} Punkte!
        </div>
      </div>

      <!-- Fortschrittsbalken -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: (points / 10000) * 100 + '%' }"></div>
      </div>

      <!-- Antwort-Buttons -->
      <div class="flex gap-x-4">
        <button v-for="(option, index) in answerOptions" :key="index" @click="sendAnswer(option)"
                :disabled="isAnswerSent"
                class="text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"
                :class="!isAnswerSent ? 'buttonDefault' :
                  option === correctAnswerLetter ? 'buttonDisabledCorrect' :
                  option === userAnswerLetter ? 'buttonDisabledFalse' :
                  'buttonDisabledDefault'">
          {{ option }}
        </button>
      </div>

      <!-- Next Task Button -->
      <button @click="nextTask"
              class="mt-2 buttonDefault text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200">
        Nächste Aufgabe
      </button>

      <!-- Show Solution Button -->
      <button @click="toggleSolutionTask"
              class="mt-2 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"
              :disabled="!isAnswerSent"
              :class="isAnswerSent ? 'buttonDefault' : 'buttonDisabledDefault'">
        {{ showSolution ? 'Aufgabe' : 'Lösung' }} anzeigen
      </button>
    </div>
  </div>
</template>


<style scoped>
.progress-container {
  margin-bottom: 20px;
  width: 60%; /* Breiter machen */
  min-width: 500px;
  max-width: 800px; /* Begrenzung für große Bildschirme */
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease-in-out;
}

.points-text {
  min-height: 30px; /* Fester Platz für den Text */
}

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
