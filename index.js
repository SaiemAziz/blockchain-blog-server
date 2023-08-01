require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000

app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.DB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
    try{
        let blogsCollection = client.db("blockchain-blog").collection("blogs")
        app.get('/', (req, res) => {
            res.send('Welcome to block chain blog server')
        })

        app.get('/blogs', async (req, res) => {
            let query = {}
            if(req.query.id)
                query = {_id : new ObjectId(req.query.id)}
            let allBlogs = await blogsCollection.find(query).toArray()
            res.send({allBlogs})
        })
        app.delete('/blogs', async (req, res) => {
            let query = {_id: new ObjectId(req.query.id)}
            let result = await blogsCollection.deleteOne(query)
            res.send({result})
        })
        app.put('/blogs', async (req, res) => {
            let query = {_id : new ObjectId(req.query.id)}
            let updateDoc = {
                $set: {
                    ...req.body
                }
            }
            let result = await blogsCollection.updateOne(query, updateDoc, {upsert: true})
            res.send({result})
        })
        app.post('/blogs', async (req, res) => {
            let body = req.body
            let result = await blogsCollection.insertOne(body)
            res.send({result})
        })
    }
    finally {

    }
}


run().catch(console.dir);

app.listen(port, async () => {
    try{
        await client.connect()
        await client.db("blockchain-blog").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch(e){
        console.log(e);
    }
    console.log(`listening on ${port}`);
})