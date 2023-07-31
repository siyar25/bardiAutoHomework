import { resetDatabase } from "../../model/database";

export default defineEventHandler(async (event) => {
  
  const res = await resetDatabase();

  return {
    message: "Table reset successful."
  };
});
