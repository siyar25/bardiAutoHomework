import { reserveSeats } from "../model/seats";

export default defineEventHandler(async (event) => {
  const { seats } = await readBody(event);
  const reservedSeats = await reserveSeats(seats);
  const isReserved = reservedSeats.length > 0;

  return {
    isReserved: isReserved,
    reservedSeats: reservedSeats
  };
});
