const request = require('supertest')
const app = require('../index')

describe(`GET /busSchedules`, () => {
  it('it gets list of all BusSchedules', async () => {
    const res = await request(app)
      .get(`/busSchedules`)
      .send()
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Successful');
  })
})

describe("POST/busSchedules", () => {
  it("should create a BusSchedule", async () => {
    const res = await request(app).post(`/busSchedules`).send({
      TravelsName: "Primo",
      type: "AC",
      fare: 1300,
      isAvailable: true,
      journeyDate: "23-04-2023",
      origin: "Hyderabad",
      destination: "Banglore",
      arrivalTime: "10:00 PM",
      departureTime: "8:00 AM",
      busNumber: "TS09FD4586",
      seatsAvailability: 30
    });
    console.log("ress===",res)
    expect(res.body.success).toBe(true);
  });
});

describe("PUT/busSchedules/:id", () => {
  it("should update a bus Schedule", async () => {
    const res = await request(app)
      .patch('/busSchedules/6445757df1fc55b1ccbe7a50')
      .send({
        TravelsName: "Primo",
        type: "AC",
        fare: 1500,
        isAvailable: true,
      });
    expect(res.body.success).toBe(true);
    expect(res.body.data.fare).toBe(104);
  });
});

describe("DELETE/busSchedules/:id", () => {
  it("should delete a busSchedule", async () => {
    const res = await request(app).delete(`/busSchedules/643d1bd7a1fee8b04cdc6316`);
    expect(res.body.success).toBe(true);
  });
});