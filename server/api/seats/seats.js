import { getSeats } from "../../model/seats";

export default defineEventHandler(async (event) => {
  let result = await getSeats();

  return {
    seats: result[0],
  };
});
