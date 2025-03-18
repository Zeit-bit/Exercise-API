const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = express();

let entries = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  res.send(
    `<p>Phonebook has info for ${entries.length} people</p><p>${Date()}</p>`
  );
});

/*************************
    Phonebook Entries
**************************/

// Get all entries
api.get("/api/persons", (req, res) => {
  res.json(entries);
});

// Get individual entry
api.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const entryFound = entries.find((e) => e.id === id);

  entryFound ? res.send(entryFound) : res.status(404).end();
});

// Delete individual entry
api.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const entryFound = entries.find((e) => e.id === id);

  if (entryFound) {
    entries = entries.filter((e) => e.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// Post new entry
api.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "name and/or number missing" });

  const entryWithSameNameFound = entries.find((e) => e.name === body.name);
  if (entryWithSameNameFound)
    return res.status(400).json({ error: "name must be unique" });

  const newEntry = {
    id: String(Math.random()),
    ...body,
  };

  entries = [...entries, newEntry];

  res.status(201).json(newEntry);
});

const PORT = process.env.PORT || 3001;
api.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
