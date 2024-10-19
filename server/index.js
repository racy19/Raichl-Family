API_PORT = 5000;
DB_instance = "mongodb://127.0.0.1:27017/personsdb";
const mongoose = require("mongoose");
const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
require("./cors")(app);
app.listen(API_PORT, () => console.log('Listening on port ' + API_PORT + '...'));

mongoose.connect(DB_instance, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.error('Could not connect to MongoDB... ', error));

// schema for collecting data of people
const personSchema = new mongoose.Schema({
    name: String,
    surname: String,
    birthname: String,
    gender: String,
    dateBirth: Date,
    dateDeath: {
        type: Date,
        default: null
    },
    motherID: {
        type: String,
        default: null
    },
    fatherID: {
        type: String,
        default: null
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
},{ strict: false });

const Person = mongoose.model('Person', personSchema);

// entry validation
function validatePerson(person) {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        surname: Joi.string().min(2).required(),
        dateBirth: Joi.date(),
        gender: Joi.string(),
        birthname: Joi.string(),
        motherID: Joi.string(),
        fatherID: Joi.string(),
    });
    return schema.validate(person);
}

async function getAllPeople() {
    const people = await Person.find();
    console.log(people) // control log for getting all people from database
}

// CRUD operations on people database
const path = '/people';
const id = '/:id';

app.get(path, (req, res) => {
    Person.find().then(people => { res.json(people) })
});

app.get(path + id, (req, res) => {
    const id = String(req.params.id);
    Person.findById(id, (err, result) => {
        if (err || !result) {
            res.status(404).send("Osoba nebyla nalezena.");
        }
        else
            res.json(result);
    });
});

app.post(path, (req, res) => {
    const { error } = validatePerson(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        Person.create(req.body)
            .then(result => { res.json(result) })
            .catch(err => { res.send("Nepodařilo se uložit osobu!") });
    }
});

app.put(path + id, (req, res) => {
    const { error } = validatePerson(req.body, false);
    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        Person.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(result => { res.json(result) })
            .catch(err => { res.send("Nepodařilo se uložit osobu!") });
    }
});

app.delete(path + id, (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result)
                res.json(result);
            else
                res.status(404).send("Osoba s daným id nebyla nalezena!");
        })
        .catch(err => { res.send("Chyba při mazání osoby!") });
});

getAllPeople();