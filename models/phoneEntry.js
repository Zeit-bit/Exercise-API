const { Schema, model, default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });

const phoneEntrySchema = new Schema({
  name: { type: String, minLength: 3 },
  number: String,
});
phoneEntrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = model("PhoneEntry", phoneEntrySchema);
