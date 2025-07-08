import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'

// Swagger configuration options
const adminOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crispy API Documentation',
      version: '1.0.0',
      description: 'API documentation for Crispy application',
      contact: {
        name: 'API Support',
        email: 'support@crispy.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${env['PORT']}${env['API_PREFIX']}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        // Common response schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        // Login schemas
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username or email'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT token'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/server/routes/admin/**/*.ts', './src/server/routes/admin/**/*.js']
}

// Generate Swagger specification
const adminSpecs = swaggerJsdoc(adminOptions)

export { adminSpecs }

// Swagger configuration options
const contentOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crispy API Documentation',
      version: '1.0.0',
      description: 'API documentation for Crispy application',
      contact: {
        name: 'API Support',
        email: 'support@crispy.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${env['PORT']}${env['API_PREFIX']}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        accessTokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token',
          description: 'Access token for API authentication'
        },
        appNameAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-app-name',
          description: 'Application name for API authentication'
        },
        channelAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-channel',
          description: 'Channel name for API authentication'
        }
      },
      schemas: {
        // Common response schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        // Access token schemas
        AccessTokenValidation: {
          type: 'object',
          required: ['app_name', 'channel'],
          properties: {
            app_name: {
              type: 'string',
              description: 'Application name'
            },
            channel: {
              type: 'string',
              description: 'Channel name'
            }
          }
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        }
      }
    },
    security: [
      {
        accessTokenAuth: [],
        appNameAuth: [],
        channelAuth: []
      }
    ]
  },
  apis: ['./src/server/routes/content/**/*.ts', './src/server/routes/content/**/*.js']
}

// Generate Swagger specification
const contentSpecs = swaggerJsdoc(contentOptions)

export { contentSpecs }
