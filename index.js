const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

const CategoriesCollection = client.db("resellerCube").collection("categories");
const UsersCollection = client.db("resellerCube").collection("users");
const ProductsCollection = client.db("resellerCube").collection("products");
const BookedCollection = client.db("resellerCube").collection("booked");


// categories get api
app.get("/categoires", async (req, res) => {
    try {
        const query = {};
        const cursor = CategoriesCollection.find(query);

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

// user post api
app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const email = req.body.email;
        const query = { email };
        const getEmail = await UsersCollection.findOne(query);

        if (getEmail?.email === email) {
            return res.send({ message: 'User allready save in database' });
        } else {
            const result = await UsersCollection.insertOne(user);
            res.send({
                success: true,
                message: "Successfully inserted data",
                data: result,
            });
        }

    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

// products get api
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { category_id: id }
        const cursor = ProductsCollection.find(query);

        const products = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully load",
            data: products,
        });

    } catch (error) {
        // console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.get('/myorders', async (req, res)=> {
    try {
        const email = req.query.email;
        const query = {email: email}
        const cursor = BookedCollection.find(query);

        const myOrders = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully load",
            data: myOrders,
        });

    } catch (error) {
        // console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

app.post('/booked', async (req, res) => {
    try {
        const user = req.body;

        const result = await BookedCollection.insertOne(user);
        res.send({
            success: true,
            message: "Successfully inserted data",
        });


    } catch (error) {
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