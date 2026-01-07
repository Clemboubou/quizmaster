/**
 * Middleware de gestion globale des erreurs
 */
function errorHandler(err, req, res, next) {
    console.error('Erreur:', err);

    // Erreur de parsing JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'Le format JSON est invalide'
            }
        });
    }

    // Erreur par defaut
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Une erreur interne est survenue'
        }
    });
}

module.exports = {
    errorHandler
};
