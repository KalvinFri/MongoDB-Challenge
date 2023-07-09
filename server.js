require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb')
const ProfileModel = require('./models/profile');

const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

// set up middleware
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {console.log('Connected to Mongo DB')}, err => {console.log(`Cannot connect to DB ${err}`)});

// routes
app.get('/', (req, res) => res.status(200).send('Server is Running.'));

    app.get('/homepage', (req, res) => {
        async function run() {
        try {
            const database = client.db("blog-forms");
            const profiles = database.collection("profiles");
            const result = await profiles.find().toArray();
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
        };
        }
        run().catch(console.dir);
    });    

app.post('/homepage', (req, res) => {
        const incomingData = req.body;
    
        try {
            const newProfile = new ProfileModel(incomingData);
            newProfile.save();
    
            res.status(200).send({
                message: 'Saved Profile'
            })
        } catch (err) {
            console.log(err);
        }
    });

app.delete('/homepage', (req, res) => {
async function run() {
    try {
      const database = client.db("blog-forms");
      const profiles = database.collection("profiles");
      const result = await profiles.deleteOne();
      if (result.deletedCount === 1) {
        res.status(200).send({
            message: 'Successfully deleted one document.'
        });
      } else {
        res.status(200).send({
            message: 'No documents found.'
        });
      }
    } catch (err) {
        console.log(err)
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});