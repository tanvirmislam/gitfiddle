const express = require('express')
const router = express.Router()

router.get('/', async (request, response) => {
  const msg = { name: 'gitfiddle', descriptio: 'git branching visualization tool' }
  response.send(JSON.stringify(msg))
})

module.exports = router
