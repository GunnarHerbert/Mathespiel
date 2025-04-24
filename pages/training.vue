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
      <div class="mainContainer absolute top-0 left-0 w-full h-full">
        <a href="/main">
          <img alt="Hauptmenü" class="mainMenuBtn" src="/assets/images/MainMenuButton.jpg">
        </a>
        <div
            :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }"
            class="crystalText">
          + 10 Kristalle!
        </div>
        <!-- Rechenaufgabe bzw SolutionImage -->
        <img :src="taskImagePath" alt="Rechenaufgabe" class="taskImg"/>
        <!-- Points-Text mit reserviertem Platz -->
        <div class="points-text-container">
          <div :class="{
                       'text-green-600': pointsDelta > 0,
                       'text-red-600': pointsDelta < 0
                     }"
               :style="{ visibility: showPointsDelta ? 'visible' : 'hidden' }"
               class="pointsTxt">
            {{ pointsDelta > 0 ? '+' : '' }}{{ pointsDelta }} Punkte!
          </div>
        </div>
        <!-- Fortschrittsbalken -->
        <div
            :style="{ width: (points / 10000) * 57.6 + '%' }" class="progress-bar"
        ></div>

        <!-- Antwort-Buttons -->
<!--        <div class="absolute top-[82%] left-[39%] flex gap-x-[8%] bg-purple-600">-->
<!--          <button v-for="(option, index) in answerOptions" :key="index" :class="!isAnswerSent ? 'buttonDefault' :-->
<!--                          option === correctAnswerLetter ? 'buttonDisabledCorrect' :-->
<!--                          option === userAnswerLetter ? 'buttonDisabledFalse' :-->
<!--                          'buttonDisabledDefault'"-->
<!--                  :disabled="isAnswerSent"-->
<!--                  class="w-[300%] text-white text-lg rounded-lg shadow-md transition duration-200"-->
<!--                  @click="sendAnswer(option)">-->
<!--            {{ option }}-->
<!--          </button>-->
<!--        </div>-->
<!--        <client-only>-->
          <button class="absolute top-[80%] left-[80%] w-10 h-auto bg-purple-600">test</button>
<!--        </client-only>-->
        <!-- Next Task Button -->
<!--        <button-->
<!--            class="absolute top-[82%] left-[83.5%] w-[10.5%] buttonDefault text-white text-sm rounded-lg shadow-md transition duration-200-->
<!--         whitespace-nowrap truncate-->
<!--         flex items-center justify-center text-center font-light"-->
<!--            @click="nextTask"-->
<!--        >-->
<!--          Nächste Aufgabe-->
<!--        </button>-->

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
</template>


<style scoped>
.mainMenuBtn {
  position: absolute;
  right: 4%;
  top: 4%;
  width: 11%;
  background-color: transparent;
}

.crystalText {
  position: absolute;
  top: 15%;
  left: 50%;
  font-weight: 700;
  font-size: min(1.641479 * 3vh, 3vw);
  line-height: min(1.641479 * 2vh, 2vw);
  color: rgb(29, 78, 216, 1);
}

.taskImg {
  position: absolute;
  top: 26.5%;
  left: 39.5%;
  width: 54%;
  height: auto;
  border-radius: min(1.641479 * 0.5vh, 0.5vw);
}

.pointsTxt {
  position: absolute;
  top: 84%;
  left: 71%;
  font-weight: 400;
  font-size: min(1.641479 * 2vh, 2vw);
  line-height: min(1.641479 * 2vh, 2vw);
}

.progress-bar {
  position: absolute;
  top: 91.1%;
  left: 39.05%;
  height: 4.1%;
  border-radius: min(1.641479 * 0.5vh, 0.5vw);
  background-color: #4caf50;
  transition: width 0.3s ease-in-out;
}

/* Stil für die Buttons */
.answerButton {
  font-size: 1.25rem;
  /*width: 60%;*/
  /*padding: 15% 25%;*/
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
<!--</style>-->
