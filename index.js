var assert = require('assert')

module.exports = function (options) {
  assert(options)
  var prefix = options.prefix
  var regexes = [];
  if (options.exclude) {
    options.exclude.forEach(function(excludeRule) {
      if (excludeRule instanceof RegExp) {
        regexes.push(excludeRule);
      }
    })
  }
  assert(prefix)
  if (!/\s+$/.test(prefix)) prefix += ' '
  return function (root) {
    root.eachRule(function (rule) {
      // pretty sure this splitting breaks for certain selectors
      var selectors = rule.selector.split(/\s*,\s*/g)
      rule.selector = selectors.map(function (selector) {
        if (!options.exclude) {
          return prefix + selector;
        }
        if (options.exclude.indexOf(selector) !== -1) {
          return selector;
        }
        if (regexes.length) {

          var result = prefix + selector;
          regexes.forEach(function(regex) {
            if (selector.match(regex)) {
              result = selector;
            }
          })
          return result;
        }
      }).join(', ')
    })
  }
}
