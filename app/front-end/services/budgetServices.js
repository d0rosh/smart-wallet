app.factory('budgetServices',['$http', '$rootScope' ,function($http, $rootScope){
	var date = new Date();
    
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    return {
        getBudget: function(){
            $http.get('/board?year=' + year + '&month=' + month).then(
	            res=>{
	                let data = {};
	                res.data.total_budget ? data.total_budget = res.data.total_budget : data.total_budget = 0;
	                res.data.this_month_outcome ? data.this_month_outcome = res.data.this_month_outcome : data.this_month_outcome = 0;
	                res.data.this_month_income ? data.this_month_income = res.data.this_month_income : data.this_month_income = 0;
	                data.this_month_balance = data.this_month_income - data.this_month_outcome;
	                $rootScope.budget = data;
	            },
	            err=>console.log(err)
            )
        }
    };
}]);