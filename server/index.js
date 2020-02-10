const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./router/api/routes');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', routes);

// Client app routes redirection
app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (request, response) => {
    response.sendFile(__dirname, 'public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server listening to PORT: ${PORT}`);
});
