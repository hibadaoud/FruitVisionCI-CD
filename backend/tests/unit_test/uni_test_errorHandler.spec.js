const { constants } = require('../../constants');
const errorHandler = require('../../middleware/errorHandler');

describe('testing Global errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      statusCode: 500, // Default statusCode
      json: jest.fn(), // Mock json response
    };
    next = jest.fn(); // Mock next()
  });

  it('should handle validation error correctly', () => {
    const validationError = new Error('Validation Failed');
    res.statusCode = constants.VALIDATION_ERROR; // Set status to validation error

    errorHandler(validationError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Validation Failed',
      message: 'Validation Failed',
      stackTrace: validationError.stack,
    });
  });

  it('should handle not found error correctly', () => {
    const notFoundError = new Error('Not Found');
    res.statusCode = constants.NOT_FOUND; // Set status to validation error

    errorHandler(notFoundError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Not Found',
      message: 'Not Found',
      stackTrace: notFoundError.stack,
    });
  });

  it('should handle Unauthorized error correctly', () => {
    const unauthorizedError = new Error('Unauthorized');
    res.statusCode = constants.UNAUTHORIZED; // Set status to validation error

    errorHandler(unauthorizedError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Unauthorized',
      message: 'Unauthorized',
      stackTrace: unauthorizedError.stack,
    });
  });

  it('should handle Forbidden error correctly', () => {
    const forbiddenError = new Error('Forbidden');
    res.statusCode = constants.FORBIDDEN; // Set status to validation error

    errorHandler(forbiddenError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Forbidden',
      message: 'Forbidden',
      stackTrace: forbiddenError.stack,
    });
  });

  it('should handle server error correctly', () => {
    const serverError = new Error('Server Error');
    res.statusCode = constants.SERVER_ERROR; // Set status to server error

    errorHandler(serverError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Server Error',
      message: 'Server Error',
      stackTrace: serverError.stack,
    });
  });
   



});
