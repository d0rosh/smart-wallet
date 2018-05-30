app.directive('myLoader' ,function(){
  return {
		scope:{
			show:'='	
		},
		restrict: 'E',
		transclude: false,
	    replace:false,
	    templateUrl:'/directives/loader/loader.html'
	}
});