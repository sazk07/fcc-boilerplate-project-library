const { Schema, model } = require("mongoose");

const BookSchema = new Schema({
  title: String,
  commentcount: Number,
  comments: [String]
})

const BookModel = model("Book", BookSchema)

exports.BookModel = BookModel
