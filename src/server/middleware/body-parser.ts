import express from 'express'

// JSON body parser middleware
export const jsonParser = express.json()

// URL-encoded body parser middleware
export const urlencodedParser = express.urlencoded({ extended: true })
