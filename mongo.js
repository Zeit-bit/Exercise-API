const mongoose = require("mongoose");

// Saves the process arguments in their corresponding variables
const [password, name, number] = process.argv.slice(2);

// Error handling
if (process.argv.length > 5) {
  console.log("Too many arguments");
  process.exit(1);
}

if (!password) {
  console.log("Missing password");
  process.exit(1);
}

if (name && !number) {
  console.log("Missing new entry information");
  console.log("- Add the missing argument (number), to create a new entry");
  console.log("- Leave only the password, to view all entries");
  process.exit(1);
}

// MongoDB Atlas database connection
const url = `mongodb+srv://reyesalvarezpatricio:${password}@cluster0.ahi3g.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

// Creation of schema and model
const phoneEntrySchema = new mongoose.Schema({ name: String, number: String });
const PhoneEntry = mongoose.model("PhoneEntry", phoneEntrySchema);

// Execute if only the password argument was introduced
if (password && !name && !number) {
  // Show all phonebook entries
  console.log("Phonebook:");
  PhoneEntry.find({}).then((result) => {
    result.forEach((phoneEntry) =>
      console.log(`${phoneEntry.name} ${phoneEntry.number}`)
    );
    mongoose.connection.close();
  });
}

// Execute if all arguments were introduced
if (password && name && number) {
  // Adds a new entry
  const phoneEntry = new PhoneEntry({
    name: name,
    number: number,
  });

  phoneEntry.save().then((phoneEntry) => {
    console.log(
      `Added ${phoneEntry.name} number ${phoneEntry.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
