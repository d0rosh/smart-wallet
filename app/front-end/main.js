var app = angular.module('app',['ngRoute', 'naif.base64','ngAnimate','angularCSS','ngMessages']);

app.controller('myctrl', ['$http', '$location', '$rootScope' ,function($http, $location, $rootScope){
	let vm = this;
	vm.toggleOverlay = false;
	
	vm.toggleMenu = function(){
		let nav = angular.element(document.querySelector('nav'));
		nav.toggleClass('open');
		vm.toggleOverlay = !vm.toggleOverlay;
	}

	vm.logout = function(){
		$http.post('/current/user/destroy')
		.then(
			res=>{
				$location.path('/login');
			},
			err=>console.log(err)
		)
	}
}]);