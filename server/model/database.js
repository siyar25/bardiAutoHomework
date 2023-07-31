import pool from "../db";

export async function setupDatabase() {
  try {
    await createSeatsTable();

    await populateSeatsTable();

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
}

async function createSeatsTable() {
  try {
    const dropTableQuery = `DROP TABLE IF EXISTS seats`;
    await pool.promise().query(dropTableQuery);

    const createTableQuery = `
          CREATE TABLE seats (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
            seat_number INT NOT NULL UNIQUE,
            status ENUM('szabad', 'foglalt', 'elkelt') DEFAULT 'szabad',
            is_locked TINYINT DEFAULT 1,
            reservation_time DATETIME DEFAULT NULL
          );
        `;

    await pool.promise().query(createTableQuery);
    console.log("Table 'seats' dropped (if existed) and recreated.");
  } catch (error) {
    console.error("Error creating 'seats' table:", error);
  }
}

async function populateSeatsTable() {
  try {
    const checkIfDataExistsQuery = "SELECT COUNT(*) AS count FROM seats";
    const [result] = await pool.promise().query(checkIfDataExistsQuery);
    const hasData = result[0].count > 0;

    if (!hasData) {
      const populateQuery = `
            INSERT INTO seats (seat_number, status, is_locked)
            VALUES
              ${getSeatValues(1, 23, "elkelt", 1)},
              ${getSeatValues(24, 25, "szabad", 0)}
          `;

      await pool.promise().query(populateQuery);
      console.log("Seats table populated with initial data.");
    } else {
      console.log("Seats table already contains data. Skipping population.");
    }
  } catch (error) {
    console.error("Error populating 'seats' table:", error);
  }
}

function getSeatValues(startSeatNumber, endSeatNumber, status, isLocked) {
  const seatValues = [];
  for (
    let seatNumber = startSeatNumber;
    seatNumber <= endSeatNumber;
    seatNumber++
  ) {
    seatValues.push(`(${seatNumber}, '${status}', ${isLocked})`);
  }
  return seatValues.join(",");
}

export async function resetDatabase() {
  try {
    const resetTableQuery =
      "UPDATE seats SET status = 'szabad', is_locked = 0, reservation_time = null WHERE id IN (24, 25)";

    await pool.promise().query(resetTableQuery);
    console.log("Table reset successful.");
  } catch (error) {
    console.error("Error during resetting the table: ", error);
  }
}
