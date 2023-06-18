'use strict'

const { Schema, model } = require("mongoose");

const BookSchema = new Schema({
  title: String,
  commentcount: Number,
  comments: [String]
})

module.exports = model("Book", BookSchema)
