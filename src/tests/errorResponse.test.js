const rTracer = require('cls-rtracer');
const { constructErrorResponse } = require('../utils/errorResponse');

jest.mock('cls-rtracer', () => ({
  id: jest.fn(),
}));

describe('constructErrorResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default 500 error response with requestId', () => {
    rTracer.id.mockReturnValue('abc-123');

    const result = constructErrorResponse();

    expect(result).toEqual({
      success: false,
      message: 'Internal Server Error',
      statusCode: 500,
      requestId: 'abc-123',
    });
  });

  it('should use provided message and statusCode', () => {
    rTracer.id.mockReturnValue('req-456');

    const result = constructErrorResponse({
      message: 'Not Found',
      statusCode: 404,
    });

    expect(result).toEqual({
      success: false,
      message: 'Not Found',
      statusCode: 404,
      requestId: 'req-456',
    });
  });

  it('should include errorCode and details if provided', () => {
    rTracer.id.mockReturnValue('req-789');

    const result = constructErrorResponse({
      message: 'Validation failed',
      statusCode: 400,
      errorCode: 'VALIDATION_ERR',
      details: { field: 'email', reason: 'Invalid format' },
    });

    expect(result).toEqual({
      success: false,
      message: 'Validation failed',
      statusCode: 400,
      requestId: 'req-789',
      errorCode: 'VALIDATION_ERR',
      details: { field: 'email', reason: 'Invalid format' },
    });
  });

  it('should not include requestId if rTracer.id() returns null', () => {
    rTracer.id.mockReturnValue(null);

    const result = constructErrorResponse({ message: 'Something broke' });

    expect(result).toEqual({
      success: false,
      message: 'Something broke',
      statusCode: 500,
      requestId: undefined,
    });
  });
});
