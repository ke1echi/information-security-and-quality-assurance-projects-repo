/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const fetch = require("node-fetch");
require('dotenv').config();

const baseUrl = 'https://cloud.iexapis.com/';

let ipAddressList = [];
let tickerSymbol1 = {}, tickerSymbol2 = {};

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){

      if (!req.query.stock) {
        return res.send('Enter a ticker symbol');
      }

      else if (Array.isArray(req.query.stock)) {
        let ticker1 = req.query.stock[0], ticker2 = req.query.stock[1];    
        
        // Fetch data from API
        fetch(baseUrl+'stable/stock/'+ticker1+'/quote?token='+process.env.token)
        .then((resp) => resp.json())
        .then((data1) => {
          fetch(baseUrl+'stable/stock/'+ticker2+'/quote?token='+process.env.token)
          .then((resp) => resp.json())
          .then((data2) => {

            let symbol1 = data1.symbol,
                companyName1 = data1.companyName,
                latestPrice1 = data1.latestPrice;

            let symbol2 = data2.symbol,
                companyName2 = data2.companyName,
                latestPrice2 = data2.latestPrice;
            
            let stockArr = [];

            if (req.query.like) {
              tickerSymbol1.symbol = symbol1;
              tickerSymbol1.companyName = companyName1;
              tickerSymbol1.latestPrice = latestPrice1;
              tickerSymbol1.like = 1
              stockArr.push(tickerSymbol1);

              tickerSymbol2.symbol = symbol2;
              tickerSymbol2.companyName = companyName2;
              tickerSymbol2.latestPrice = latestPrice2;
              tickerSymbol2.like = 1
              stockArr.push(tickerSymbol2);

              res.json({
                stockData: stockArr
              });
            }
            
            tickerSymbol1.symbol = symbol1;
            tickerSymbol1.companyName = companyName1;
            tickerSymbol1.latestPrice = latestPrice1;
            stockArr.push(tickerSymbol1);

            tickerSymbol2.symbol = symbol2;
            tickerSymbol2.companyName = companyName2;
            tickerSymbol2.latestPrice = latestPrice2;
            stockArr.push(tickerSymbol2);

            res.json({
              stockData: stockArr
            });

          })
          .catch(function(error) {
            return res.json({
              success: false,
              error: 'Enter a valid ticker symbol'
            });
          })
        })
        .catch(function(error) {
          return res.json({
            success: false,
            error: 'Enter a valid ticker symbol'
          });
        })
      }
      else {
        let symbol = req.query.stock;
        
        // Fetch data from API
        fetch(baseUrl+'stable/stock/'+symbol+'/quote?token='+process.env.token)
        .then((resp) => resp.json())
        .then((data) => {
          
          let symbol = data.symbol,
              companyName = data.companyName,
              latestPrice = data.latestPrice;

          const ip = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || 
                req.socket.remoteAddress || req.connection.socket.remoteAddress);

          if (req.query.like) {
            if (ipAddressList.includes(ip)) {
              res.json({
                stockData: { 
                  symbol, 
                  companyName, 
                  price: latestPrice,
                  likes: 1
                }
              });
            }
            else {
              ipAddressList.push(ip);
              res.json({
                stockData: { 
                  symbol, 
                  companyName, 
                  price: latestPrice,
                  likes: 1
                }
              });
            }
          }
          else {
            res.json({
              stockData: { 
                symbol, 
                companyName, 
                price: latestPrice
              }
            });
          }           

        })
        .catch(function(error) {
          return res.json({
            success: false,
            error: 'Enter a valid ticker symbol'
          });
        })
      } 

    });
    
};