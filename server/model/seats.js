import pool from "../db";

export async function getSeats() {
  try {
    const query = "SELECT * FROM seats;";
    let res = pool.promise().query(query);
    return res;
  } catch (error) {
    console.error("No seats found:", error);
  }
}

export async function reserveSeats(seats) {
  try {
    if (seats.length === 0) {
      throw new Error("No seats provided to update.");
    }

    const query = `UPDATE seats SET status = 'foglalt', is_locked = 1 WHERE id IN (${seats.join(
      ","
    )})`;

    await pool.promise().query(query);
    console.log("Seats status updated successfully!");
  } catch (error) {
    console.error("Error updating seats' status:", error);
  }
}

export async function sendPayment(seats) {
  try {
    if (seats.length === 0) {
      throw new Error("No seats provided to update.");
    }

    const query = `UPDATE seats SET status = 'elkelt' WHERE id IN (${seats.join(
      ","
    )})`;

    await pool.promise().query(query);
    console.log("Seats' status updated successfully!");
  } catch (error) {
    console.error("Error updating seats' status:", error);
  }
}

export async function releaseReservation(seats) {
  try {
    if (seats.length === 0) {
      throw new Error("No seats provided to update.");
    }

    const query = `UPDATE seats SET status = 'szabad', is_locked = 0 WHERE id IN (${seats.join(
      ","
    )});`;

    await pool.promise().query(query);
    console.log("Seats released due to time expiration.");
  } catch (error) {
    console.error("Error updating seats' status:", error);
  }
}
