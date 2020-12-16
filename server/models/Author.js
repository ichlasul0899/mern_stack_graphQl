const mongoose = require('mongoose');
const Schema = mongoose.Schema;

AuthorSchema = new Schema({
    name: String,
    age: Number
})

module.exports = mongoose.model("Author", AuthorSchema);
