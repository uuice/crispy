import express from 'express'

// JSON body parser middleware with enhanced configuration
export const jsonParser = express.json({
  limit: '10mb', // Set maximum request body size
  strict: true, // Only accept arrays and objects
  type: 'application/json' // Only parse JSON content type
})

// URL-encoded body parser middleware with enhanced configuration
export const urlencodedParser = express.urlencoded({
  extended: true,
  limit: '10mb', // Set maximum request body size
  parameterLimit: 1000 // Limit number of parameters
})

// Error handling middleware for body parsing
export const bodyParserErrorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('Body parsing error:', err.message)
    res.status(400).json({
      error: 'Invalid JSON format',
      message: 'The request body contains invalid JSON',
      details: err.message
    })
    return
  }

  if (err.type === 'entity.too.large') {
    console.error('Request body too large:', err.message)
    res.status(413).json({
      error: 'Request entity too large',
      message: 'The request body exceeds the maximum allowed size'
    })
    return
  }

  next(err)
}

// Combined body parser middleware with logging
export const bodyParserWithLogging = [jsonParser, urlencodedParser, bodyParserErrorHandler]
