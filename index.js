const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());


const uri = "mongodb://localhost:27017";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2lhfrsa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        await client.connect();
        console.log("Database connected");
    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnect();

const Categories = client.db("resellerCube").collection("categories");


// categories get api
app.get("/categoires", async (req, res) => {
    try {
        const query = {};
        const cursor = Categories.find(query);


        const categoires = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully load",
            data: categoires,
        });

    } catch (error) {
        // console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
});


app.get('/', async (req, res) => {
    res.send('reseller cube server is successfully running');
})

app.listen(port, () => {
    console.log(`resseller cube is running on ${port}`);
})