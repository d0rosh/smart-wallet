app.factory('authServices', ['$http' ,function($http){
    return {
        getAuth: function(){
            return $http.post('/current/user');
        }
    };
}]);