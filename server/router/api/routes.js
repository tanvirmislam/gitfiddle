const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
    let msg = { "name": "gitfiddle", "description": "git branching visualization tool" };
    response.send(JSON.stringify(msg));
});

module.exports = router;
