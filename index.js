const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8080;

require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello from volunter-network db. Everything is fine here up to now!');
})


app.listen(port);