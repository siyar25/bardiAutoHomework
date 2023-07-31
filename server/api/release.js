import { releaseReservation } from "../model/seats";

export default defineEventHandler(async (event) => {
  const { seats } = await readBody(event);
  await releaseReservation(seats);

  return {
    message: `${
      seats.length > 1
        ? "Seats released due to time expiration."
        : "Seat released due to time expiration."
    }`,
  };
});
