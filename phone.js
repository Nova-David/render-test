const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log("need a passowrd");
  process.exit(1);
}

const password = process.argv[2];


const name = process.argv[3] || null;
const phone = process.argv[4] || null;

const url = `mongodb+srv://fullstack:${password}@my-cluster.hkz5obq.mongodb.net/phonebook?retryWrites=true&w=majority&appName=my-cluster`

mongoose.set('strictQuery', true);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Entry = new mongoose.model('Entry', entrySchema);

if (name && phone) {

  const entry = new Entry({ name, phone });

  entry.save().then(result => {
    console.log(`added ${result.name} number ${result.phone} to phonebook`);
    mongoose.connection.close();
  });

}

else {
  Entry.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.phone}`);
    })
    mongoose.connection.close()
  });
}