const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    name: "taylor",
    number: "394940",
    id: 5,
  },
  {
    name: "cata",
    number: "4300302-202",
    id: 6,
  },
  {
    name: "diego",
    number: "39493-30303",
    id: 7,
  },
  {
    name: "Graham Bell",
    number: "304-421430",
    id: 8,
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/person/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id == id);

  if (!person) {
    return res.status(400).json({
      msg: "Person not found",
      note: {},
    });
  }
  res.status(200).json({
    msg: "Person found",
    person,
  });
});

app.post("/api/person", (req, res) => {
  let person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "fill in all fields",
    });
  }

  const existPerson = persons.find((p) => p.name === person.name);

  if (existPerson) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const id = generateId();

  person = {
    id,
    ...person,
  };
  persons.push(person);

  res.status(201).json({
    msg: "Person added",
    person,
  });
});

app.delete("/api/person/:id", (req, res) => {
  const { id } = req.params;

  const person = persons.find((person) => person.id == id);

  if (!person) {
    return res.status(404).json({
      msg: `Person with id ${id} was not found`,
    });
  }

  persons = persons.filter((person) => person.id != id);

  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info of ${persons.length} people</p>
            <p>${new Date()}</p>`);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});
