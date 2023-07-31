import {
  getSeats,
  reserveSeats,
  sendPayment,
  releaseReservation,
} from "../../../server/model/seats";
import pool from "../../../server/db/index";

jest.mock("../../../server/db/index");

afterEach(() => {
  jest.clearAllMocks();
});

describe("getSeats", () => {
  it("should return seats from the database", async () => {
    const mockQueryResult = [
      { id: 1, status: "szabad" },
      { id: 2, status: "foglalt" },
    ];
    pool.query.mockResolvedValue([mockQueryResult]);

    const seats = await getSeats();

    expect(seats[0]).toEqual(mockQueryResult);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM seats;");
  });
});

describe("reserveSeats", () => {
  it("should update seats' status and return an empty array for successful reservation", async () => {
    const seatsToReserve = [1];

    pool.query.mockResolvedValue([seatsToReserve]);

    const result = await reserveSeats(seatsToReserve);

    expect(result).toEqual([]);
  });

  it("should return reserved seats if seats are already reserved", async () => {
    const seatsToReserve = [1, 2];
    const mockQueryResult = [
      { id: 1, status: "szabad" },
      { id: 2, status: "foglalt" },
    ];
    pool.query.mockResolvedValue([mockQueryResult]);

    const result = await reserveSeats(seatsToReserve);

    expect(result).toEqual([2]);
  });

  it("should handle an error if no seats are provided", async () => {
    console.error = jest.fn();

    const result = await reserveSeats([]);

    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "Error updating seats' status:",
      new Error("No seats provided to update.")
    );
  });
});

describe("sendPayment", () => {
  it("should update seats' status for successful payment", async () => {
    const seatsToPay = [1, 2];

    await sendPayment(seatsToPay);

    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE seats SET status = 'elkelt' WHERE id IN (1,2)`
    );
  });

  it("should handle an error if no seats are provided", async () => {
    console.error = jest.fn();

    await sendPayment([]);

    expect(console.error).toHaveBeenCalledWith(
      "Error updating seats' status:",
      new Error("No seats provided to update.")
    );
  });
});

describe("releaseReservation", () => {
  it("should release seats and return the appropriate message", async () => {
    const seatsToRelease = [1, 2];

    const result = await releaseReservation(seatsToRelease);

    expect(pool.query).toHaveBeenCalledWith(
      `UPDATE seats SET status = 'szabad', is_locked = 0, reservation_time = null WHERE id IN (1,2);`
    );
    expect(result).toEqual("Seats released due to time expiration.");
  });

  it("should handle an error if no seats are provided", async () => {
    console.error = jest.fn();

    await releaseReservation([]);

    expect(console.error).toHaveBeenCalledWith(
      "Error updating seats' status:",
      new Error("No seats provided to update.")
    );
  });
});
