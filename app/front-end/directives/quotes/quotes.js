app.directive('quotes',  function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) { 
      var replaceQuotes = function(value) {
        if (typeof(value) == typeof(undefined))
            return value;
        var parsedValue = value.toString().replace("'", '"').replace('`', '"');

        return parsedValue;
      }
 
      var parseViewValue = function(value) {
        var viewValue = replaceQuotes(value);
        ngModel.$setViewValue(viewValue);
        ngModel.$render();
 
        // Return what we want the model value to be
        
        return viewValue;
      }
 
      var formatModelValue = function(value) {
        var modelValue = value;
        ngModel.$modelValue = modelValue;
        
        return replaceQuotes(modelValue);
      }
 
      ngModel.$parsers.push(parseViewValue);
      ngModel.$formatters.push(formatModelValue);
    }
  };
})