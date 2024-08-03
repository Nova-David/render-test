const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@my-cluster.hkz5obq.mongodb.net/noteApp?retryWrites=true&w=majority&appName=my-cluster`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
//   content: 'HTML is easy',
//   important: true
// });

// note.save().then(res => {
//   console.log('Note saved!');
//   mongoose.connection.close();
// });

Note.find({}).then(res => {
  res.forEach(note => {
    console.log(note);
  });

  mongoose.connection.close();
});