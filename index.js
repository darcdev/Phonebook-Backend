const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/note");
const handleErrors = require("./middlewares/error");
const handleNotFound = require("./middlewares/notFound");

app.use(express.json());

morgan.token("content", function getContent(req) {
  return req.content;
});

app.use(content);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

function content(req, res, next) {
  req.content = JSON.stringify(req.body);
  next();
}

app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        msg: "Person not found",
        person: {},
      });
    }
    res.status(200).json({
      msg: "Person found",
      person,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  let { name, number } = req.body;
  try {
    if (!name || !number) {
      return res.status(400).json({
        msg: "fill in all fields",
      });
    }
    let person = new Person({ name, number });
    person = await person.save();
    res.status(201).json({
      msg: "Person added",
      person,
    });
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;
  let person = {
    name,
    number,
  };
  try {
    person = await Person.findByIdAndUpdate(id, person, { new: true });
    return res.status(200).json({
      msg: "Person updated",
      person,
    });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        msg: `Person with id ${id} was not found`,
      });
    }

    await Person.findByIdAndRemove(id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (req, res) => {
  const persons = await Person.find({});
  res.send(`<p>Phonebook has info of ${persons.length} people</p>
            <p>${new Date()}</p>`);
});

app.use(handleNotFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});
