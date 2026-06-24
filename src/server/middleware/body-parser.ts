import express from 'express'

export const jsonParser = express.json({ limit: '10mb' })
export const urlencodedParser = express.urlencoded({ extended: true, limit: '10mb' })

export const bodyParserErrorHandler = (
  err: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON format' })
    return
  }

  if (typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.too.large') {
    res.status(413).json({ message: 'Request entity too large' })
    return
  }

  next(err)
}
