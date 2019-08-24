/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){

      let input = req.query.input;

      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input.toLowerCase());

      if (initNum === null && initUnit === null) {
        return res.send("invalid number and unit");
      }
      if (initNum === null) {
        return res.send("invalid number");
      }
      if (initUnit === null) {
        return res.send("invalid unit");
      }

      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      
      //res.json
      res.json({
        initNum: Number(initNum),
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: toString,
      });
      
    });
    
};
