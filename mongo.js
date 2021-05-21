const mongoose = require("mongoose");
require("dotenv").config();

const inputsLength = process.argv.length;

// verify fields , two options -> get Persons or Add Person
if (inputsLength < 3) {
  console.log(
    `Please provide password : is required , node mongo.js <password>`
  );
  process.exit(1);
} else if (inputsLength > 3 && inputsLength < 5) {
  console.log(
    `Please provide all arguments : are required , node mongo.js <password> <name> <number> `
  );
  process.exit(1);
}
// password argument from cli
const mongodbPassword = process.argv[2];
// Url connection mongodb
const url = `mongodb+srv://db_user:${mongodbPassword}@cluster0.rewnd.mongodb.net/phonebook?retryWrites=true&w=majority`;

// connect to mongo db
async function connectDB() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(error);
  }
}

// declaring person schema
const personSchema = mongoose.Schema({
  name: String,
  number: String,
});
// declaring person model
const Person = mongoose.model("Person", personSchema);

// Get all person in phonebook
function getPersons() {
  Person.find({}).then((persons) => {
    persons = persons
      .map((person) => {
        return `${person.name} ${person.number}`;
      })
      .join("\n");

    console.log(`Phonebook:\n${persons}`);
    mongoose.connection.close();
  });
}
// Add Person to phonebook
function addPerson(name, number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(({ name, number }) => {
    console.log(`${name} with phone ${number} was added to phonebook`);
    mongoose.connection.close();
  });
}

if (inputsLength == 3) {
  getPersons();
} else if (inputsLength == 5) {
  // Arguments to add person
  const name = process.argv[3];
  const number = process.argv[4];

  addPerson(name, number);
}

connectDB();
