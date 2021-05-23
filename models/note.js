const mongoose = require("mongoose");

const url = process.env.MONGO_DB_URI;

// Connect B
(async function connectDB() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("db connected");
  } catch (error) {
    console.log("Error to connect db");
  }
})();
// declaring person schema
const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
// declaring person model
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
