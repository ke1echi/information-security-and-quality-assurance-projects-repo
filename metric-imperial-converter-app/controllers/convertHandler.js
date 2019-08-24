/*
*
*
*       Complete the handler logic below
*       
*       
*/


const units = {
  'gal': {
      fullname: 'gallon',
      func: x => x * 3.78541,
      unit: 'l'    
  },
  'lbs': {
      fullname: 'pound',
      func: x => x * 0.453592,
      unit: 'kg'   
  },
  'mi': {
      fullname: 'mile',
      func: x => x * 1.60934,
      unit: 'km'
  },
  'km': {
      fullname: 'kilometer',
      func: x => x / 1.60934,
      unit: 'mi'
  },
  'kg': {
      fullname: 'kilogram',
      func: x => x / 0.453592,
      unit: 'lbs'
  },
  'l': {
      fullname: 'liter',
      func: x => x / 3.78541,
      unit: 'gal'
  }
}


function ConvertHandler() {

  this.divideFraction = function (input) {
    input = input.join( '' ).split( '/' );
    return input.length <= 2
            ? input.reduce( ( a,b ) => a / b )
            : null;
  }
  
  this.getNum = function (input) {
    input = input.toLowerCase( ).match( /[^a-z]/gi ) || 1;
    if (input !== 1) {
      return this.divideFraction(input);
    }
    return 1;
  }

  
  this.getUnit = function(input) {
    if (!input) {
      return null;
    }

    // Seperate between init and unit. eg: ?input=3.1mi => ['', '3.1', 'mi']
    let unit = input.split(/^([0-9/\.]*)([a-z]*)$/i)[2];
    
    if (typeof unit !== 'string') {
      return null
    }
    // Not in units object (lowercase version)
    if (!units[unit.toLowerCase()]) {
      return null;
    }
    else {
      return unit;
    }
  };
  
  this.getReturnUnit = function(initUnit) {
    if (units[initUnit.toLowerCase()]) {
      return units[initUnit.toLowerCase()].unit;
    }
    else {
      return null;
    }
  };

  this.spellOutUnit = function (unit) {
    return units[unit.toLowerCase()].fullname;
  };
  
  this.convert = function(initNum, initUnit) {
    return Number(units[initUnit].func(initNum).toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum > 1 ? `${initNum} ${units[initUnit].fullname}s` : `${initNum} ${units[initUnit].fullname}`} converts to ${returnNum > 1 ? `${returnNum} ${units[units[initUnit].unit].fullname}s` : `${returnNum} ${units[units[initUnit].unit].fullname}`}`;
  };
  
}

module.exports = ConvertHandler;