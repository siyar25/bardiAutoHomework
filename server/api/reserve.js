import { reserveSeats } from "../model/seats";

export default defineEventHandler(async (event) => {
  const { seats } = await readBody(event);
  await reserveSeats(seats);

  return {
    message: `${
      seats.length > 1
        ? "Seats reserved successfully!"
        : "Seat reserved successfully!"
    }`,
  };
});
