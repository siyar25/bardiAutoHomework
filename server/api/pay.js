import { sendPayment } from "../model/seats";

export default defineEventHandler(async (event) => {
  const { seats } = await readBody(event);
  await sendPayment(seats);

  return {
    message: `Successful payment!`,
  };
});
