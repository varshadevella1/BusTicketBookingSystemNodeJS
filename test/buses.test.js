const request = require('supertest')
const app = require('../index')
let baseUrl = "http://localhost:2000"

// let email = "varsha.devalla@gmail.com";
// let password = "varsha@1";

// beforeAll(async()=>{
//     jest.setTimeout(200000)
//     let url =`${baseUrl}`/login;
//     const res = await request(app)
//     .post(url)
//     .send({'email':`${email}`,'password':`${password}`})
//     .set('accept','application/json')
//     .expect(200)
//     // let body = res.body;
//     // token = body.data
// })

describe('GET', () => {
    test('it gets list of all BusSchedules', async () => {
        let url = `${baseUrl}/busSchedules`;
        const res = await request(app).get(url)
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        // expect(res.body.length).toBeGreaterThan(0);
    })
})

describe("POST", () => {
    test("should create a BusSchedule", async () => {
    let url = `${baseUrl}/busSchedules`;
      const res = await request(app).post(url).send({
        TravelsName:"Primo",
        type:"AC",
        fare:1300,
        isAvailable:true,
        journeyDate:"23-04-2023",
        origin:"Hyderabad",
        destination:"Banglore",
        arrivalTime:"10:00 PM",
        departureTime:"8:00 AM",
        busNumber:"TS09FD4586",
        seatsAvailability:30
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Product 2");
    });
  });
  
  describe("PUT /api/products/:id", () => {
    test("should update a bus Schedule", async () => {
    const url = `${baseUrl}/busSchedules/643d1bd7a1fee8b04cdc6316`
      const res = await request(app)
        .patch(url)
        .send({
            TravelsName:"Primo",
            type:"AC",
            fare:1500,
            isAvailable:true,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.fare).toBe(104);
    });
  });
  
  describe("DELETE", () => {
    test("should delete a busSchedule", async () => {
      const url = `${baseUrl}/busSchedules/643d1bd7a1fee8b04cdc6316`
      const res = await request(app).delete(url);
      expect(res.statusCode).toBe(200);
    });
  });