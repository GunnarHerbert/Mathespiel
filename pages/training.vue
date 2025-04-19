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

var errorMessage = ref("");
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
          alt="TrainingImg"
          class="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-xl shadow-lg"
          src="assets/images/Training.jpg"
      />

      <!-- Main-Inhalte -->
      <div class="absolute top-0 left-0 w-full h-full">
        <a href="/main">
          <img src="/assets/images/MainMenuButton.jpg" class="mainMenuBtn" alt="Hauptmenü">
        </a>
<!--        <img-->
<!--            href="/main"-->
<!--            alt="Hauptmenü"-->
<!--            class="max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-xl shadow-lg"-->
<!--            src="/assets/images/MainMenuButton.jpg">-->
        <!--        </NuxtLink>-->
        <div>
          <!--        <div-->
          <!--            :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }"-->
          <!--            class="text-blue-700 text-xl font-bold mt-2">-->
          <!--          + 10 Kristalle!-->
          <!--        </div>-->
          <!--        &lt;!&ndash; Container für die Rechenaufgabe &ndash;&gt;-->
          <!--        <div class="flex justify-center items-center mb-8 w-full" style="height: 250px;">-->
          <!--          <img :src="taskImagePath" alt="Rechenaufgabe" class="max-w-full h-4/5 object-contain"/>-->
          <!--        </div>-->
          <!--        <div>-->
          <!--          &lt;!&ndash; Points-Text mit reserviertem Platz &ndash;&gt;-->
          <!--          <div class="points-text-container">-->
          <!--            <div :class="{-->
          <!--             'text-green-600': pointsDelta > 0,-->
          <!--             'text-red-600': pointsDelta < 0-->
          <!--           }"-->
          <!--                 :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }"-->
          <!--                 class="text-xl font-bold points-text">-->
          <!--              {{ pointsDelta > 0 ? '+' : '' }}{{ pointsDelta }} Punkte!-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          &lt;!&ndash; Fortschrittsbalken &ndash;&gt;-->
          <!--          <div class="progress-container">-->
          <!--            <div :style="{ width: (points / 10000) * 100 + '%' }" class="progress-bar"></div>-->
          <!--          </div>-->

          <!--          &lt;!&ndash; Antwort-Buttons &ndash;&gt;-->
          <!--          <div class="flex gap-x-4">-->
          <!--            <button v-for="(option, index) in answerOptions" :key="index" :class="!isAnswerSent ? 'buttonDefault' :-->
          <!--                  option === correctAnswerLetter ? 'buttonDisabledCorrect' :-->
          <!--                  option === userAnswerLetter ? 'buttonDisabledFalse' :-->
          <!--                  'buttonDisabledDefault'"-->
          <!--                    :disabled="isAnswerSent"-->
          <!--                    class="text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"-->
          <!--                    @click="sendAnswer(option)">-->
          <!--              {{ option }}-->
          <!--            </button>-->
          <!--          </div>-->

          <!--          &lt;!&ndash; Next Task Button &ndash;&gt;-->
          <!--          <button class="mt-2 buttonDefault text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"-->
          <!--                  @click="nextTask">-->
          <!--            Nächste Aufgabe-->
          <!--          </button>-->

          <!--          &lt;!&ndash; Show Solution Button &ndash;&gt;-->
          <!--          <button :class="isAnswerSent ? 'buttonDefault' : 'buttonDisabledDefault'"-->
          <!--                  :disabled="!isAnswerSent"-->
          <!--                  class="mt-2 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-200"-->
          <!--                  @click="toggleSolutionTask">-->
          <!--            {{ showSolution ? 'Aufgabe' : 'Lösung' }} anzeigen-->
          <!--          </button>-->
          <!--        </div>-->
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.mainMenuBtn {
  position: absolute;
  right: 4%;
  /* Abstand oben = 10% der Elternhöhe */
  top: 4%;

  /* Größe relativ zur Eltern-Größe (z. B. 20% Breite & 10% Höhe) */
  width: 11%;
  /* Optionales Styling */
  background-color: transparent; /* Tailwind's blue-500 */
}
</style>


<!--<style scoped>-->
<!--.progress-container {-->
<!--  margin-bottom: 20px;-->
<!--  width: 60%; /* Breiter machen */-->
<!--  min-width: 500px;-->
<!--  max-width: 800px; /* Begrenzung für große Bildschirme */-->
<!--  height: 20px;-->
<!--  background-color: #ddd;-->
<!--  border-radius: 10px;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.progress-bar {-->
<!--  height: 100%;-->
<!--  background-color: #4caf50;-->
<!--  transition: width 0.3s ease-in-out;-->
<!--}-->

<!--.points-text {-->
<!--  min-height: 30px; /* Fester Platz für den Text */-->
<!--}-->

<!--/* Optional: Stil für die Buttons */-->
<!--button {-->
<!--  font-size: 1.25rem;-->
<!--  padding: 1rem 2rem;-->
<!--  border-radius: 0.375rem;-->
<!--}-->

<!--.buttonDefault {-->
<!--  &#45;&#45;tw-bg-opacity: 1;-->
<!--  background-color: rgb(249 115 22 / var(&#45;&#45;tw-bg-opacity, 1));-->
<!--}-->

<!--.buttonDefault:hover {-->
<!--  &#45;&#45;tw-bg-opacity: 1 !important;-->
<!--  background-color: rgb(245 158 11 / var(&#45;&#45;tw-bg-opacity, 1)) !important;-->
<!--}-->

<!--.buttonDisabledDefault {-->
<!--  background-color: rgb(155, 50, 4);-->
<!--}-->

<!--.buttonDisabledCorrect {-->
<!--  background-color: rgb(1, 68, 1) !important;-->
<!--}-->

<!--.buttonDisabledFalse {-->
<!--  background-color: rgb(86, 2, 2);-->
<!--}-->
<!--</style>-->
