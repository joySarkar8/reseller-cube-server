const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    res.send('reseller cube server is successfully running');
})

app.listen(port, () => {
    console.log(`resseller cube is running on ${port}`);
})