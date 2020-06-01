const express = require('express');

const cors = require('cors');

const path = require('path');

const history = require('connect-history-api-fallback');

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors()); // Client app routes redirection

const publicRoot = path.resolve(__dirname, '../public');
console.log(publicRoot);
app.use(express.static(publicRoot));
app.use(history());
app.get(/.*/, (request, response) => {
  response.sendFile(path.resolve(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
  console.log(`Server listening to PORT: ${PORT}`);
});