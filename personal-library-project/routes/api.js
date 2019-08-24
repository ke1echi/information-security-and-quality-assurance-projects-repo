/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect   = require('chai').expect;
const mongoose = require('mongoose');
require('dotenv').config()

// This project needs a db 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
// mongoose.connect(uri, { useFindAndModify: false });

// Define schema
const Schema = mongoose.Schema;
var userSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: [ ],
  commentcount: {
    type: Number,
    default: 0
  }
}, { versionKey: false });

// Compile model from schema
var libraryModel = mongoose.model('libraryModel', userSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {

      libraryModel.find({}, (err, doc) => {
        if (err) {
          return res.send(`Error occurred while retrieving document.`);
        }
        else if (!doc.length) {
          return res.send(`no books found.`);
        }
        res.json(doc);
      });

    })
    
    .post(function (req, res){
      let title = req.body.title;

      // Check required field
      if (!title) {
        return res.send('missing required field');
      }

      // Save document to DB
      new libraryModel({
        title: title
      }).save((err, doc) => {
        if (err) {
          return res.send(`Error occurred while saving document`);
        }
        res.json({
          _id: doc._id,
          title: doc.title
        });
      });

    })
    
    .delete(function(req, res){
      libraryModel.deleteMany({}, (err) => {
        if (err) {
          return res.send('complete delete failed!');
        }
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.send('missing required fields');
      }
      libraryModel.findById(bookid, (err, doc) => {
        if (err) {
          return res.send(`no book exists`);
        }
        res.json({
          _id: doc._id,
          title: doc.title,
          comments: doc.comments,
          commentcount: doc.commentcount
        });
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid) {
        return res.send('missing required fields');
      }
      libraryModel.findById(bookid, (err, doc) => {
        if (err) {
          return res.send(`no book exists`);
        }
        // Check for comments
        if (comment) {
          doc.commentcount++;
          doc.comments.push(comment);
        }
        
        doc.save((err) => {
          if (err) {
            return res.send(`Error saving document.`);
          }
          res.json({
            _id: doc._id,
            title: doc.title,
            comments: doc.comments,
            commentcount: doc.commentcount
          });
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
      if (!bookid) {
        return res.send('missing required fields');
      }

      libraryModel.findByIdAndRemove(bookid, (err, doc) => {
        if (err) {
          return res.send('Could not delete document');
        }
        res.send('delete successful');
      });
    });
  
};
