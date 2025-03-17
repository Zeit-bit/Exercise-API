const express = require("express");
const api = express();

const entries = [
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

const PORT = 3001;
api.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
