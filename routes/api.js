/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { default: mongoose } = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [{ type: String }],
});
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        if (books.length === 0) return res.json("no book exists");
        const data = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          };
        });
        return res.json(data);
      } catch (error) {}
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) return res.json("missing required field title");
      try {
        const newBook = Book({ title });
        const saveBook = await newBook.save();
        if (!saveBook) return res.json("Server Problem");
        return res.json({ _id: saveBook._id, title: saveBook.title });
      } catch (error) {
        console.error(error);
        return res.json("Server Problem");
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) return res.json("missing required field comment");
      try {
        const findBook = await Book.findById(bookid);
        if (!findBook) return res.json("no book exists");
        findBook.comments.push(comment);
        const saveBook = await findBook.save();
        return res.json({
          _id: saveBook._id,
          title: saveBook.title,
          comments: saveBook.comments,
        });
      } catch (error) {}
      console.error(error);
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
