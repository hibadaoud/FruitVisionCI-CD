const { getHistories, createHistory } = require('../../controllers/historyController');
const History = require('../../models/historyModel');
const { validationResult } = require('express-validator');

jest.mock('../../models/historyModel');
jest.mock('express-validator');

let req, res, next;
beforeEach(() => {	
  res = {
    send: jest.fn(),
    status: jest.fn(() => res),  // Mock chaining .status()
    json: jest.fn(), // Mock json response
  };
  next = jest.fn(); // Mock next() to catch errors
  validationResult.mockReturnValue({ 
	isEmpty: jest.fn(() => true),
	array: jest.fn() 
  }); // Default: no validation errors
 
});

afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

describe('testing getHistories controller', () => {
  req ={};
  it('should respond with status 200 and list of histories', async () => {
    const mockHistories = [
      { type: 'type1', resultText: 'result1', full_url: 'http://example1.com' },
      { type: 'type2', resultText: 'result2', full_url: 'http://example2.com' },
    ];
    History.find.mockResolvedValue(mockHistories);

    await getHistories(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHistories);
    expect(next).not.toHaveBeenCalled();
  });	

  it('should handle errors and pass them to next()', async () => {
    const mockError = new Error('Database Error');
    History.find.mockRejectedValue(mockError);

    await getHistories(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError); // Error is passed to errorHandler
  });
});

describe("create history", () => {
	req = {
		body: { type: 'type1', resultText: 'result1', full_url: 'http://example.com' }, // Mock request body
	};
 	it("should return status of 400 when there are errors and pass it to next()", async () => {
		//change teh content of validation result
		const mockValidationErrors = [{ msg: 'Invalid field' }];
		validationResult.mockReturnValueOnce({
			isEmpty: jest.fn(() => false),
			array: jest.fn(() => mockValidationErrors),
		});
		console.log = jest.fn();
		await createHistory(req, res, next);
		expect(validationResult).toHaveBeenCalledWith(req);
		expect(console.log).toHaveBeenCalledWith("Validation errors:",mockValidationErrors);
		expect(res.status).toHaveBeenCalledWith(400);
		const mockError = new Error("You should respect the specifications !");
		expect(res.json).not.toHaveBeenCalled(); // Since it's throwing an error
		expect(next).toHaveBeenCalledWith(mockError); // Error is passed to errorHandler

	});

	it("should return status of 201 and the history is created", async () => {

		const mockHistory = { id: '123', type: 'type1', resultText: 'result1', full_url: 'http://example.com' };
        History.create.mockResolvedValueOnce(mockHistory);

		await createHistory(req, res, next);
		
		expect(validationResult).toHaveBeenCalledWith(req);
        expect(History.create).toHaveBeenCalledWith({
			type: 'type1',
			resultText: 'result1',
			full_url: 'http://example.com',
		});
		expect(res.status).toHaveBeenCalledWith(201);
	    expect(res.json).toHaveBeenCalledWith(mockHistory);
		expect(next).not.toHaveBeenCalled();

	});
});