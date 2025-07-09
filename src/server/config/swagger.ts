import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'
import path from 'node:path'

// 动态构建服务器 URL
function getServerUrl(): string {
  const baseUrl = env['BASE_URL'] || env['SWAGGER_BASE_URL']
  if (baseUrl) {
    return baseUrl
  }

  // 开发环境默认使用 localhost
  if (env.isDevelopment()) {
    return `http://localhost:${env['PORT']}`
  }

  // 生产环境使用相对路径，让浏览器自动确定域名
  return ''
}

// 动态获取 Swagger 文档路径
function getSwaggerDocsPaths(apiType: 'admin' | 'content'): string[] {
  const isDev = env.isDevelopment()

  if (isDev) {
    // 开发环境：使用源文件路径
    console.log(`[Swagger] 开发环境 - 使用源文件路径`)
    return [
      `./src/server/docs/swagger/${apiType}/**/*.ts`,
      `./src/server/docs/swagger/${apiType}/**/*.js`,
      `./src/server/routes/${apiType}/**/*.ts`,
      `./src/server/routes/${apiType}/**/*.js`
    ]
  } else {
    // 生产环境：使用复制到 server 目录的文件
    const swaggerBasePath = path.join(import.meta.dirname, '../docs/swagger')
    console.log(`[Swagger] 生产环境 - 使用复制的文件路径: ${swaggerBasePath}`)

    return [
      path.join(swaggerBasePath, `${apiType}/**/*.ts`),
      path.join(swaggerBasePath, `${apiType}/**/*.js`)
    ]
  }
}

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
        url: `${getServerUrl()}${env['API_PREFIX']}`,
        description: env['NODE_ENV'] === 'production' ? 'Production server' : 'Development server'
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
  apis: getSwaggerDocsPaths('admin')
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
        url: `${getServerUrl()}${env['API_PREFIX']}`,
        description: env['NODE_ENV'] === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        accessTokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token',
          description: 'Access Token - 必需'
        },
        appNameAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-app-name',
          description: 'Application Name - 必需'
        },
        channelAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-channel',
          description: 'Channel Name - 必需'
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
  apis: getSwaggerDocsPaths('content')
}

// Generate Swagger specification
const contentSpecs = swaggerJsdoc(contentOptions)

export { contentSpecs }
