const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

const logger = require('./middleware/logger.middleware')
const { notFound, errorHandler } = require('./middleware/error.middleware')

const apiRoutes = require('./routes/api.routes')

const app = express()

const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api', limiter)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
