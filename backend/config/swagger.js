const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'QuizMaster API',
            version: '1.0.0',
            description: 'API pour l\'application QuizMaster - Gestion de quiz pour professeurs et eleves',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Serveur de developpement',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentification et gestion des utilisateurs' },
            { name: 'Quizzes', description: 'Gestion des quiz (professeurs)' },
            { name: 'Questions', description: 'Gestion des questions (professeurs)' },
            { name: 'Results', description: 'Gestion des resultats' },
            { name: 'Payments', description: 'Paiements Stripe' },
        ],
        paths: {
            '/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Inscription d\'un nouvel utilisateur',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password', 'role'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'prof@test.com' },
                                        password: { type: 'string', minLength: 8, example: 'Test1234!' },
                                        role: { type: 'string', enum: ['prof', 'eleve'], example: 'prof' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'Inscription reussie' },
                        400: { description: 'Validation echouee' },
                        409: { description: 'Email deja utilise' },
                    },
                },
            },
            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Connexion d\'un utilisateur',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'prof@test.com' },
                                        password: { type: 'string', example: 'Test1234!' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Connexion reussie' },
                        401: { description: 'Email ou mot de passe incorrect' },
                    },
                },
            },
            '/auth/me': {
                get: {
                    tags: ['Auth'],
                    summary: 'Recuperer mon profil',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Profil utilisateur' },
                        401: { description: 'Non authentifie' },
                    },
                },
            },
            '/auth/logout': {
                post: {
                    tags: ['Auth'],
                    summary: 'Deconnexion',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Deconnexion reussie' },
                    },
                },
            },
            '/quizzes': {
                get: {
                    tags: ['Quizzes'],
                    summary: 'Liste de mes quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Liste des quiz' },
                        403: { description: 'Acces refuse (pas prof)' },
                    },
                },
                post: {
                    tags: ['Quizzes'],
                    summary: 'Creer un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title'],
                                    properties: {
                                        title: { type: 'string', minLength: 3, maxLength: 100, example: 'Quiz Culture Generale' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'Quiz cree' },
                        403: { description: 'Limite de quiz atteinte' },
                    },
                },
            },
            '/quizzes/{id}': {
                get: {
                    tags: ['Quizzes'],
                    summary: 'Detail d\'un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: {
                        200: { description: 'Detail du quiz' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
                put: {
                    tags: ['Quizzes'],
                    summary: 'Modifier un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title'],
                                    properties: {
                                        title: { type: 'string', example: 'Quiz Modifie' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Quiz modifie' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
                delete: {
                    tags: ['Quizzes'],
                    summary: 'Supprimer un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: {
                        204: { description: 'Quiz supprime' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
            },
            '/quizzes/join/{code}': {
                get: {
                    tags: ['Quizzes'],
                    summary: 'Rejoindre un quiz par code (eleve)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' }, example: 'ABC12' }],
                    responses: {
                        200: { description: 'Quiz avec questions' },
                        404: { description: 'Code invalide' },
                    },
                },
            },
            '/questions/quiz/{quizId}': {
                get: {
                    tags: ['Questions'],
                    summary: 'Liste des questions d\'un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: {
                        200: { description: 'Liste des questions' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
            },
            '/questions': {
                post: {
                    tags: ['Questions'],
                    summary: 'Ajouter une question (prof)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['quiz_id', 'type', 'question_text', 'options', 'correct_answer'],
                                    properties: {
                                        quiz_id: { type: 'integer', example: 1 },
                                        type: { type: 'string', enum: ['qcm', 'vf'], example: 'qcm' },
                                        question_text: { type: 'string', minLength: 10, example: 'Quelle est la capitale de la France ?' },
                                        options: { type: 'array', items: { type: 'string' }, example: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'] },
                                        correct_answer: { type: 'string', example: 'Paris' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'Question creee' },
                        400: { description: 'Validation echouee' },
                        403: { description: 'Quiz non autorise' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
            },
            '/questions/{id}': {
                put: {
                    tags: ['Questions'],
                    summary: 'Modifier une question (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['type', 'question_text', 'options', 'correct_answer'],
                                    properties: {
                                        type: { type: 'string', enum: ['qcm', 'vf'] },
                                        question_text: { type: 'string' },
                                        options: { type: 'array', items: { type: 'string' } },
                                        correct_answer: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Question modifiee' },
                        404: { description: 'Question non trouvee' },
                    },
                },
                delete: {
                    tags: ['Questions'],
                    summary: 'Supprimer une question (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: {
                        204: { description: 'Question supprimee' },
                        404: { description: 'Question non trouvee' },
                    },
                },
            },
            '/results': {
                post: {
                    tags: ['Results'],
                    summary: 'Enregistrer un score (eleve)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['quiz_id', 'score'],
                                    properties: {
                                        quiz_id: { type: 'integer', example: 1 },
                                        score: { type: 'integer', minimum: 0, example: 8 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'Score enregistre' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
            },
            '/results/me': {
                get: {
                    tags: ['Results'],
                    summary: 'Mes resultats (eleve)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Liste de mes resultats' },
                    },
                },
            },
            '/results/quiz/{quizId}': {
                get: {
                    tags: ['Results'],
                    summary: 'Resultats d\'un quiz (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: {
                        200: { description: 'Liste des resultats' },
                        404: { description: 'Quiz non trouve' },
                    },
                },
            },
            '/payments/create-checkout': {
                post: {
                    tags: ['Payments'],
                    summary: 'Creer une session de paiement Stripe (prof)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'URL de checkout Stripe' },
                        409: { description: 'Deja premium' },
                    },
                },
            },
            '/payments/success': {
                get: {
                    tags: ['Payments'],
                    summary: 'Verifier le succes du paiement (prof)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'session_id', in: 'query', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'Statut du paiement' },
                        404: { description: 'Paiement non trouve' },
                    },
                },
            },
        },
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
