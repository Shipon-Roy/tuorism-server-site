const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhhgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try{
        await client.connect();
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');
        const registerCollection = database.collection('register');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //My order
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const booking = await servicesCollection.findOne(query);
            res.send(booking);
        })

        // add services 
        app.post('/addServices', async (req, res) => {
            const services = await servicesCollection.insertOne(req.body);
            res.send(services);
        })

        //Register
        app.post('/register', async (req, res) => {
            const register = await registerCollection.insertOne(req.body);
            res.send(register);
        })

        //DELETE 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const deleted = await servicesCollection.deleteOne(query);
            res.send(deleted);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism Server Running successfull');
});

app.listen(port, () => {
    console.log('Tourism server Run at port', port);
})