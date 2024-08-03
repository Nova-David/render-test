require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note');

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
  Note.find({}).then(notes => {
    res.json(notes);
  })
});

app.post('/api/notes', (req, res, next) => {
  const body = req.body;

  if (!body.content)
    return res.status(400).json({
      error: 'content missing'
    });

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  });

  note.save().then(savedNote => {  
    res.json(savedNote);
  }).catch(error => next(error));
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findById(id).then(note => {
    if (note) res.json(note);
    else res.status(404).end();
  }).catch(error => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  Note.findByIdAndDelete(id).then(result => {
    res.status(204).end();
  }).catch(error => next(error));
});

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, {new: true, runValidators: true, context: 'query'}).then(updatedNote => {
    res.json(updatedNote);
  }).catch(error => next(error));
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint '});
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') return res.status(400).send({error: 'malformatted id'});
  else if (error.name === 'ValidationError') return res.status(400).send({error: error.message});

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});