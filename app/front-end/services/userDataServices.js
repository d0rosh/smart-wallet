app.factory('userDataServices',['$http', '$rootScope' ,function($http, $rootScope){
	return {
		getAvatar :function(){
			return $http.get('/get_user').then(
				res=>{
					$rootScope.userImg = res.data[0].img == '' ? null : 'data:image/png;base64,' + res.data[0].img;
				},
				err=>{
					$rootScope.userImg = null;
				}
			)
		}
	}
}]);