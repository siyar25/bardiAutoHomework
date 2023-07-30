import pool from "../db/index";

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

    const reservedSeats = await checkAvailability(seats);

    if (reservedSeats.length > 0) {
      console.log("The following seats are already reserved:", reservedSeats);
      return reservedSeats;
    } else {
      const query = `UPDATE seats SET status = 'foglalt', is_locked = 1 WHERE id IN (${seats.join(
        ","
      )})`;

      await pool.promise().query(query);
      console.log("Seats status updated successfully!");
      return reservedSeats;
    }
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

async function checkAvailability(seats) {
  try {
    if (seats.length === 0) {
      throw new Error("No seats provided to check availability.");
    }

    const query = `SELECT id, status FROM seats WHERE id IN (${seats.join(
      ","
    )})`;

    const [rows] = await pool.promise().query(query);

    const reservedSeats = rows
      .filter((seat) => seat.status === "foglalt")
      .map((seat) => seat.id);

    return reservedSeats;
  } catch (error) {
    console.error("Error checking seat availability:", error);
  }
}
