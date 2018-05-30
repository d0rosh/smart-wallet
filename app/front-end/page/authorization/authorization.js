app.controller('authCtrl',['$http', '$location', '$rootScope', 'budgetServices' ,function($http, $location, $rootScope, budgetServices) {
	let vm = this;
	vm.request = {};
	vm.registerField = false;
	vm.errors = {};
	vm.showLoader = false;
	vm.formAction = "Sign In";
	vm.showInput = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		vm.registerField = !vm.registerField;
		vm.request = {};
		vm.errors = {};


		if (vm.registerField) {
			vm.formAction = "Register";
		}else {
			vm.formAction = "Sign In";
		}
	}

	vm.sendData = function(formName){
		formName.$setUntouched();
		formName.$setPristine();
		$rootScope.userImg = ''; 
		vm.showLoader = true;
		vm.errors = {};
		if (vm.registerField) {
			$http.post('/registration', vm.request)
			.then(
				res=>{
					vm.request = {}
					vm.showLoader = false;
					$location.path('/');
				},
				err=>{
					vm.errors = err.data;
					vm.showLoader = false;
				}
			)
		}else {
			$http.post('/signin', vm.request)
			.then(
				res=>{
					vm.request = {}
					vm.showLoader = false;
					$location.path('/');
				},
				err=>{
					vm.errors = err.data;
					vm.showLoader = false;
				}
			)
		}
	}
}]);