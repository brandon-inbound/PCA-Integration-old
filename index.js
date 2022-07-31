require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cron = require('node-cron');
const opn = require('open');
const app = express();
const { renderView } = require('./views/test.view');
const PORT = 3000;

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error('Missing CLIENT_ID or CLIENT_SECRET environment variable.');
}

// Use a session to keep track of client ID
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', renderView);

app.get('/error', (req, res) => {
  // res.setHeader('Content-Type', 'text/html');
  // res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

app.listen(PORT, () =>
  console.log(`=== Starting your app on http://localhost:${PORT} ===`)
);

cron.schedule('*/2 * * * *', () => opn(`http://localhost:${PORT}`));
