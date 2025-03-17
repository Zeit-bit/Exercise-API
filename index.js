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

api.get("/api/persons", (req, res) => {
  res.json(entries);
});

api.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${entries.length} people</p><p>${Date()}</p>`
  );
});

const PORT = 3001;
api.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
