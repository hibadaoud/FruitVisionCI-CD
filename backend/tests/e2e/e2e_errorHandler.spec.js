const httpMocks = require("node-mocks-http"); // A library to mock HTTP requests/responses
const errorHandler = require("../../middleware/errorHandler"); // Path to your error handler
const { constants } = require("../../constants");

describe("Error Handler Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest(); // Create a mock request
        res = httpMocks.createResponse(); // Create a mock response
        next = jest.fn(); // Mock next function
    });

    it("should handle validation errors", () => {
        const error = new Error("Validation error occurred");
        res.statusCode = constants.VALIDATION_ERROR; // Set the status code

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(constants.VALIDATION_ERROR);
        expect(res._getJSONData()).toEqual({
            title: "Validation Failed",
            message: "Validation error occurred",
            stackTrace: error.stack,
        });
    });

    it("should handle not found errors", () => {
        const error = new Error("Resource not found");
        res.statusCode = constants.NOT_FOUND;

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(constants.NOT_FOUND);
        expect(res._getJSONData()).toEqual({
            title: "Not Found",
            message: "Resource not found",
            stackTrace: error.stack,
        });
    });

    it("should handle unauthorized errors", () => {
        const error = new Error("Resource Unauthorized");
        res.statusCode = constants.UNAUTHORIZED;

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(constants.UNAUTHORIZED);
        expect(res._getJSONData()).toEqual({
            title: "Unauthorized",
            message: "Resource Unauthorized",
            stackTrace: error.stack,
        });
    });

    it("should handle forbidden errors", () => {
        const error = new Error("Resource Forbidden");
        res.statusCode = constants.FORBIDDEN;

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(constants.FORBIDDEN);
        expect(res._getJSONData()).toEqual({
            title: "Forbidden",
            message: "Resource Forbidden",
            stackTrace: error.stack,
        });
    });

    it("should handle server errors", () => {
        const error = new Error("Server error occurred");
        res.statusCode = 500; // Setting to default server error code

        errorHandler(error, req, res, next);

        expect(res.statusCode).toBe(constants.SERVER_ERROR);
        expect(res._getJSONData()).toEqual({
            title: "Server Error",
            message: "Server error occurred",
            stackTrace: error.stack,
        });
    });

    
    // it("should handle undefined errors", () => {
    //     const error = new Error("Undefined error occurred");
    //     res.statusCode = 500; // Setting to default server error code

    //     errorHandler(error, req, res, next);

    //     expect(res.statusCode).toBe(500);
    //     expect(res._getJSONData()).toEqual({
    //         title: "Undefined Error",
    //         message: "Undefined error occurred",
    //         stackTrace: error.stack,
    //     });
    // });
   
    
    // Add more tests for other error types if necessary

});
