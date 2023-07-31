export async function fetchSeats() {
  return useFetch("/api/seats/seats");
}

export async function reserveSeats(seats) {
  return useFetch("/api/seats/reserve", {
    method: "POST",
    body: { seats },
  });
}

export async function sendPayment(seats) {
  return useFetch("/api/seats/pay", {
    method: "POST",
    body: { seats },
  });
}

export async function releaseReservation(seats) {
  return useFetch("/api/seats/release", {
    method: "POST",
    body: { seats },
  });
}
