const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// app.options('*', cors());
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next();
}

// app.use(requestLogger);
morgan.token('content', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

let notes = [
  {
    id: "1",
    content: "HTML is easy!",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
  return String(maxId + 1);
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content)
    return res.status(400).json({
      error: 'content missing'
    });

  const note = {
    id: generateId(),
    content: body.content,
    importance: Boolean(body.importance) || false
  }

  notes = notes.concat(note);
  res.json(note);
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find(n => n.id === id);
  
  if (note) res.json(note);
  else res.status(404).end();
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter(n => n.id !== id);

  res.status(204).end();
});

app.put('/api/notes/:id', (req, res) => {
  const newNote = req.body;

  notes = notes.map(n => n.id === newNote.id ? newNote : n);
  res.json(newNote);
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint '});
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});