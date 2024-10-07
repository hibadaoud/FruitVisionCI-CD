const request = require("supertest");
const mongoose = require("mongoose");
const History = require("../../models/historyModel");
const createApp = require("../../createApp");

describe("Integration testing", () => {
	let app;
	beforeAll(() => {
		mongoose
            .connect("mongodb://mongo:supspace1@localhost:27018/", {dbName: "FruitVision-Test-Database"}) 
			.then(() => console.log("Connected to Test Database"))
			.catch((err) => console.log(`Error: ${err}`));

		app = createApp();
	});

    it("should get all the histories", async () => {
		const response = await request(app).get("/api/history")
		expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy(); // Expecting an array of histories

	});

	it("should create the history", async () => {
		const response = await request(app).post("/api/history").send({
			type: "Mango",
			resultText: "5",
			full_url: "http://test.com",
		});
		expect(response.statusCode).toBe(201);
	});

    it("should return 400 for invalid input", async () => {
        const response = await request(app).post("/api/history").send({
            type: 5, // Invalid input
            resultText: "5",
            full_url: "http://test.com",
        });

        expect(response.statusCode).toBe(400); // Expecting a 400 status code
        expect(response.body).toHaveProperty('title', 'Validation Failed'); // Adjust based on your error response
        expect(response.body).toHaveProperty('message', expect.stringContaining("You should respect the specifications !")); // Check for the specific error message
    });

    it("should handle database errors correctly", async () => {
        jest.spyOn(History, 'create').mockRejectedValue(new Error("Database error")); // Mocking a database error

        const response = await request(app).post("/api/history").send({
            type: "Mango",
            resultText: "5",
            full_url: "http://test.com",
        });

        expect(response.statusCode).toBe(500); // Expecting a 500 status code for server error
        expect(response.body).toHaveProperty('title', 'Server Error');
        expect(response.body).toHaveProperty('message', 'Database error');
    });

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
