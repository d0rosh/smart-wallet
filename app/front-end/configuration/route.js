app.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
        templateUrl: '/page/home/home.html',
        controller: 'homeCtrl',
        controllerAs: 'ctrl',
        data: {
           private: true
        },
        title: 'Home'
        
    });
    $routeProvider.when('/account', {
        templateUrl: '/page/account/account.html',
        controller: 'accountCtrl',
        controllerAs: 'ctrl',
        data: {
           private: true
        },
        title: 'Account'
    });
    $routeProvider.when('/history', {
        templateUrl: '/page/history/history.html',
        controller: 'historyCtrl',
        controllerAs: 'ctrl',
        data: {
           private: true
        },
        title: 'History'
    });
    $routeProvider.when('/statistics', {
        templateUrl: '/page/statistics/statistics.html',
        controller: 'statisticsCtrl',
        controllerAs: 'ctrl',
        data: {
           private: true
        },
        title: 'Statistic'
    });
    $routeProvider.when('/login', {
        templateUrl: '/page/authorization/authorization.html',
        controller: 'authCtrl',
        controllerAs: 'ctrl',
        title: 'Login'
    });
    $routeProvider.otherwise({
		templateUrl: '/page/error/error.html',
        title: '404 ERROR'
        // redirectTo: '/error'
	});
});

app.run(function($rootScope, authServices,$route,$location, budgetServices, userDataServices) { 
    $rootScope.$on('$routeChangeStart',
        function(evt, next, current) {
            authServices.getAuth().then(
                res=>{
                    budgetServices.getBudget();
                    userDataServices.getAvatar();
                    $rootScope.showhead = true;
                    if (next.originalPath == '/login') {
                        $location.path('/');
                    }else {
                        $location.path($location.$$url);
                    }
                },
                err=>{
                    $rootScope.showhead = false;
                    if (next.data) {
                        $location.path('/login');
                    }else {
                        $location.path($location.$$url);
                    }
                } 
            );
            $rootScope.title = next.title;
        }
    );
});