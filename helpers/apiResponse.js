exports.apiResponse = (status = 'success', message = '', data = {}, httpCode = 200, response) => {
    if (!response) {
        console.error('Response object is missing or invalid.');
        return;
    }
    response?.status(httpCode).json({
        status,
        message,
        data
    })
}