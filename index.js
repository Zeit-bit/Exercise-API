require("dotenv").config(".env");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = express();
const PhoneEntry = require("./models/phoneEntry");

api.use(cors());
api.use(express.json());
api.use(express.static("dist"));

morgan.token("object-sent", function (req, res) {
  return JSON.stringify(req.body);
});

api.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :object-sent"
  )
);

/*************************
    General Info
**************************/
api.get("/info", (req, res) => {
  PhoneEntry.estimatedDocumentCount().then((count) => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${Date()}</p>`);
  });
});

/*************************
    Phonebook Entries
**************************/

// Get all entries
api.get("/api/persons", (req, res) => {
  PhoneEntry.find({}).then((phoneEntries) => {
    res.json(phoneEntries);
  });
});

// Get individual entry
api.get("/api/persons/:id", (req, res, next) => {
  PhoneEntry.findById(req.params.id)
    .then((entryFound) => {
      entryFound ? res.json(entryFound) : res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

// Delete individual entry
api.delete("/api/persons/:id", (req, res, next) => {
  PhoneEntry.findByIdAndDelete(req.params.id)
    .then((entryFound) => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

// Post new entry
api.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "name and/or number missing" });

  const newEntry = new PhoneEntry({ ...body });

  newEntry.save().then((savedEntry) => {
    res.status(201).json(savedEntry);
  });
});

// Put to update number of an existing entry
api.put("/api/persons/:id", (req, res, next) => {
  PhoneEntry.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true }
  )
    .then((updatedEntry) => {
      res.status(202).json(updatedEntry);
    })
    .catch((error) => {
      next(error);
    });
});

const ErrorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError")
    return res.status(400).json({ error: "Malformmatted id" });

  next(error);
};

api.use(ErrorHandler);

const PORT = process.env.PORT;
api.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
