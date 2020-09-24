const express = require('express');
const path = require('path');

const app = express();
const frontDistPath = path.resolve(__dirname, '../dist');
app.use('/', express.static(frontDistPath));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
