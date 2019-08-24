/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'symbol');
          assert.property(res.body.stockData, 'companyName');
          assert.property(res.body.stockData, 'price');
          assert.isNumber(res.body.stockData.price);
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end(function(err, res) {
          console.log(res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'likes');
          assert.isNumber(res.body.stockData.likes);
          assert.equal(res.body.stockData.likes, 1);
          done();
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'likes');
          assert.isNumber(res.body.stockData.likes);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: [ 'goog', 'msft' ] })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          
          assert.property(res.body.stockData[0], 'symbol');
          assert.property(res.body.stockData[0], 'companyName');
          assert.property(res.body.stockData[0], 'latestPrice');
          assert.isNumber(res.body.stockData[0].latestPrice);

          assert.property(res.body.stockData[1], 'symbol');
          assert.property(res.body.stockData[1], 'companyName');
          assert.property(res.body.stockData[1], 'latestPrice');
          assert.isNumber(res.body.stockData[1].latestPrice);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: [ 'goog', 'msft' ], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');

          assert.property(res.body.stockData[0], 'symbol');
          assert.property(res.body.stockData[0], 'companyName');
          assert.property(res.body.stockData[0], 'latestPrice');
          assert.isNumber(res.body.stockData[0].latestPrice);
          assert.property(res.body.stockData[0], 'like');

          assert.property(res.body.stockData[1], 'symbol');
          assert.property(res.body.stockData[1], 'companyName');
          assert.property(res.body.stockData[1], 'latestPrice');
          assert.isNumber(res.body.stockData[1].latestPrice);
          assert.property(res.body.stockData[1], 'like');
          done();
        });
      });
    });

});