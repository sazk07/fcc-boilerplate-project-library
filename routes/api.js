/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const { isValidObjectId } = require('mongoose');
const Book = require('../models/book');
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      const books = await Book.find()
      res.json(books)
    })

    .post(async function (req, res){
      const { title } = req.body
      if (!title) {
        return res.send("missing required field title")
      }
      const book = await Book.create({
        title,
        comments: [],
        commentcount: 0
      })
      res.json({
        title: book.title,
        _id: book._id
      })
    })

    .delete(async function(req, res){
      await Book.deleteMany({})
      res.json("complete delete successful")
    });



  let commentcount = 0
  const comments = []
  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      // is id valid?
      const isValidId = isValidObjectId(bookid)
      if (!isValidId) {
        return res.send("no book exists")
      }
      const foundBook = await Book.findById(bookid)
      if (!foundBook) {
        return res.send("no book exists")
      }
      res.json(foundBook)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function(req, res){
      let bookid = req.params.id;
      let { comment } = req.body
      comments.push(comment)
      commentcount++
      // is id valid?
      const isValidId = isValidObjectId(bookid)
      if (!isValidId) {
        return res.send("no book exists")
      }
      // check for empty comment
      if (!comment) {
        return res.send("missing required field comment")
      }
      const updateObj = {
        comments,
        commentcount
      }
      const [foundBook, record] = await Promise.all([
        Book.findById(bookid),
        Book.findByIdAndUpdate(bookid, updateObj, { upsert: true, new: true })
      ])
      if (!foundBook) {
        return res.send("no book exists")
      }
      res.json(record)
      //json res format same as .get
    })

    .delete(async function(req, res){
      let bookid = req.params.id;
      // is id valid?
      const isValidId = isValidObjectId(bookid)
      if (!isValidId) {
        return res.send("no book exists")
      }
      const [foundBook, record] = await Promise.all([
        Book.findById(bookid),
        Book.findByIdAndDelete(bookid)
      ])
      if (!foundBook) {
        return res.send("no book exists")
      }
      res.send("delete successful")
      //if successful response will be 'delete successful'
    });

};
