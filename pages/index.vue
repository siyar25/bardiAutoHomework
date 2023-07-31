<template>
  <div v-if="seats" id="cinema-page">
    <h1 id="title">Bárdi Autó Mozi</h1>
    <div id="screen"></div>
    <div id="seats">
      <div v-for="seat in seats.seats" :key="seat.id" class="seat" @click="toggleReservation(seat)">
        <div class="seat-block" :class="seat.status"></div>
        {{ seat.seat_number }} - {{ seat.status }}
      </div>
    </div>
    <button v-if="reservedSeats.length > 0 && !hasReservation.valueOf()" id="reservebtn" @click="handleReservation()">
      Foglalás
    </button>
    <div v-else-if="hasReservation.valueOf()" class="success">
      <div>Sikeres foglalás!</div>
      <div>Fizetéshez kérem írja be az email címét:</div>
      <div class="payment">
        <form @submit="handlePayment()">
          <input type="email" placeholder="johndoe@example.com" @change="(e) => email = e.target.value" />
          <button type="submit">Fizetés</button>
        </form>
        <div class="timer">{{ formatTime(timer) }}</div>
      </div>
    </div>
    <button id="reset-db" @click="resetSeats()">Ülőhelyek visszaállítása</button>
  </div>
  <div v-else>
    <button id="init-db" @click="initDatabase()">Adatbázis inicializálása</button>
  </div>
</template>

<script setup>
import formatTime from "../utils/timeFormatter"
import {
  fetchSeats,
  reserveSeats,
  sendPayment,
  releaseReservation,
} from "../server/services/seatsService"
import {
  setupDatabase,
  resetDatabase
} from "../server/services/dbService"

const { data: seats } = await fetchSeats();
const reservedSeats = ref([]);
const hasReservation = ref(false);
const email = ref();
const timer = ref(120)
let timerInterval;

onMounted(() => {
  const storedSeats = JSON.parse(localStorage.getItem("seats"));
  if (Array.isArray(storedSeats) && storedSeats.length > 0) {
    hasReservation.value = true;
    reservedSeats.value = storedSeats;
    startTimer()
  }
  clearInterval(timerInterval)
});

onUnmounted(() => {
  clearInterval(timerInterval)
})

const toggleReservation = (seat) => {
  if (seat.status === "szabad" && hasReservation.value === false) {
    seat.status = "foglalt";
    reservedSeats.value.push(seat.id);
  } else if (seat.status === "foglalt" && seat.is_locked === 0) {
    seat.status = "szabad";
    reservedSeats.value = reservedSeats.value.filter((id) => id !== seat.id);
  }
};

const handleReservation = async () => {
  const { data: checkedSeats } = await reserveSeats(reservedSeats);

  if (checkedSeats.value.isReserved) {
    alert(`Sajnáljuk, a következő ülőhelyek foglalás alatt állnak: ${checkedSeats.value.reservedSeats} \n Kérem próbálja újra.`)
    reservedSeats.value = [];
    return window.location.reload();
  } else {
    localStorage.setItem("seats", JSON.stringify(reservedSeats.value));
    hasReservation.value = true
    startTimer()
  }
};

const handlePayment = async () => {
  await sendPayment(reservedSeats)
  alert(`Sikeres fizetés!\n Lefoglalt ülőhelyek: ${reservedSeats.value}\n ${email.value} számára.`)
  localStorage.setItem("seats", null);
  hasReservation.value = false;
  reservedSeats.value = [];
  window.location.reload();
}

const startTimer = () => {
  const reservationTime = new Date(reservedSeats.value[0].reservation_time).getTime();
  const currentTime = new Date().getTime();
  const countdownDurationInSeconds = timer.value;
  const remainingTimeInSeconds = Math.max(0, countdownDurationInSeconds - Math.floor((currentTime - reservationTime) / 1000));

  timer.value = remainingTimeInSeconds;

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      releaseReservation(reservedSeats)
      localStorage.setItem("seats", null);
      hasReservation.value = false
      alert("A foglalás a határidő túllépése miatt törölve.")
      window.location.reload();
    }
  }, 1000);
};

const initDatabase = async () => {
  await setupDatabase();
  window.location.reload();
}

const resetSeats = async () => {
  await resetDatabase();
  clearInterval(timerInterval);
  releaseReservation(reservedSeats)
  localStorage.setItem("seats", null);
  hasReservation.value = false
  alert("Ülőhelyek visszaállítva.")
  window.location.reload();
}
</script>

<style scoped>
#cinema-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#title {
  margin-bottom: 4rem;
}

#screen {
  width: 700px;
  height: 100px;
  border: solid 5px #000;
  border-color: #000 transparent transparent transparent;
  border-radius: 50%/100px 100px 0 0;
}

#seats {
  display: flex;
  flex-direction: row;
  width: 500px;
  flex-wrap: wrap;
}

.seat {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.seat-block {
  width: 50%;
  height: 50%;
  cursor: pointer;
}

.elkelt {
  background-color: red;
}

.szabad {
  background-color: green;
}

.foglalt {
  background-color: orange;
}

#reservebtn {
  font-size: large;
  font-weight: bold;
  margin-top: 2rem;
  padding: 1rem 2rem;
  cursor: pointer;
}

.success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  gap: 10px;
  font-size: large;
}

.payment {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.timer {
  font-size: large;
  font-weight: bold;
}

#init-db {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: xx-large;
  font-weight: bold;
  cursor: pointer;
}

#reset-db {
  position: absolute;
  top: 0;
  left: 0;
  margin: 1rem;
  font-size: x-large;
  font-weight: bold;
  cursor: pointer;

}
</style>
