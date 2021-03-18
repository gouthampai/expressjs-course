/* eslint-disable no-param-reassign */
const express = require('express');
const Book = require('../models/bookModel');

const router = express.Router();
router.route('/')
  .post((req, res) => {
    const book = new Book(req.body);
    book.save();
    res.status(201).json(book);
  })
  .get((req, res) => {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }

      return res.json(books);
    });
  });

router.use('/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) {
      return res.send(err);
    }

    if (book) {
      req.book = book;
      return next();
    }

    return res.sendStatus(404);
  });
});

router.route('/:bookId')
  .get((req, res) => res.json(req.book))
  .put((req, res) => {
    const { book } = req;
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.read = req.body.read;
    book.save((err) => {
      if (err) {
        return res.send(err);
      }

      return res.json(book);
    });
    return res.json(book);
  })
  .patch((req, res) => {
    const { book } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }

    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });
    book.save((err) => {
      if (err) {
        return res.send(err);
      }

      return res.json(book);
    });
  })
  .delete((req, res) => {
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }

      return res.sendStatus(204);
    });
  });

module.exports = router;
