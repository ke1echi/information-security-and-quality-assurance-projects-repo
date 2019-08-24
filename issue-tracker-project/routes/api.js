/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
require('dotenv').config();


// This project needs a db 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

// Define schema
const Schema = mongoose.Schema;
var userSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
},
{ versionKey: false });

// Compile model from schema
var issueTrackerModel = mongoose.model('issueTrackerModel', userSchema);

module.exports = function (app) {

  app.route('/api/issues/apitest')
  
    .get(function (req, res) {
      let project = {projectName: req.params.project};
      let queryToFind = Object.assign(project, req.query);

      issueTrackerModel.find(queryToFind, (err, docs) => {
        err ? `Error occurred while retrieving document` : res.json(docs);
      });
    })
    
    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by } = req.body;

      // Check required fields
      if (!issue_title && !issue_text && !created_by) {
        return res.send('missing required fields');
      }

      // Save document to DB
      var data = new issueTrackerModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      });

      data.save((err, result) => {
        if (err) {
          return res.send(`Error occurred while saving document`);
        }
        res.json(result);
      });

    })
    
    .put(function (req, res) {
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      // No _id provided
      if(!_id) {
        return res.send(`no _id sent`);
      }

      // If no fields are sent return 'no updated field sent'
      if(!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        return res.send(`no updated field sent`);
      }
  
      // Validate document id
      if (mongoose.Types.ObjectId.isValid(_id)) {
        issueTrackerModel.findOneAndUpdate({ _id: _id }, 
          { $set:
            { 
              issue_title: issue_title,
              issue_text: issue_text,
              created_by: created_by,
              assigned_to: assigned_to,
              status_text: status_text,
              updated_on: new Date(),
              open: open == 'false' ? false : true
            } 
          }, { new: true }, function(err, doc) {
            if (err) {
              return res.send(`Something went wrong while updating document`);
            }

            // Output responds to client
            res.send(`successfully updated`);
          });

      }
      else {
        // Invalid _id
        res.send(`could not update ${_id}`);
      }

    })
    
    .delete(function (req, res){
      let project = req.params.project;

      // If no _id provided
      if(!req.body._id) {
        return res.send(`no _id sent`);
      }

      // Validate document
      if (mongoose.Types.ObjectId.isValid(req.body._id)) {
        issueTrackerModel.findOneAndDelete({_id: req.body._id}, (err, doc) => {
          if (err) {
            return res.send(`Error occured while deleting document`);
          }
          else if (!doc) {
            return res.send(`Could not find document: ${req.body._id}`);
          }
          console.log(`Deleted document: ${doc._id}`);
          res.send(`deleted ${req.body._id}`);
        });
      }
      else {
        return res.send(`could not delete '${req.body._id}`);
      }

    });
    
};
