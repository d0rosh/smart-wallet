app.directive('hint', ['$timeout' , function($timeout){
  return {
		scope:{
			message: '='	
		},
		restrict: 'E',
		transclude: false,
	    replace: false,
	    templateUrl:'/directives/hint/hint.html',
	    css: 'directives/hint/hint.css',
        link: function(scope, elem, attr) {     	
            scope.$watch('message', function(newValue, oldValue) {
                if (newValue) {
                	elem.addClass('open');
                    $timeout(function() {
                    	elem.removeClass('open');
	            		scope.message = '';
	            	}, 2000);
            	}
            });
        }
	}
}]);