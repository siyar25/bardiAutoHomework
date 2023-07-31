import { setupDatabase } from "../../model/database";

export default defineEventHandler(async (event) => {
  
  await setupDatabase();

  return {
    message: "Table setup and population successful."
  };
});
