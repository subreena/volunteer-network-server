const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const port = 5000;
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkdxj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const app = express()
app.use(bodyParser.json())
app.use(cors())

const serviceAccount = require("./volunteer-network-bysubreena-firebase-adminsdk-e7msw-cf58e9eae7.json");

admin.initializeApp({
    credential: admin.credential.applicationDefault(serviceAccount),
    databaseURL: `https://${process.env.DB_NAME}.firebaseio.com`
});

app.get('/', (req, res) => {
    res.send('Hello from volunter-network db. Everything is fine here up to now!');
})


client.connect(err => {
    const taskCollection = client.db("volunteerNetwork").collection("tasks");
    const taskChosenCollection = client.db("volunteerNetwork").collection("taskChosen");

    console.log("database connected successfully");

    app.post('/addTask', (req, res) => {
        const task = req.body;
        // console.log(task);
        taskChosenCollection.insertOne(task)
            .then(result => {
                // console.log(result);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allTask', (req, res) => {
        taskCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/allTask/:name', (req, res) => {
        taskChosenCollection.find({ name: req.params.name })
            .toArray((err, documents) => {
                console.log(documents);
                res.send(documents);
            })
    })
    app.get('/allTask/email', (req, res) => {
        taskChosenCollection.filter({email: req.params.email})
        .toArray( (err , documents) => {
            console.log(documents);
            res.send(documents);
        // const bearer = req.headers.authorization;
        // if (bearer && bearer.startsWith('Bearer ')) {
        //     const idToken = bearer.split(' ');
        //     console.log({ idToken });
        //     admin.auth().verifyIdToken(idToken)
        //         .then(function (decodedToken) {
        //             let tokenEmail = decodedToken.email;
        //             const queryEmail = req.query.email;
        //             console.log(tokenEmail , queryEmail);
        //             if (tokenEmail == queryEmail) {
        //                 taskChosenCollection.find({ email: queryEmail })
        //                     .toArray((err, documents) => {
        //                         res.status(200).send(documents);
        //                     })
        //             }
        //             else {
        //                 res.status(401).send('unauthorized access');
        //             }


        //         }).catch(function (error) {
        //             console.log(error);
        //         });
        // }
        else {
            res.status(401).send('unauthorized access');
        }

    })
})






app.listen(port);