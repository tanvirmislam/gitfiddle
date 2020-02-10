  
const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
    let msg = { "name": "gitfiddle", "message": "Hello World!" };
    response.send(JSON.stringify(msg));
});

module.exports = router;
