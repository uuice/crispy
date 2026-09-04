import type { Payload, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

export type OpenAPIDocument = {
  openapi: '3.0.3'
  info: {
    title: string
    version: string
    description: string
  }
  servers: { url: string; description: string }[]
  tags: { name: string; description?: string }[]
  paths: Record<string, Record<string, unknown>>
  components: {
    securitySchemes: Record<string, unknown>
    schemas: Record<string, unknown>
  }
}

const PLUGIN_COLLECTION_SLUGS = [
  'redirects',
  'forms',
  'form-submissions',
  'search',
  'exports',
  'imports',
  'audit-logs',
  'payload-mcp-api-keys',
] as const

function jsonResponse(description: string, schemaRef?: string) {
  return {
    description,
    content: {
      'application/json': {
        schema: schemaRef ? { $ref: schemaRef } : { type: 'object' },
      },
    },
  }
}

function errorResponses() {
  return {
    '401': jsonResponse('Unauthorized'),
    '403': jsonResponse('Forbidden'),
  }
}

function collectionListOperation(slug: string, label: string) {
  return {
    tags: [slug],
    summary: `List ${label}`,
    description: 'Payload REST list. Supports where, sort, depth, limit, page.',
    parameters: [
      { name: 'depth', in: 'query', schema: { type: 'integer', default: 0 } },
      { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
      { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
      { name: 'sort', in: 'query', schema: { type: 'string' } },
      { name: 'where', in: 'query', schema: { type: 'string' }, description: 'JSON query object' },
    ],
    responses: {
      '200': jsonResponse('Paginated documents', '#/components/schemas/PayloadListResponse'),
      ...errorResponses(),
    },
    security: [{ cookieAuth: [] }, { usersApiKey: [] }],
  }
}

function collectionCreateOperation(slug: string, label: string) {
  return {
    tags: [slug],
    summary: `Create ${label}`,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', additionalProperties: true },
        },
      },
    },
    responses: {
      '201': jsonResponse('Created document'),
      ...errorResponses(),
    },
    security: [{ cookieAuth: [] }, { usersApiKey: [] }],
  }
}

function collectionByIdOperations(slug: string, label: string) {
  const idParam = {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }

  return {
    get: {
      tags: [slug],
      summary: `Get ${label} by ID`,
      parameters: [
        idParam,
        { name: 'depth', in: 'query', schema: { type: 'integer', default: 0 } },
      ],
      responses: {
        '200': jsonResponse('Document'),
        '404': jsonResponse('Not found'),
        ...errorResponses(),
      },
      security: [{ cookieAuth: [] }, { usersApiKey: [] }],
    },
    patch: {
      tags: [slug],
      summary: `Update ${label}`,
      parameters: [idParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { type: 'object', additionalProperties: true },
          },
        },
      },
      responses: {
        '200': jsonResponse('Updated document'),
        ...errorResponses(),
      },
      security: [{ cookieAuth: [] }, { usersApiKey: [] }],
    },
    delete: {
      tags: [slug],
      summary: `Delete ${label}`,
      parameters: [idParam],
      responses: {
        '200': jsonResponse('Deleted'),
        ...errorResponses(),
      },
      security: [{ cookieAuth: [] }, { usersApiKey: [] }],
    },
  }
}

function buildCollectionPaths(collections: SanitizedCollectionConfig[]): Record<string, unknown> {
  const paths: Record<string, unknown> = {}
  const seen = new Set<string>()

  for (const collection of collections) {
    if (seen.has(collection.slug)) continue
    seen.add(collection.slug)

    const label =
      typeof collection.labels?.singular === 'string'
        ? collection.labels.singular
        : collection.slug

    paths[`/api/${collection.slug}`] = {
      get: collectionListOperation(collection.slug, label),
      post: collectionCreateOperation(collection.slug, label),
    }

    paths[`/api/${collection.slug}/{id}`] = collectionByIdOperations(collection.slug, label)
    paths[`/api/${collection.slug}/count`] = {
      get: {
        tags: [collection.slug],
        summary: `Count ${label}`,
        responses: { '200': jsonResponse('Count result') },
        security: [{ cookieAuth: [] }, { usersApiKey: [] }],
      },
    }
  }

  return paths
}

function buildGlobalPaths(globals: SanitizedGlobalConfig[]): Record<string, unknown> {
  const paths: Record<string, unknown> = {}

  for (const global of globals) {
    const label = typeof global.label === 'string' ? global.label : global.slug

    paths[`/api/globals/${global.slug}`] = {
      get: {
        tags: ['Globals'],
        summary: `Get global: ${label}`,
        responses: { '200': jsonResponse('Global document'), ...errorResponses() },
        security: [{ cookieAuth: [] }, { usersApiKey: [] }],
      },
      post: {
        tags: ['Globals'],
        summary: `Update global: ${label}`,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { type: 'object', additionalProperties: true } },
          },
        },
        responses: { '200': jsonResponse('Updated global'), ...errorResponses() },
        security: [{ cookieAuth: [] }, { usersApiKey: [] }],
      },
    }
  }

  return paths
}

function buildCustomPaths(): Record<string, unknown> {
  return {
    '/api/users/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': jsonResponse('Login success with token / user'),
          '401': jsonResponse('Invalid credentials'),
        },
      },
    },
    '/api/users/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        responses: { '200': jsonResponse('Logged out') },
        security: [{ cookieAuth: [] }],
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current user',
        responses: { '200': jsonResponse('Current user'), '401': jsonResponse('Unauthorized') },
        security: [{ cookieAuth: [] }, { usersApiKey: [] }],
      },
    },
    '/api/users/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh auth token',
        responses: { '200': jsonResponse('New token') },
        security: [{ cookieAuth: [] }],
      },
    },
    '/api/graphql': {
      post: {
        tags: ['GraphQL'],
        summary: 'GraphQL endpoint',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GraphQLRequest' },
            },
          },
        },
        responses: { '200': jsonResponse('GraphQL result') },
        security: [{ cookieAuth: [] }, { usersApiKey: [] }],
      },
    },
    '/api/mcp': {
      post: {
        tags: ['MCP'],
        summary: 'MCP JSON-RPC endpoint',
        description: 'Payload MCP plugin. Use Bearer MCP API Key or users API-Key.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/McpJsonRpcRequest' },
            },
          },
        },
        responses: { '200': jsonResponse('JSON-RPC response') },
        security: [{ mcpBearer: [] }, { usersApiKey: [] }],
      },
    },
    '/api/ai/agent': {
      post: {
        tags: ['AI'],
        summary: 'Admin AI Agent chat (SSE stream)',
        description:
          'Function-calling assistant. Requires Admin session and ai:use. Events are text/event-stream.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AiAgentRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'SSE stream',
            content: {
              'text/event-stream': {
                schema: { type: 'string' },
              },
            },
          },
          '503': jsonResponse('AI disabled'),
          ...errorResponses(),
        },
        security: [{ cookieAuth: [] }],
      },
    },
    '/api/openapi.json': {
      get: {
        tags: ['Internal'],
        summary: 'OpenAPI 3.0 specification (auto-generated)',
        description: 'Requires Admin session cookie. Used by /admin/api-docs Swagger UI.',
        responses: {
          '200': jsonResponse('OpenAPI document'),
          '401': jsonResponse('Unauthorized'),
        },
        security: [{ cookieAuth: [] }],
      },
    },
    '/api/graphql-playground': {
      get: {
        tags: ['GraphQL'],
        summary: 'GraphQL Playground UI',
        description: 'Requires Admin session cookie. Interactive GraphQL IDE for logged-in staff only.',
        responses: {
          '200': { description: 'GraphQL Playground HTML' },
          '401': jsonResponse('Unauthorized'),
        },
        security: [{ cookieAuth: [] }],
      },
    },
  }
}

function buildSchemas(): Record<string, unknown> {
  return {
    PayloadListResponse: {
      type: 'object',
      properties: {
        docs: { type: 'array', items: { type: 'object' } },
        totalDocs: { type: 'integer' },
        limit: { type: 'integer' },
        page: { type: 'integer' },
        totalPages: { type: 'integer' },
        hasNextPage: { type: 'boolean' },
        hasPrevPage: { type: 'boolean' },
      },
    },
    LoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
    GraphQLRequest: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        variables: { type: 'object' },
        operationName: { type: 'string' },
      },
    },
    McpJsonRpcRequest: {
      type: 'object',
      required: ['jsonrpc', 'method', 'id'],
      properties: {
        jsonrpc: { type: 'string', enum: ['2.0'] },
        method: { type: 'string', example: 'initialize' },
        params: { type: 'object' },
        id: { oneOf: [{ type: 'integer' }, { type: 'string' }] },
      },
    },
    AiAgentRequest: {
      type: 'object',
      required: ['messages'],
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
          },
        },
        sessionId: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      },
    },
  }
}

function buildTags(
  collections: SanitizedCollectionConfig[],
  globals: SanitizedGlobalConfig[],
): { name: string; description?: string }[] {
  const tags = [
    { name: 'Auth', description: 'Authentication' },
    { name: 'AI', description: 'Admin AI Agent (OpenAI-compatible upstream)' },
    { name: 'MCP', description: 'Model Context Protocol' },
    { name: 'GraphQL', description: 'GraphQL API' },
    { name: 'Globals', description: 'Payload globals' },
    { name: 'Internal', description: 'Internal middleware hooks' },
  ]

  for (const collection of collections) {
    tags.push({
      name: collection.slug,
      description:
        typeof collection.labels?.plural === 'string'
          ? collection.labels.plural
          : collection.slug,
    })
  }

  for (const slug of PLUGIN_COLLECTION_SLUGS) {
    if (!tags.some((t) => t.name === slug)) {
      tags.push({ name: slug, description: 'Plugin collection' })
    }
  }

  for (const global of globals) {
    if (!tags.some((t) => t.name === `global:${global.slug}`)) {
      tags.push({
        name: `global:${global.slug}`,
        description: typeof global.label === 'string' ? global.label : global.slug,
      })
    }
  }

  return tags
}

/** Build OpenAPI 3 document from live Payload config (collections include plugin additions). */
export async function buildOpenApiDocument(
  payload: Payload,
  serverUrl: string,
): Promise<OpenAPIDocument> {
  const collections = payload.config.collections
  const globals = payload.config.globals

  return {
    openapi: '3.0.3',
    info: {
      title: 'Crispy CMS API',
      version: '3.0.0',
      description:
        'Auto-generated from Payload config at runtime. Includes REST collections/globals, Admin AI, MCP, GraphQL, and internal routes. Requires Admin login for GET /api/openapi.json. Regenerate: pnpm generate:openapi (writes public/openapi.json for local use only).',
    },
    servers: [{ url: serverUrl, description: 'Current server' }],
    tags: buildTags(collections, globals),
  paths: {
      ...(buildCollectionPaths(collections) as Record<string, Record<string, unknown>>),
      ...(buildGlobalPaths(globals) as Record<string, Record<string, unknown>>),
      ...(buildCustomPaths() as Record<string, Record<string, unknown>>),
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'payload-token',
          description: 'Payload Admin session cookie',
        },
        usersApiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Format: users API-Key <your-key>',
        },
        mcpBearer: {
          type: 'http',
          scheme: 'bearer',
          description: 'MCP API Key from Admin → MCP → API Keys',
        },
      },
      schemas: buildSchemas(),
    },
  }
}
