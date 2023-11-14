// Error handling middleware
exports.handleError = (error) => {
    console.error(error);

    let errorMessage = 'Internal Server Error';
    let statusCode = 500;

    if (error instanceof CustomError) {
        errorMessage = error.message;
        statusCode = error.statusCode;
    }

    return { error: errorMessage, statusCode };
};

// CustomError class for handling specific errors
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Example usage:
// throw new CustomError('Custom error message', 400);
