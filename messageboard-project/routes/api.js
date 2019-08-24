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
let ObjectId   = mongoose.Types.ObjectId;
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

// Define schema
const Schema = mongoose.Schema;
var userSchema = new Schema({
  text: { type: String, required: true },
  created_on: Date,
  bumped_on: Date,
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  board: String,
  replies: [ ],
  replycount: { type: Number, default: 0 }
});

// Compile model from schema
var messageBoardModel = mongoose.model('messageBoardModel', userSchema);

module.exports = function (app) {
  app.route('/api/threads/:board')
    .post((req, res) => {
      let { text, delete_password } = req.body;
      let board = req.body.board || req.params.board;

      // Check required fields
      if (!board && !text && !delete_password) {
        return res.send('Please fill required fields.');
      }
      
      new messageBoardModel({
        text: text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password: delete_password,
        board: board
      }).save((err, doc) => {
        if (err) {
          return res.send(`Error occurred ${err}`);
        }
        res.redirect(`/b/${board}`);
      });
    })

    .put((req, res) => {
      let { thread_id, report_id } = req.body;
      let _id = thread_id || report_id;

      messageBoardModel.findById(_id, (err, result) => {
        if (err) {
          return res.send(`Error occurred: ${err}`);
        }
        result.reported = true
        result.save(() => {
          res.send(`Successfully reported thread: ${result._id}`);
        });
      });
    })

    .get((req, res) => {
      let board = req.body.board || req.params.board;
      messageBoardModel.find({ board }, (err, result) => {
        if (err) return res.send(`Error occured: ${err}`);
        res.json(result);
      });
    })

    .delete((req, res) => {
      let { thread_id, delete_password } = req.body;

      messageBoardModel.findById(thread_id, (err, thread) => {
        if (err) {
          return res.send(`Could not find thread id`);
        }
        else if (delete_password !== thread.delete_password) {
          return res.send(`Incorrect password for ${thread_id}`);
        }
        messageBoardModel.findOneAndDelete({ _id: thread_id }, (err, result) => {
          if (err) {
            return res.send(`Error occurred: ${err}`);
          }
          res.send(`Thread ${result._id} deleted successfully`);
        });
      });
    });
    
  app.route('/api/replies/:board')
    .post((req, res) => {
      let { thread_id, text, delete_password } = req.body;
      let board = req.body.board || req.params.board;

      messageBoardModel.findById(thread_id, (err, thread) => {
        if (err) {
          return res.send(`Error occurred: ${err}`);
        }
        if (!thread) {
          return res.send(`Invalid thread`);
        }
        let reply = {
          _id: new ObjectId(),
          text: text,
          created_on: new Date(),
          delete_password: delete_password,
          reported: false
        };
        thread.bumped_on = reply.created_on;
        thread.replies.unshift(reply);
        thread.replycount += 1;

        thread.save((err, result) => {
          if (err) {
            return res.send(`Error occurred: ${err}`);
          }
          res.redirect(`/b/${board}/${thread_id}`);
        });
      });

    })

    .get((req, res) => {
      const board = req.params.board;
      const thread_id = req.query.thread_id;

      messageBoardModel.findById(thread_id, (err, thread) => {
        if (err) {
          return res.send(`Error while fetching threads.`);
        }
        if (!thread) {
          return res.send(`Invalid thread`);
        }
        res.json({
          _id: thread._id,
          board: thread.board,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,        
          replies: thread.replies
        });
      });
    })

    .put((req, res) => {
      let { thread_id, reply_id } = req.body;
      
      messageBoardModel.findById(thread_id, (err, result) => {
  			if(err) {
          return res.send('Could not find thread.');
        }
  			let replies = result.replies.map(obj => Object.assign({}, obj));
  			replies.find((doc) => doc._id == reply_id).reported = true;
  			result.replies = replies;
  			result.save((err, reply) => {
          if (err) return res.send(`Error occurred: ${err}`);
  				res.send(`Successfully reported ${reply_id}`);
  			})
  		})
    }) 
    
    .delete((req, res) => {
      let { thread_id, reply_id, delete_password } = req.body;

      messageBoardModel.findById(thread_id, (err, thread) => {
        let replyIndex = thread.replies.findIndex(reply => reply._id == reply_id);
        if(err) {
          return res.send(`Could not find thread id`);
        }
        else if(delete_password !== thread.replies[replyIndex].delete_password) {
          return res.send(`Incorrect password for ${thread.replies[replyIndex]._id}`);
        }
        
        let replies = thread.replies.map((obj) => Object.assign({}, obj));
        replies.find((e) => e._id == reply_id).text = `[DELETED]`;
        thread.replies = replies
        thread.save((err, result) => {
          if(err) {
            return res.send(`Error occurred: ${err}`);
          }
          console.log("result: ", result);
          res.send(`Deleted ${reply_id} successfully`);
        });
      });
    });

};
