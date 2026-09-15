module.exports.register = function (Handlebars, options) {
  "use strict";

  Handlebars.registerHelper('concat', function() {
    var args = Array.prototype.slice.call(arguments, 0, -1);
    return args.join('');
  });

  Handlebars.registerHelper('ifeq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options && options.inverse(this);
  });

  //{{plus1 @index}} returns @index + 1
  Handlebars.registerHelper("plus1", function (value, options) {
    return parseInt(value) + 1;
  });
  
  Handlebars.registerHelper("multiplyQB", function(price, qty) {
    var total = parseFloat(price * qty);
    total = total.toFixed(2);
    return total;
  });

  Handlebars.registerHelper("isFirst", function (value, options) {
    if (parseInt(value) === 1) {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper("parseInt", function (value, options) {
    return parseInt(value);
  });

  Handlebars.registerHelper("binomialCoeff", function (n, k) {
    if (typeof n !== "number" || typeof k !== "number") {
      return false;
    } else {
      var coeff = 1;
      for (var x = n - k + 1; x <= n; x++) coeff *= x;
      for (x = 1; x <= k; x++) coeff /= x;
      return coeff;
    }
  });

  Handlebars.registerHelper("ifEven", function (n, options) {
    if (n % 2 == 0) {
      return options.fn(this);
    }
  });
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });

  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });


  Handlebars.registerHelper("repeatThird", function (n, options) {
    options = options || {};
    var _data = {};
    if (options._data) {
      _data = Handlebars.createFrame(options._data);
    }

    var content = "";
    var count = n - 1;
    for (var i = 0; i <= count; i++) {
      if (i && i % 3 === 0) {
        _data = {
          index: parseInt(i + 1, { auto: n }),
        };
        content += options.fn(this, { data: _data });
      }
    }
    return new Handlebars.SafeString(content);
  });
};
