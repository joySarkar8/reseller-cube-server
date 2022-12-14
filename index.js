const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());


// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2lhfrsa.mongodb.net/?retryWrites=true&w=majority`;
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
const BlogCollection = client.db("resellerCube").collection("blogs");


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

app.get("/advertise", async (req, res) => {
    try {
        const advertise = req.query.advertise;
        const query = { advertise };

        // const query = {
        //     advertise
        // }

        const cursor = ProductsCollection.find(query);

        const products = await cursor.toArray();
        const updatedProducts = products.filter(product => !product.status)

        // console.log(products);
        res.send({
            success: true,
            message: "Successfully load",
            data: updatedProducts,
        });

    } catch (error) {
        // console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

// blog api
app.get("/blog", async (req, res) => {
    try {
        const query = {};

        const cursor = BlogCollection.find(query);
        const blogs = await cursor.toArray();
        
        res.send({
            success: true,
            message: "Successfully load",
            data: blogs,
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


// seller private route
app.get('/users/seller/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email };

        const getEmail = await UsersCollection.findOne(query);

        if (getEmail.role === 'seller') {
            res.send({
                success: true,
                message: "Unathorozed User",
            });
        }
        else {
            res.send({
                success: false,
                message: "Authorozed User",
            });
        }


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


// admin private route
app.get('/users/admin/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email };

        const getEmail = await UsersCollection.findOne(query);

        if (getEmail.role === 'admin') {
            res.send({
                success: true,
                message: "Unathorozed User",
            });
        }
        else {
            res.send({
                success: false,
                message: "Authorozed User",
            });
        }


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.get("/products", async (req, res) => {
    try {
        const category = req.query.category;
        const query = { category };


        const cursor = ProductsCollection.find(query);

        const products = await cursor.toArray();
        const updatedProducts = products.filter(product => !product.status)

        res.send({
            success: true,
            message: "Successfully load",
            data: updatedProducts,
        });

    } catch (error) {
        // console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
});

//-------------------------------------------------


app.delete('/buyer/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await UsersCollection.deleteOne(query);


        res.send({
            success: true,
            data: result,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
})

app.delete('/seller/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await UsersCollection.deleteOne(query);


        res.send({
            success: true,
            data: result,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
})


app.get('/allseller', async (req, res) => {
    try {
        const query = {
            role: 'seller'
        };

        const cursor = UsersCollection.find(query);
        const result = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully inserted data",
            data: result,
        });


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

// all buyer get api
app.get('/allbuyer', async (req, res) => {
    try {
        const query = {
            role: 'buyer'
        };

        const cursor = UsersCollection.find(query);
        const result = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully inserted data",
            data: result,
        });


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


// make seller api
app.patch('/make-seller/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await UsersCollection.updateOne(query, { $set: req.body });

        res.send({
            success: true,
            message: "Successfully inserted data",
            data: result,
        });


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.get('/myproduct', async (req, res) => {
    try {
        const email = req.query.email;
        const query = { email };
        const cursor = ProductsCollection.find(query);
        const result = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully inserted data",
            data: result,
        });


    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

app.post('/add-product', async (req, res) => {
    try {
        const product = req.body;

        const result = await ProductsCollection.insertOne(product);
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

app.get('/myorders', async (req, res) => {
    try {
        const email = req.query.email;
        const query = { buyer_email: email }
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


// product update api---------------------------------------------
app.put('/update-product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const cursor = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = { $set: req.body }

        const result = await ProductsCollection.updateOne(cursor, updatedDoc, options);
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

// seller update api for blue tick
app.put('/update-seller/:id', async (req, res) => {
    try {
        const email = req.params.id;
        const cursor = { email };
        const options = { upsert: true };
        const updatedDoc = { $set: req.body }

        const user = await UsersCollection.updateOne(cursor, updatedDoc, options);
        const product = await ProductsCollection.updateMany(cursor, updatedDoc, options);
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