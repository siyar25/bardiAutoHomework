export async function fetchSeats() {
  return useFetch("/api/seats");
}

export async function reserveSeats(seats) {
  return useFetch("/api/reserve", {
    method: "POST",
    body: { seats },
  });
}

export async function sendPayment(seats) {
  return useFetch("/api/pay", {
    method: "POST",
    body: { seats },
  });
}

export async function releaseReservation(seats) {
  return useFetch("/api/release", {
    method: "POST",
    body: { seats },
  });
}
