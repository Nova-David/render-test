const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB');
}).catch(error => {
  console.log('error connecting to MongoDB', error.message);
});

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
});

noteSchema.set('toJSON', { 
  transform: (document, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  }
});

module.exports = mongoose.model("Note", noteSchema);