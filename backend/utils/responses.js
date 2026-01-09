/**
 * Helpers pour standardiser les reponses API
 */

function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data
    })
}

function errorResponse(res, code, message, statusCode = 400, field = null) {
    const error = { code, message }
    if (field) {
        error.field = field
    }
    return res.status(statusCode).json({
        success: false,
        error
    })
}

module.exports = {
    successResponse,
    errorResponse
}
