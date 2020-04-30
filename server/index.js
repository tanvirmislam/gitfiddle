const express = require('express')
const cors = require('cors')
const routes = require('./router/api/routes')
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())

// API routes
app.use('/api', routes)

// Client app routes redirection
app.use(express.static(path.resolve(__dirname, '../public')))

app.get(/.*/, (request, response) => {
  response.sendFile(__dirname, '../public/index.html')
})

app.listen(PORT, () => {
  console.log(`Server listening to PORT: ${PORT}`)
})
