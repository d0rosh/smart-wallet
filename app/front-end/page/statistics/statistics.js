app.controller('statisticsCtrl',['$http', '$q' ,function($http, $q){
	let vm = this;
    vm.category = [];
    vm.sourse = [];
    vm.saves = [];

    vm.total_category = 0;
    vm.total_sourse = 0;
    vm.total_saves = 0;
	
	var chart_incomes = [];
	var chart_outcomes = [];
	var chart_saves = [];
    
    var category_id = [];
    var sourse_id = [];

    function procent(obj, total, arr, title, page){
        for(var i = 0; i < obj.length; i++){
            obj[i].procent = obj[i]._sum != 0 ? (obj[i]._sum * 100 / total).toFixed(1) : 0;
			arr.push([obj[i]._name, obj[i]._sum, obj[i].procent]);
        };
		chart(arr, title, page, total);
    }

	$http.get('/all_statistics').then(
		res => {
			category_id = res.data.category;
            sourse_id = res.data.sourse;
			vm.saves = res.data.saves;
			
			for(let i = 0; i < vm.saves.length; i++){
				vm.total_saves += vm.saves[i]._sum;
			}
			
			procent(vm.saves, vm.total_saves, chart_saves, 'Saves', 'saves');
			vm.send('all');
		},
		err => console.log(err)
	);

    vm.send = function(mon){
       
        vm.total_category = 0;
        vm.total_sourse = 0;
		chart_incomes = [];
		chart_outcomes = [];
		
		var date = new Date();
		var year = date.getFullYear();
		
        $http.get('/statistics?year='+year+'&month='+mon).then(
            res=>{
                for(let i = 0; i < sourse_id.length; i++){
					sourse_id[i]._sum = 0;
					sourse_id[i].procent = 0;
					
					for(let j = 0; j < res.data.income.length; j++){
						if (res.data.income[j].sourse_id == sourse_id[i].id){
							sourse_id[i]._sum += res.data.income[j]._sum;
						}
					}
					vm.total_sourse += sourse_id[i]._sum;
				}
				
				for(let i = 0; i < category_id.length; i++){
					category_id[i]._sum = 0;
					category_id[i].procent = 0;
					
					for(let j = 0; j < res.data.outcome.length; j++){
						if (res.data.outcome[j].category_id == category_id[i].id){
							category_id[i]._sum += res.data.outcome[j]._sum;
						}
					}
					vm.total_category += category_id[i]._sum;
				}
				
				vm.sourse = sourse_id.filter(data => data._sum > 0);
				vm.category = category_id.filter(data => data._sum > 0);
				procent(vm.sourse, vm.total_sourse, chart_incomes, 'Sourse', 'sourse');
				procent(vm.category, vm.total_category, chart_outcomes, 'Category', 'category');
            },
            err=>console.log(err)
        );
	}
	
	
	function chart(data, title, page, total){
		
		Highcharts.chart(page, {

			title: {
				text: title
			},
			
			subtitle: {
				text: 'Total: '+total
			},
			
			tooltip: {
				pointFormat: 'Percent: <b>{point.percentage:.1f}%</b>'
			},
			
			series: [{
				type: 'pie',
			   allowPointSelect: true,
				keys: ['name', 'y', 'procent'],
				data: data,
				showInLegend: true
			}]
		});
	}
}]);